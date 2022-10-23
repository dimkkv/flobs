export interface Flashloans {
  data: Data;
}

export interface Data {
  alerts: Alerts;
}

export interface Alerts {
  pageInfo: PageInfo;
  alerts: Alert[];
}

export interface Alert {
  createdAt: Date;
  name: Name;
  protocol: Protocol;
  findingType: FindingType;
  source: Source;
  severity: Severity;
  metadata: Metadata;
  scanNodeCount: number;
}

export enum FindingType {
  Exploit = 'EXPLOIT',
}

export interface Metadata {
  profit: string;
  tokens: string;
}

export enum Name {
  FlashloanDetected = 'Flashloan detected',
}

export enum Protocol {
  Ethereum = 'ethereum',
}

export enum Severity {
  Low = 'LOW',
}

export interface Source {
  transactionHash: string;
  block: Block;
  bot: Bot;
}

export interface Block {
  number: number;
  chainId: number;
}

export interface Bot {
  id: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: EndCursor;
}

export interface EndCursor {
  alertId: string;
  blockNumber: number;
}
