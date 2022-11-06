export interface FortaWebhook {
  alerts?: Alert[];
}

export interface Alert {
  addresses?: null;
  alertId?: string;
  createdAt?: Date;
  description?: string;
  findingType?: string;
  hash?: string;
  links?: Links;
  metadata?: string;
  name?: string;
  protocol?: string;
  severity?: string;
  source?: Source;
}

export interface Links {
  blockUrl?: string;
  explorerUrl?: string;
  transactionUrl?: string;
}

export interface Source {
  block?: Block;
  bot?: Bot;
  transactionHash?: string;
}

export interface Block {
  chainId?: number;
  hash?: string;
  number?: number;
  timestamp?: Date;
}

export interface Bot {
  id?: string;
  image?: string;
  reference?: string;
}
