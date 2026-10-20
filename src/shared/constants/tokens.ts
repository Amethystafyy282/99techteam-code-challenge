export enum Currency {
  OSMO = 'OSMO',
  ATOM = 'ATOM',
  ETH = 'ETH',
  USDC = 'USDC',
  WBTC = 'WBTC',
  wstETH = 'wstETH',
  BLUR = 'BLUR',
  GMX = 'GMX',
  ZIL = 'ZIL',
  bNEO = 'bNEO',
  SWTH = 'SWTH',
}

export enum Blockchain {
  Osmosis = 'Osmosis',
  Ethereum = 'Ethereum',
  Arbitrum = 'Arbitrum',
  Zilliqa = 'Zilliqa',
  Neo = 'Neo',
}

export const BLOCKCHAIN_BY_CURRENCY: Record<Currency, Blockchain> = {
  [Currency.OSMO]: Blockchain.Osmosis,
  [Currency.ATOM]: Blockchain.Osmosis,
  [Currency.ETH]: Blockchain.Ethereum,
  [Currency.USDC]: Blockchain.Ethereum,
  [Currency.WBTC]: Blockchain.Ethereum,
  [Currency.wstETH]: Blockchain.Ethereum,
  [Currency.BLUR]: Blockchain.Ethereum,
  [Currency.GMX]: Blockchain.Arbitrum,
  [Currency.ZIL]: Blockchain.Zilliqa,
  [Currency.bNEO]: Blockchain.Neo,
  [Currency.SWTH]: Blockchain.Neo,
};

export const AMOUNT_PRECISION = 8;
