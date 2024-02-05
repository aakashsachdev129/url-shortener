import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { UrlRepository } from '../Repository/url.repository';
import { ConfigService } from '@nestjs/config';
import { UrlRepositoryMock } from '../../test/Mocks/UrlRepositoryMock';

describe('UrlService', () => {
  let urlService: UrlService;

  beforeEach(async () => {
    const UrlRepositoryProvider = {
      provide: UrlRepository,
      useClass: UrlRepositoryMock,
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [UrlRepositoryProvider, UrlService, ConfigService],
    }).compile();

    urlService = app.get<UrlService>(UrlService);
  });

  it('UrlService - should be defined', () => {
    expect(urlService).toBeDefined();
  });

  describe('createShortUrl', () => {
    it('should get a shortURL', async () => {
      const url = 'https://cbatech.net/';
      const shortUrl = await urlService.createShortUrl(url);
      expect(shortUrl).toEqual('http://localhost:3000/url/GmgaS1HTd2');
    });
  });

  describe('getLongUrl', () => {
    it('should get the longURL', async () => {
      const url = 'http://localhost:3000/url/GmgaS1HTd2';
      const ip = '::1';
      const longUrl = await urlService.getLongUrl(url, ip);
      expect(longUrl).toEqual('https://cbatech.net/');
    });
  });

  describe('getStatistics', () => {
    it('should get the Statistics', async () => {
      const response = [
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
      const stats = await urlService.getStatistics();
      expect(stats).toEqual(response);
    });
  });

  describe('setAlias', () => {
    it('should get the aliased URL', async () => {
      const url = 'http://localhost:3000/url/GmgaS1HTd2';
      const alias = 'cba';
      const shortUrl = await urlService.setAlias(url, alias);
      expect(shortUrl).toEqual('http://localhost:3000/url/cba');
    });
  });

  describe('setRequestLimit', () => {
    it('should get success message', async () => {
      const url = 'http://localhost:3000/url/GmgaS1HTd2';
      const requestLimit = 10;
      const response = await urlService.setRequestLimit(url, requestLimit);
      expect(response).toEqual('Request Limit set successfully!');
    });
  });

  describe('deleteUrl', () => {
    it('should get the success message', async () => {
      const url = 'http://localhost:3000/url/GmgaS1HTd2';
      const response = await urlService.deleteUrl(url);
      expect(response).toEqual('Short Url Deleted successfully!');
    });
  });
});
