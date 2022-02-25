import { ArrowsHorizontal16, Collaborate16, Connect16 } from '@carbon/icons-react'
import { Trans } from '@lingui/macro'
import useScrollPosition from '@react-hook/window-scroll'
import { CHAIN_INFO } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTheme from 'hooks/useTheme'
import { darken } from 'polished'
import { NavLink } from 'react-router-dom'
import { Text } from 'rebass'
import { useShowClaimPopup, useToggleSelfClaimModal } from 'state/application/hooks'
import { useUserHasAvailableClaim } from 'state/claim/hooks'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { useDarkModeManager } from 'state/user/hooks'
import { useNativeCurrencyBalances } from 'state/wallet/hooks'
import styled from 'styled-components/macro'

import { ReactComponent as LogoSmall } from '../../assets/svg/logo-small.svg'
import { ReactComponent as Logo } from '../../assets/svg/logo-text.svg'
import { ExternalLink, ThemedText } from '../../theme'
import ClaimModal from '../claim/ClaimModal'
import { CardNoise } from '../earn/styled'
import Menu from '../Menu'
import Row from '../Row'
import { Dots } from '../swap/styleds'
import Web3Status from '../Web3Status'
// import NetworkSelector from './NetworkSelector'

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  background-image: ${({ theme }) => `linear-gradient(to bottom, transparent 50%, ${theme.bg0} 50% )}}`};
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px ${({ theme, showBackground }) => (showBackground ? theme.bg2 : 'transparent;')};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;
  width: 100%;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
`

const HeaderInner = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 0;
  z-index: 21;
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  ${({ theme }) => theme.mediaWidth.upToLarge`
  grid-template-columns: 48px 1fr;
`};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  height: 4.5rem;
  padding:  0 1rem;
  grid-template-columns: 1fr 1fr;
`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding:  0 1rem;
  grid-template-columns: 36px 1fr;
`};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`

const HeaderLinks = styled(Row)`
  justify-self: center;
  background-color: ${({ theme }) => theme.bg0};
  width: fit-content;
  padding: 0;
  height: 4.5rem;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
  overflow: auto;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    justify-self: start;  
    `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    border-radius: 16px;
    height: 3rem;
    justify-self: center;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    z-index: 99;
    position: fixed;
    bottom: 0; right: 50%;
    transform: translate(50%,-50%);
    margin: 0 auto;
    background-color: ${({ theme }) => theme.bg0};
    border: 1px solid ${({ theme }) => theme.bg2};
    box-shadow: 0px 6px 10px rgb(0 0 0 / 2%);
  `};
`

const Divider = styled.div`
  height: 3rem;
  width: 1px;
  background-color: ${({ theme }) => theme.bg2};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg0 : theme.bg0)};
  border-radius: 16px;
  white-space: nowrap;
  width: 100%;
  height: 40px;

  :focus {
    border: 1px solid blue;
  }
`

const UNIAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: start;
  `};
  :hover {
    cursor: pointer;
  }
`

const CronusIconSmall = styled.div`
  display: flex;
  margin-right: 1rem;
  position: relative;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
  height: 40px;
`};
`

const CronusIcon = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
  display:none;
`};
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  height: 100%;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 0.875rem;
  font-weight: 500;
  padding: 8px 12px;
  word-break: break-word;
  overflow: hidden;
  white-space: nowrap;
  &.${activeClassName} {
    font-weight: 600;
    justify-content: center;
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName,
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 0.875rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
    text-decoration: none;
  }
`
const LinkIcon = styled.div`
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
`

export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  const [darkMode] = useDarkModeManager()
  const { white, black } = useTheme()

  const toggleClaimModal = useToggleSelfClaimModal()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  const showClaimPopup = useShowClaimPopup()

  const scrollY = useScrollPosition()

  const {
    infoLink,
    nativeCurrency: { symbol: nativeCurrencySymbol },
  } = CHAIN_INFO[chainId ? chainId : SupportedChainId.MAINNET]

  return (
    <HeaderFrame showBackground={true}>
      <HeaderInner>
        <ClaimModal />
        <Title href=".">
          <CronusIconSmall>
            <LogoSmall fill={darkMode ? white : '#B50028'} height="36px" title="logo" />
          </CronusIconSmall>
          <CronusIcon>
            <Logo fill={darkMode ? white : black} height="36px" title="logo" />
          </CronusIcon>
        </Title>
        <HeaderControls>
          <HeaderLinks>
            <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
              <LinkIcon>
                <ArrowsHorizontal16 />
              </LinkIcon>
              <Trans>Swap</Trans>
            </StyledNavLink>
            <StyledNavLink
              id={`pool-nav-link`}
              to={'/liquidity'}
              isActive={(match, { pathname }) =>
                Boolean(match) ||
                pathname.startsWith('/add') ||
                pathname.startsWith('/remove') ||
                pathname.startsWith('/increase') ||
                pathname.startsWith('/find')
              }
            >
              <LinkIcon>
                <Collaborate16 />
              </LinkIcon>
              <Trans>Liquidity</Trans>
            </StyledNavLink>
            {false && (!chainId || chainId === SupportedChainId.MAINNET) && (
              <StyledNavLink id={`vote-nav-link`} to={'/vote'}>
                <Trans>Bridge</Trans>
              </StyledNavLink>
            )}
            <StyledExternalLink id={`charts-nav-link`} href={''}>
              <LinkIcon>
                <Connect16 />
              </LinkIcon>
              <Trans>Bridge</Trans>
            </StyledExternalLink>
          </HeaderLinks>
          <HeaderElement>
            <Menu />
          </HeaderElement>
          <Divider />
          <HeaderElement>
            {false && availableClaim && !showClaimPopup && (
              <UNIWrapper onClick={toggleClaimModal}>
                <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                  <ThemedText.White padding="0 2px">
                    {claimTxn && !claimTxn?.receipt ? (
                      <Dots>
                        <Trans>Claiming UNI</Trans>
                      </Dots>
                    ) : (
                      <Trans>Claim UNI</Trans>
                    )}
                  </ThemedText.White>
                </UNIAmount>
                <CardNoise />
              </UNIWrapper>
            )}
            <AccountElement active={!!account}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0, userSelect: 'none' }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  <Trans>
                    {userEthBalance?.toSignificant(3)} {nativeCurrencySymbol}
                  </Trans>
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
        </HeaderControls>
      </HeaderInner>
    </HeaderFrame>
  )
}
