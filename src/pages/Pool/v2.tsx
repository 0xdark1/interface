import { Trans } from '@lingui/macro'
import { Pair } from '@uniswap/v2-sdk'
import { L2_CHAIN_IDS } from 'constants/chains'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import JSBI from 'jsbi'
import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'

import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import Card from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { DataCard } from '../../components/earn/styled'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import FullPositionCard from '../../components/PositionCard'
import { RowBetween, RowFixed } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { BIG_INT_ZERO } from '../../constants/misc'
import { useV2Pairs } from '../../hooks/useV2Pairs'
import { useStakingInfo } from '../../state/stake/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { ThemedText } from '../../theme'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-top: 1rem;
  `};
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`
const CardBg = styled(Card)`
  background-color: ${({ theme }) => theme.bg0};
`
const TitleRow = styled(RowBetween)`
  background-color: ${({ theme }) => theme.bg0};
  border-bottom: 1px solid ${({ theme }) => theme.bg2};
  align-items: center;
  padding-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  text-align: left;
  justify-content: start;
  height: 100%;
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const EmptyProposals = styled.div`
  background-color: ${({ theme }) => theme.bg0};
  padding: 16px 12px;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Layer2Prompt = styled(EmptyProposals)`
  margin-top: 16px;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = useV2Pairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter((pool) =>
    JSBI.greaterThan(pool.stakedAmount.quotient, BIG_INT_ZERO)
  )
  const stakingPairs = useV2Pairs(stakingInfosWithBalance?.map((stakingInfo) => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter((v2Pair) => {
    return (
      stakingPairs
        ?.map((stakingPair) => stakingPair[1])
        .filter((stakingPair) => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  const ON_L2 = chainId && L2_CHAIN_IDS.includes(chainId)

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />
        {ON_L2 ? (
          <AutoColumn gap="lg" justify="center">
            <AutoColumn gap="md" style={{ width: '100%' }}>
              <Layer2Prompt>
                <ThemedText.Body color={theme.text3} textAlign="center">
                  <Trans>V2 is not available on Layer 2. Switch to Layer 1 Ethereum.</Trans>
                </ThemedText.Body>
              </Layer2Prompt>
            </AutoColumn>
          </AutoColumn>
        ) : (
          <AutoColumn gap="lg" justify="center">
            <AutoColumn gap="0" style={{ width: '100%' }}>
              <TitleRow padding={'0'}>
                <ThemedText.MediumHeader style={{ padding: '1rem 0', justifySelf: 'flex-start' }}>
                  <Trans>Your pools</Trans>
                </ThemedText.MediumHeader>
                <ButtonRow style={{ height: '100%' }}>
                  <ResponsiveButtonPrimary id="join-pool-button" as={Link} to="/add/ETH" padding="6px 8px">
                    <Text fontWeight={400} fontSize={14}>
                      <Trans>Add liquidity</Trans>
                    </Text>
                  </ResponsiveButtonPrimary>
                </ButtonRow>
              </TitleRow>

              {!account ? (
                <CardBg padding="40px">
                  <ThemedText.Body color={theme.text3} textAlign="center">
                    <Trans>Connect to a wallet to view your liquidity.</Trans>
                  </ThemedText.Body>
                </CardBg>
              ) : v2IsLoading ? (
                <EmptyProposals>
                  <ThemedText.Body color={theme.text3} textAlign="center">
                    <Dots>
                      <Trans>Loading</Trans>
                    </Dots>
                  </ThemedText.Body>
                </EmptyProposals>
              ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
                <>
                  {v2PairsWithoutStakedAmount.map((v2Pair) => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                  {stakingPairs.map(
                    (stakingPair, i) =>
                      stakingPair[1] && ( // skip pairs that arent loaded
                        <FullPositionCard
                          key={stakingInfosWithBalance[i].stakingRewardAddress}
                          pair={stakingPair[1]}
                          stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                        />
                      )
                  )}
                </>
              ) : (
                <EmptyProposals>
                  <ThemedText.Body color={theme.text3} textAlign="center">
                    <Trans>No liquidity found.</Trans>
                  </ThemedText.Body>
                </EmptyProposals>
              )}
            </AutoColumn>
          </AutoColumn>
        )}
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}
