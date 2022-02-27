import { Currency, Ether, NativeCurrency, Token, WETH9 } from '@uniswap/sdk-core'

import { UNI_ADDRESS } from './addresses'
import { SupportedChainId } from './chains'

// TODO edit official initial token list
export const DAI = new Token(
  SupportedChainId.EVMOS,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)

export const USDC = new Token(
  SupportedChainId.EVMOS,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)

export const WBTC_EVMOS = new Token(
  SupportedChainId.EVMOS,
  '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
  8,
  'WBTC',
  'Wrapped BTC'
)

export const USDT = new Token(
  SupportedChainId.EVMOS,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD'
)

export const WETH = new Token(
  SupportedChainId.EVMOS,
  '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  18,
  'WETH',
  'Wrapped Ether'
)
export const UNI: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: new Token(SupportedChainId.MAINNET, UNI_ADDRESS[1], 18, 'UNI', 'Uniswap'),
}

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token } = {
  [SupportedChainId.EVMOS]: new Token(
    SupportedChainId.EVMOS,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    18,
    'evmos',
    'EVMOS'
  ),
  [SupportedChainId.EVMOS_TESTNET]: new Token(
    SupportedChainId.EVMOS_TESTNET,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'tevmos',
    'Testnet EVMOS'
  ),
}

// function isMatic(chainId: number): chainId is SupportedChainId.POLYGON | SupportedChainId.POLYGON_MUMBAI {
//   return chainId === SupportedChainId.POLYGON_MUMBAI || chainId === SupportedChainId.POLYGON
// }

// class MaticNativeCurrency extends NativeCurrency {
//   equals(other: Currency): boolean {
//     return other.isNative && other.chainId === this.chainId
//   }

//   get wrapped(): Token {
//     if (!isMatic(this.chainId)) throw new Error('Not matic')
//     return WRAPPED_NATIVE_CURRENCY[this.chainId]
//   }

//   public constructor(chainId: number) {
//     if (!isMatic(chainId)) throw new Error('Not matic')
//     super(chainId, 18, 'MATIC', 'Polygon Matic')
//   }
// }

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    if (this.chainId in WRAPPED_NATIVE_CURRENCY) return WRAPPED_NATIVE_CURRENCY[this.chainId]
    throw new Error('Unsupported chain ID')
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency } = {}
export function nativeOnChain(chainId: number): NativeCurrency {
  return (
    cachedNativeCurrency[chainId] ??
    (cachedNativeCurrency[chainId] = //isMatic(chainId)
      //? new MaticNativeCurrency(chainId) :
      ExtendedEther.onChain(chainId))
  )
}
