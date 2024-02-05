import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from '../Service/url.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ShortenUrlDto } from '../Dto/shorten-url.dto';
import { SetAliasDto } from '../Dto/set-alias.dto';
import { SetRequestLimitDto } from '../Dto/set-request-limit.dto';
import { DeleteUrlDto } from '../Dto/delete-url.dto';
import { UrlRepository } from '../Repository/url.repository';
import { UrlRepositoryMock } from '../../test/Mocks/UrlRepositoryMock';
import { UrlServiceMock } from '../../test/Mocks/UrlServiceMock';
import { createResponse, MockResponse } from 'node-mocks-http';
import { HttpStatus } from '@nestjs/common';

describe('UrlController', () => {
  let urlController: UrlController;
  let responseObj: MockResponse<Response>;
  let shortenUrlDto: ShortenUrlDto;
  let setAliasDto: SetAliasDto;
  let setRequestLimitDto: SetRequestLimitDto;
  let deleteUrlDto: DeleteUrlDto;

  beforeEach(async () => {
    const UrlServiceProvider = {
      provide: UrlService,
      useClass: UrlServiceMock,
    };

    const UrlRepositoryProvider = {
      provide: UrlRepository,
      useClass: UrlRepositoryMock,
    };

    responseObj = createResponse();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        UrlServiceProvider,
        UrlRepositoryProvider,
        UrlService,
        ConfigService,
        Response,
        ShortenUrlDto,
        SetAliasDto,
        SetRequestLimitDto,
        DeleteUrlDto,
      ],
    }).compile();

    urlController = app.get<UrlController>(UrlController);
    shortenUrlDto = app.get<ShortenUrlDto>(ShortenUrlDto);
    setRequestLimitDto = app.get<SetRequestLimitDto>(SetRequestLimitDto);
    deleteUrlDto = app.get<DeleteUrlDto>(DeleteUrlDto);
  });

  it('UrlController - should be defined', () => {
    expect(urlController).toBeDefined();
  });

  describe('shorten', () => {
    it('should get a shortURL', async () => {
      await urlController.shorten(shortenUrlDto, responseObj);
      const shortUrl = responseObj._getData();
      expect(shortUrl).toEqual('http://localhost:3000/url/GmgaS1HTd2');
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
          lastVisited: '2024-02-02T22:00:30.267Z',
          longUrl: 'https://cbatech.net/',
          visitCount: 1,
        },
      ];
      await urlController.getStatistics(responseObj);
      const stats = responseObj._getJSONData();
      expect(stats).toEqual(response);
    });
  });

  describe('getAndRedirect', () => {
    it('should get the longURL', async () => {
      const urlCode = 'GmgaS1HTd2';
      const ip = '::1';
      await urlController.getAndRedirect(urlCode, ip, responseObj);
      expect(responseObj.statusCode).toEqual(HttpStatus.FOUND);
    });
  });

  describe('setAlias', () => {
    it('should get the aliased URL', async () => {
      setAliasDto = { shortUrl: 'https://cbatech.net/', alias: 'cba' };
      await urlController.setAlias(setAliasDto, responseObj);
      const aliasUrl = responseObj._getData();
      expect(aliasUrl).toEqual('http://localhost:3000/url/cba');
    });
  });

  describe('setRequestLimit', () => {
    it('should get success message', async () => {
      await urlController.setRequestLimit(setRequestLimitDto, responseObj);
      const res = responseObj._getJSONData();
      expect(res).toEqual('Request Limit set successfully!');
    });
  });

  describe('deleteUrl', () => {
    it('should get the success message', async () => {
      await urlController.deleteUrl(deleteUrlDto, responseObj);
      const res = responseObj._getJSONData();
      expect(res).toEqual('Short Url Deleted successfully!');
    });
  });
});
