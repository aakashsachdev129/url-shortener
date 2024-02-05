import { Statistics } from '../../src/Schema/statistics.schema';

const statisticsModel = {
  shortUrl: 'http://localhost:3000/url/GmgaS1HTd2',
  longUrl: 'https://cbatech.net/',
  visitCount: 0,
  ip: '',
  lastVisited: null,
} as Statistics;

const mockStatistics = [
  {
    shortUrl: 'http://localhost:3000/url/GmgaS1HTd2',
    longUrl: 'https://cbatech.net/',
    visitCount: 0,
    ip: '',
    lastVisited: null,
  },
  {
    shortUrl: 'http://localhost:3000/url/GmgaS1HTd2',
    longUrl: 'https://cbatech.net/',
    visitCount: 1,
    ip: '::1',
    lastVisited: new Date('2024-02-02T22:00:30.267Z'),
  },
] as Statistics[];

export class StatisticsModelMock {
  constructor(private _: any) {}
  new = jest.fn().mockResolvedValue({});
  static save = jest.fn().mockResolvedValue(statisticsModel);
  static find = jest.fn().mockReturnThis();
  static create = jest.fn().mockReturnValue(statisticsModel);
  static findOneAndDelete = jest.fn().mockReturnThis();
  static findOneAndUpdate = jest.fn().mockReturnThis();
  static exec = jest.fn().mockReturnValue(mockStatistics);
  static select = jest.fn().mockReturnThis();
  static aggregate = jest.fn().mockReturnThis();
  static findOne = jest.fn().mockReturnThis();
}
