import { Url } from "../../src/Schema/url.schema";

const mockUrl = {
    shortUrl: "http://localhost:3000/url/GmgaS1HTd2",
    longUrl: "https://cbatech.net/",
    requestLimit: 0,
    createdOn: new Date(),
    isDeleted: false,
    deletedOn: null
} as Url;

export class UrlModelMock {
    constructor(private _: any) {}
    new = jest.fn().mockResolvedValue({});
    static save = jest.fn().mockResolvedValue(mockUrl);
    static find = jest.fn().mockReturnThis();
    static create = jest.fn().mockReturnValue(mockUrl);
    static findOneAndDelete = jest.fn().mockReturnThis();
    static findOneAndUpdate = jest.fn().mockReturnThis();
    static exec = jest.fn().mockReturnValue(mockUrl);
    static select = jest.fn().mockReturnThis();
    static findOne = jest.fn().mockReturnThis();
  }