import { SupportedChainId } from '../constants/chains'

const ETHERSCAN_PREFIXES: { [chainId: number]: string } = {
  [SupportedChainId.MAINNET]: 'https://etherscan.io',
  [SupportedChainId.EVMOS]: 'https://evmos.dev', //TODO add mainnet
  [SupportedChainId.EVMOS_TESTNET]: 'https://evm.evmos.dev/',
}

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(chainId: number, data: string, type: ExplorerDataType): string {
  /*
  if (chainId === SupportedChainId.EVMOS_TESTNET) {
    switch (type) {
      case ExplorerDataType.TRANSACTION:
        return `https://testnet.mintscan.io/evmos/txs/${data}`
      case ExplorerDataType.ADDRESS:
        return `https://testnet.mintscan.io/`
      case ExplorerDataType.TOKEN:
        return `https://testnet.mintscan.io/`
      case ExplorerDataType.BLOCK:
        return `https://testnet.mintscan.io/evmos/blocks/${data}`
      default:
        return `https://testnet.mintscan.io/`
    }
  }
 */

  const prefix = ETHERSCAN_PREFIXES[chainId] ?? 'https://etherscan.io'

  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return `${prefix}/tx/${data}`

    case ExplorerDataType.TOKEN:
      return `${prefix}/token/${data}`

    case ExplorerDataType.BLOCK:
      if (chainId === SupportedChainId.EVMOS || chainId === SupportedChainId.EVMOS_TESTNET) {
        return `${prefix}/tx/${data}`
      }
      return `${prefix}/block/${data}`

    case ExplorerDataType.ADDRESS:
      return `${prefix}/address/${data}`
    default:
      return `${prefix}`
  }
}
