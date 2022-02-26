import { Currency, Percent, TradeType } from '@uniswap/sdk-core'
import { OutlineCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import Row, { RowBetween } from 'components/Row'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { darken } from 'polished'
import { useState } from 'react'
import { ChevronDown, Info } from 'react-feather'
import { InterfaceTrade } from 'state/routing/types'
import styled, { keyframes, useTheme } from 'styled-components/macro'

import { AdvancedSwapDetails } from './AdvancedSwapDetails'

const Wrapper = styled(Row)`
  width: 100%;
  justify-content: center;
`

const StyledInfoIcon = styled(Info)`
  height: 16px;
  width: 16px;
  margin-right: 4px;
  color: ${({ theme }) => theme.text3};
`

const StyledCard = styled(OutlineCard)`
  padding: 12px;
  border: 0 solid transparent;
`

const StyledHeaderRow = styled(RowBetween)<{ disabled: boolean; open: boolean }>`
  padding: 4px 8px;
  border-radius: 0;
  background-color: ${({ open, theme }) => (open ? theme.bg1 : 'transparent')};
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
  min-height: 40px;

  :hover {
    background-color: ${({ theme, disabled }) => (disabled ? theme.bg1 : darken(0.015, theme.bg1))};
  }
`

const RotatingArrow = styled(ChevronDown)<{ open?: boolean }>`
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'none')};
  transition: transform 0.1s linear;
`

const StyledPolling = styled.div`
  display: flex;
  height: 16px;
  width: 16px;
  margin-right: 2px;
  margin-left: 10px;
  align-items: center;
  color: ${({ theme }) => theme.text1};
  transition: 250ms ease color;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

const StyledPollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  border-radius: 50%;
  position: relative;
  background-color: ${({ theme }) => theme.bg2};
  transition: 250ms ease background-color;
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);
  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid ${({ theme }) => theme.text1};
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;
  transition: 250ms ease border-color;
  left: -3px;
  top: -3px;
`

interface SwapDetailsInlineProps {
  trade: InterfaceTrade<Currency, Currency, TradeType> | undefined
  syncing: boolean
  loading: boolean
  showInverted: boolean
  setShowInverted: React.Dispatch<React.SetStateAction<boolean>>
  allowedSlippage: Percent
}

export default function SwapDetailsDropdown({
  trade,
  syncing,
  loading,
  showInverted,
  setShowInverted,
  allowedSlippage,
}: SwapDetailsInlineProps) {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Wrapper>
      <AutoColumn gap={'8px'} style={{ width: '100%', marginBottom: '-8px' }}>
        <AutoColumn gap={'8px'} style={{ padding: '0', paddingBottom: '8px' }}>
          <StyledCard>
            <AdvancedSwapDetails
              trade={trade}
              allowedSlippage={allowedSlippage}
              syncing={syncing}
              showInverted={showInverted}
              setShowInverted={setShowInverted}
            />
          </StyledCard>
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}
