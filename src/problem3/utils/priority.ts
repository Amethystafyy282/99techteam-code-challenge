import type { Blockchain } from '../../shared/constants/tokens';
import { BLOCKCHAIN_PRIORITY, UNKNOWN_PRIORITY } from '../constants/priority';

const isKnownBlockchain = (blockchain: string): blockchain is Blockchain =>
  Object.prototype.hasOwnProperty.call(BLOCKCHAIN_PRIORITY, blockchain);

export const getPriority = (blockchain: string): number =>
  isKnownBlockchain(blockchain) ? BLOCKCHAIN_PRIORITY[blockchain] : UNKNOWN_PRIORITY;
