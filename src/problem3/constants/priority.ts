import { Blockchain } from '../../shared/constants/tokens';

export const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  [Blockchain.Osmosis]: 100,
  [Blockchain.Ethereum]: 50,
  [Blockchain.Arbitrum]: 30,
  [Blockchain.Zilliqa]: 20,
  [Blockchain.Neo]: 20,
};

export const UNKNOWN_PRIORITY = -99;
