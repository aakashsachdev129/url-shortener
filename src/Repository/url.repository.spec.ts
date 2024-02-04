import { Test, TestingModule } from "@nestjs/testing";
import { Url } from "../Schema/url.schema";
import { Statistics } from "../Schema/statistics.schema";
import { getModelToken } from "@nestjs/mongoose";
import { UrlRepository } from "./url.repository";
import { UrlModelMock } from "../../test/Mocks/UrlModelMock";
import { StatisticsModelMock } from "../../test/Mocks/StatisticsModelMock";

const mockUrl = {
    shortUrl: "http://localhost:3000/url/GmgaS1HTd2",
    longUrl: "https://cbatech.net/",
    requestLimit: 0,
    createdOn: new Date(),
    isDeleted: false,
    deletedOn: null
} as Url;

const mockStatistics = [
    {
        "shortUrl": "http://localhost:3000/url/GmgaS1HTd2",
        "longUrl": "https://cbatech.net/",
        "visitCount": 0,
        "ip": "",
        "lastVisited": null
    },
    {
        "shortUrl": "http://localhost:3000/url/GmgaS1HTd2",
        "longUrl": "https://cbatech.net/",
        "visitCount": 1,
        "ip": "::1",
        "lastVisited": new Date("2024-02-02T22:00:30.267Z")
    }
] as Statistics[];

describe('UrlRepository', () => {
    let urlRepository: UrlRepository;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                UrlRepository,
                { provide: getModelToken(Url.name), useValue: UrlModelMock },
                { provide: getModelToken(Statistics.name), useValue: StatisticsModelMock }
            ],
        }).compile();

        urlRepository = app.get<UrlRepository>(UrlRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('UrlRepository - should be defined', () => {
        expect(urlRepository).toBeDefined();
    });

    describe('create', () => {
        it('should get a shortURL', async () => {
            const shortUrl = await urlRepository.create(mockUrl);
            expect(shortUrl).toEqual(mockUrl.shortUrl);
        });
    });

    describe('get', () => {
        it('should get the longURL', async () => {
            const ip = '::1';
            const longUrl = await urlRepository.get(mockUrl.shortUrl, ip);
            expect(longUrl).toEqual(mockUrl.longUrl);
        });
    });

    describe('getStatistics', () => {
        it('should get the Statistics', async () => {
            const stats = await urlRepository.getStatistics();
            expect(stats).toEqual(mockStatistics);
        });
    });

    describe('setAlias', () => {
        it('should throw Alias already exists', async () => {
            try {
                await urlRepository.setAlias(mockUrl);
            } catch (error) {
                expect(error).toHaveProperty('message', 'Alias name already exists! Please choose a different Alias name!');
            }
        });
    });

    describe('setRequestLimit', () => {
        it('should get success message', async () => {
            const requestLimit = 10;
            const response = await urlRepository.setRequestLimit(mockUrl.shortUrl, requestLimit);
            expect(response).toEqual("Request Limit set successfully!");
        });
    });

    describe('deleteUrl', () => {
        it('should get the success message', async () => {
            const response = await urlRepository.deleteUrl(mockUrl.shortUrl);
            expect(response).toEqual("Short Url Deleted successfully!");
        });
    });
});
