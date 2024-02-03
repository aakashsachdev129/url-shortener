import { Test, TestingModule } from "@nestjs/testing";
import { MongooseModule } from '@nestjs/mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from '../Mocks/MongooseTestModule';
import { Connection, connect, Model } from "mongoose";
import { Url, UrlDocument, UrlSchema } from "../Schemas/url.schema";
import { Statistics, StatisticsSchema } from "../Schemas/statistics.schema";
import { getModelToken } from "@nestjs/mongoose";
import { UrlRepository } from "./url.repository";
import { MongoMemoryServer } from "mongodb-memory-server";

describe('UrlRepository', () => {
    let urlRepository: UrlRepository;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let urlModel: Model<Url>;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    urlModel = mongoConnection.model(Url.name, UrlSchema);
    
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }, { name: Statistics.name, schema: StatisticsSchema }]),
      ],
      providers: [
        UrlRepository,
        {provide: getModelToken(Url.name), useValue: urlModel},
    ],
    }).compile();

    urlRepository = module.get<UrlRepository>(UrlRepository);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

    it('UrlRepository - should be defined', () => {
        expect(urlRepository).toBeDefined();
    });

    describe('create', () => {
        it('should get a shortURL', async () => {
            let url: Url = new Url();
            const shortUrl = await urlRepository.create(url);
            expect(shortUrl).toEqual("http://localhost:3000/url/GmgaS1HTd2");
        });
    });

    // describe('get', () => {
    //     it('should get the longURL', async () => {
    //         const url = 'http://localhost:3000/url/GmgaS1HTd2';
    //         const ip = '::1';
    //         const longUrl = await urlService.getLongUrl(url, ip);
    //         expect(longUrl).toEqual("https://cbatech.net/");
    //     });
    // });

    // describe('getStatistics', () => {
    //     it('should get the Statistics', async () => {
    //         const response = [
    //             {
    //               "shortUrl": "http://localhost:3000/url/GmgaS1HTd2",
    //               "longUrl": "https://cbatech.net/",
    //               "visitCount": 0,
    //               "ip": "",
    //               "lastVisited": null
    //             },
    //             {
    //               "ip": "::1",
    //               "shortUrl": "http://localhost:3000/url/GmgaS1HTd2",
    //               "lastVisited": new Date("2024-02-02T22:00:30.267Z"),
    //               "longUrl": "https://cbatech.net/",
    //               "visitCount": 1
    //             }
    //           ]
    //         const stats = await urlService.getStatistics();
    //         expect(stats).toEqual(response);
    //     });
    // });

    // describe('setAlias', () => {
    //     it('should get the aliased URL', async () => {
    //         const url = 'http://localhost:3000/url/GmgaS1HTd2';
    //         const alias = 'cba';
    //         const shortUrl = await urlService.setAlias(url, alias);
    //         expect(shortUrl).toEqual("http://localhost:3000/url/cba");
    //     });
    // });

    // describe('setRequestLimit', () => {
    //     it('should get success message', async () => {
    //         const url = 'http://localhost:3000/url/GmgaS1HTd2';
    //         const requestLimit = 10;
    //         const response = await urlService.setRequestLimit(url, requestLimit);
    //         expect(response).toEqual("Request Limit set successfully!");
    //     });
    // });

    // describe('deleteUrl', () => {
    //     it('should get the success message', async () => {
    //         const url = 'http://localhost:3000/url/GmgaS1HTd2';
    //         const response = await urlService.deleteUrl(url);
    //         expect(response).toEqual("Short Url Deleted successfully!");
    //     });
    // });
});
