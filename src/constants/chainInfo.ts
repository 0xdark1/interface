import ethereumLogoUrl from 'assets/images/ethereum-logo.png'
import evmosLogoUrl from 'assets/images/evmos-logo.png' //TODO add
import arbitrumLogoUrl from 'assets/svg/arbitrum_logo.svg'
import optimismLogoUrl from 'assets/svg/optimistic_ethereum.svg'
import polygonMaticLogo from 'assets/svg/polygon-matic-logo.svg'
import evmosLogo from 'assets/svg/evmos-logo.svg' //TODO add
import ms from 'ms.macro'

import { SupportedChainId, SupportedL1ChainId, SupportedL2ChainId } from './chains'
import { ARBITRUM_LIST, OPTIMISM_LIST } from './lists'

export enum NetworkType {
  L1,
  L2,
}

interface BaseChainInfo {
  readonly networkType: NetworkType
  readonly blockWaitMsBeforeWarning?: number
  readonly docs: string
  readonly bridge?: string
  readonly explorer: string
  readonly infoLink: string
  readonly logoUrl: string
  readonly label: string
  readonly helpCenterUrl?: string
  readonly nativeCurrency: {
    name: string // e.g. 'Goerli ETH',
    symbol: string // e.g. 'gorETH',
    decimals: number // e.g. 18,
  }
}

export interface L1ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L1
}

export interface L2ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L2
  readonly bridge: string
  readonly statusPage?: string
  readonly defaultListUrl: string
}

export type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo } & {
  readonly [chainId in SupportedL2ChainId]: L2ChainInfo
} &
  { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

export const CHAIN_INFO: ChainInfoMap = {

  // [SupportedChainId.POLYGON]: {
  //   networkType: NetworkType.L1,
  //   blockWaitMsBeforeWarning: ms`10m`,
  //   bridge: 'https://wallet.polygon.technology/bridge',
  //   docs: 'https://polygon.io/',
  //   explorer: 'https://polygonscan.com/',
  //   infoLink: 'https://info.uniswap.org/#/polygon/',
  //   label: 'Polygon',
  //   logoUrl: polygonMaticLogo,
  //   nativeCurrency: { name: 'Polygon Matic', symbol: 'MATIC', decimals: 18 },
  // },

  [SupportedChainId.EVMOS]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: ms`10m`,
    bridge: 'https://wallet.evmos',
    docs: 'https://evmos.io/',
    explorer: 'https://evmos.com/',
    infoLink: 'https://info.cronus-finance.ac/#/evmos/',
    label: 'Evmos',
    logoUrl: evmosLogo,
    nativeCurrency: { name: 'Evmos', symbol: 'evmos', decimals: 18 },
  },
  [SupportedChainId.EVMOS_TESTNET]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: ms`10m`,
    bridge: 'https://wallet.evmos',
    docs: 'https://evmos.io/',
    explorer: 'https://evmos.com/',
    infoLink: 'https://info.cronus-finance.ac/#/evmos/',
    label: 'Evmos',
    logoUrl: evmosLogo,
    nativeCurrency: { name: 'Evmos', symbol: 'evmos', decimals: 18 },
  },
}
