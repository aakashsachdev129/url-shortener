import { Statistics } from '../Schema/statistics.schema';
import { Url } from '../Schema/url.schema';

/**
 * @interface
 * IUrlRepository contract that the specific repository class must implement
 */
export interface IUrlRepository {
  create(url: Url): Promise<string>;
  setAlias(url: Url): Promise<string>;
  setRequestLimit(shortUrl: string, requestLimit: number): Promise<string>;
  get(shortUrl: string, ip: string): Promise<string>;
  getStatistics(): Promise<Statistics[]>;
  deleteUrl(shortUrl: string): Promise<string>;
}
