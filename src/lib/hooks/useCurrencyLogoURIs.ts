import { Currency } from '@uniswap/sdk-core'
import { SupportedChainId } from 'constants/chains'
import useHttpLocations from 'hooks/useHttpLocations'
import { useMemo } from 'react'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import EvmosLogo from '../../assets/images/evmos-logo.png'
import MaticLogo from '../../assets/svg/matic-token-icon.svg'

type Network = 'ethereum' | 'evmos' | 'evmos testnet'

function chainIdToNetworkName(networkId: SupportedChainId): Network {
  switch (networkId) {
    case SupportedChainId.MAINNET:
      return 'ethereum'
    case SupportedChainId.EVMOS:
      return 'evmos'
    case SupportedChainId.EVMOS_TESTNET:
      return 'evmos testnet'
    default:
      return 'ethereum'
  }
}

function getNativeLogoURI(chainId: SupportedChainId = SupportedChainId.MAINNET): string {
  switch (chainId) {
    case SupportedChainId.EVMOS:
    case SupportedChainId.EVMOS_TESTNET:
      return EvmosLogo
    default:
      return EthereumLogo
  }
}

function getTokenLogoURI(address: string, chainId: SupportedChainId = SupportedChainId.MAINNET): string | void {
  const networkName = chainIdToNetworkName(chainId)
  const networksWithUrls = [SupportedChainId.EVMOS, SupportedChainId.MAINNET, SupportedChainId.EVMOS_TESTNET]
  if (networksWithUrls.includes(chainId)) {
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png` //TODO change
  }
}

export default function useCurrencyLogoURIs(currency?: Currency | null): string[] {
  const locations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  return useMemo(() => {
    const logoURIs = [...locations]
    if (currency) {
      if (currency.isNative) {
        logoURIs.push(getNativeLogoURI(currency.chainId))
      } else if (currency.isToken) {
        const logoURI = getTokenLogoURI(currency.address, currency.chainId)
        if (logoURI) {
          logoURIs.push(logoURI)
        }
      }
    }
    return logoURIs
  }, [currency, locations])
}
