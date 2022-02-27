import { SupportedChainId } from './chains'

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
if (typeof INFURA_KEY === 'undefined') {
  throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`)
}

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
export const INFURA_NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.EVMOS]: `https://evmos.infura.io/v3/${INFURA_KEY}`, //TODO edit infura
  [SupportedChainId.EVMOS_TESTNET]: `https://evmos-testnet.infura.io/v3/${INFURA_KEY}`,

}
