export interface CGCoin {
  id: string;
  symbol: string;
  name: string;
  platforms: { [key: string]: null | string };
}
