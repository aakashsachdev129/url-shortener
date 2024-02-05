import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { UrlRepository } from '../Repository/url.repository';
import { Statistics } from '../Schema/statistics.schema';
import { ConfigService } from '@nestjs/config';

/**
 * @class UrlService that acts as a middleware between the Controller and Repository
 */
@Injectable()
export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private configService: ConfigService,
  ) {}

  /**
   * Creates a shortURL for the inputted longURL and forwards the request to the Repository
   * @param url A longURL
   * @returns A shortURL
   */
  async createShortUrl(longUrl: string): Promise<string> {
    const urlShortenerDomain =
      this.configService.get<string>('urlShortenerDomain');
    const urlCode = nanoid(10);

    return await this.urlRepository.create({
      // The shortURL is a concatenation of the Domain and a randomly generated urlCode
      shortUrl: `${urlShortenerDomain}/${urlCode}`,
      longUrl: longUrl,
      requestLimit: 0,
      createdOn: new Date(),
      isDeleted: false,
      deletedOn: null,
    });
  }

  /**
   * Gets the longURL for the provided urlCode from the Repository
   * @param urlCode A urlCode extracted from the URL
   * @param ip IP of the user
   * @returns A longURL
   */
  async getLongUrl(urlCode: string, ip: string): Promise<string> {
    const urlShortenerDomain =
      this.configService.get<string>('urlShortenerDomain');

    // The shortURL is a concatenation of the Domain and urlCode
    return await this.urlRepository.get(`${urlShortenerDomain}/${urlCode}`, ip);
  }

  /**
   * Gets the Statistics for all the URLs from the Repository
   * @returns URL Statistics Array
   */
  async getStatistics(): Promise<Statistics[]> {
    return await this.urlRepository.getStatistics();
  }

  /**
   * Sets the Alias for the provided shortURL and forwards the request to the Repository
   * @param shortUrl A shortURL
   * @param alias An Alias
   * @returns The Aliased URL
   */
  async setAlias(shortUrl: string, alias: string): Promise<string> {
    const urlShortenerDomain =
      this.configService.get<string>('urlShortenerDomain');

    return await this.urlRepository.setAlias({
      // The shortURL is a concatenation of the Domain and an Alias
      shortUrl: `${urlShortenerDomain}/${alias}`,
      longUrl: shortUrl,
      requestLimit: 0,
      createdOn: new Date(),
      isDeleted: false,
      deletedOn: null,
    });
  }

  /**
   * Sets the Request Limit for the provided URL
   * @param shortUrl A shortURL
   * @param requestLimit The request limit
   * @returns Success message
   */
  async setRequestLimit(
    shortUrl: string,
    requestLimit: number,
  ): Promise<string> {
    return await this.urlRepository.setRequestLimit(shortUrl, requestLimit);
  }

  /**
   * Soft Deletes the shortURL
   * @param shortUrl A shortURL
   * @returns Success message
   */
  async deleteUrl(shortUrl: string): Promise<string> {
    return await this.urlRepository.deleteUrl(shortUrl);
  }
}
