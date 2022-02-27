/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
  MAINNET = 1, //removing this breaks too many things

  EVMOS = 1337,
  EVMOS_TESTNET = 31337,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'mainnet',

  [SupportedChainId.EVMOS]: 'evmos',
  [SupportedChainId.EVMOS_TESTNET]: 'evmos_testnet',
}

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number'
) as SupportedChainId[]

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [SupportedChainId.EVMOS, SupportedChainId.EVMOS_TESTNET]

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  
  SupportedChainId.EVMOS,
  SupportedChainId.EVMOS_TESTNET,
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [
] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]
