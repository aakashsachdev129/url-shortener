import { Statistics } from '../../src/Schema/statistics.schema';
import { Url } from '../../src/Schema/url.schema';

export class UrlRepositoryMock {
  async create(_url: Url): Promise<string> {
    return 'http://localhost:3000/url/GmgaS1HTd2';
  }

  async get(_shortUrl: string, _ip: string): Promise<string> {
    return 'https://cbatech.net/';
  }

  async getStatistics(): Promise<Statistics[]> {
    return [
      {
        shortUrl: 'http://localhost:3000/url/GmgaS1HTd2',
        longUrl: 'https://cbatech.net/',
        visitCount: 0,
        ip: '',
        lastVisited: null,
      },
      {
        ip: '::1',
        shortUrl: 'http://localhost:3000/url/GmgaS1HTd2',
        lastVisited: new Date('2024-02-02T22:00:30.267Z'),
        longUrl: 'https://cbatech.net/',
        visitCount: 1,
      },
    ];
  }

  async setAlias(_shortUrl: string, _alias: string): Promise<string> {
    return 'http://localhost:3000/url/cba';
  }

  async setRequestLimit(
    _shortUrl: string,
    _requestLimit: number,
  ): Promise<string> {
    return 'Request Limit set successfully!';
  }

  async deleteUrl(_shortUrl: string): Promise<string> {
    return 'Short Url Deleted successfully!';
  }
}
