// a list of tokens by chain
import { Currency, Token } from '@uniswap/sdk-core'

import { SupportedChainId } from './chains'
import {
  DAI,
  nativeOnChain,
  USDC,
  USDT,
  WBTC_EVMOS,
  WETH,
  WRAPPED_NATIVE_CURRENCY,
} from './tokens'

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

type ChainCurrencyList = {
  readonly [chainId: number]: Currency[]
}

const WRAPPED_NATIVE_CURRENCIES_ONLY: ChainTokenList = Object.fromEntries(
  Object.entries(WRAPPED_NATIVE_CURRENCY).map(([key, value]) => [key, [value]])
)

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_CURRENCIES_ONLY,
  //TODO probably need to review this based on the native currency
  [SupportedChainId.EVMOS]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.EVMOS],
    DAI,
    USDT,
    WBTC_EVMOS,
  ],
  [SupportedChainId.EVMOS_TESTNET]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.EVMOS_TESTNET],
    DAI,
    USDT,
    WBTC_EVMOS,
  ],
}
export const ADDITIONAL_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
  // [SupportedChainId.MAINNET]: {
  //   '0xF16E4d813f4DcfDe4c5b44f305c908742De84eF0': [ETH2X_FLI],
  // },
}
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
  // [SupportedChainId.MAINNET]: {
  //   [AMPL.address]: [DAI, WRAPPED_NATIVE_CURRENCY[SupportedChainId.MAINNET]],
  // },
}

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainCurrencyList = {
  [SupportedChainId.MAINNET]: [
    nativeOnChain(SupportedChainId.MAINNET),
    DAI,
    USDC,
    USDT,
    WRAPPED_NATIVE_CURRENCY[SupportedChainId.MAINNET],
  ],
  [SupportedChainId.EVMOS]: [
    nativeOnChain(SupportedChainId.EVMOS),
    DAI,
    USDC,
    USDT,
    WBTC_EVMOS,
  ],
  [SupportedChainId.EVMOS_TESTNET]: [
    nativeOnChain(SupportedChainId.EVMOS_TESTNET),
    DAI,
    USDC,
    USDT,
    WBTC_EVMOS,
  ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_CURRENCIES_ONLY,
  [SupportedChainId.MAINNET]: [...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.MAINNET], DAI, USDC, USDT],
}
export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [SupportedChainId.MAINNET]: [
    [
      new Token(SupportedChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(
        SupportedChainId.MAINNET,
        '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
        8,
        'cUSDC',
        'Compound USD Coin'
      ),
    ],
    [USDC, USDT],
    [DAI, USDT],
  ],
}
