import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Url, UrlDocument } from "../Schema/url.schema";
import { IUrlRepository } from "../Contract/IUrlRepository";
import { Statistics, StatisticsDocument } from "../Schema/statistics.schema";

/**
 * @class UrlRepository @implements IUrlRepository
 */
@Injectable()
export class UrlRepository implements IUrlRepository {
    constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>, @InjectModel(Statistics.name) private statisticsModel: Model<StatisticsDocument>) { }

    /**
     * Saves the shortURL for the inputted long URL in the Database
     * @param url A longURL
     * @returns A shortURL
    */
    async create(url: Url): Promise<string> {
        try {
            const result = await this.urlModel.findOne({ "longUrl": url.longUrl }).exec();

            if (result && result["shortUrl"]) {
                // return the shortURL if it already exists for the provided longURL
                return result["shortUrl"];
            }
            else {
                // save the shortURL
                const newUrl = new this.urlModel(url);
                const result = await newUrl.save();

                // save the statistics
                const newStat = new this.statisticsModel({
                    shortUrl: result.shortUrl,
                    longUrl: result.longUrl,
                    visitCount: 0,
                    ip: "",
                    lastVisited: null
                });

                await newStat.save();

                return result.shortUrl;
            }
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    /**
     * Gets the longURL for the provided shortURL from the Database
     * @param shortUrl A shortURL
     * @param ip IP of the user
     * @returns A longURL
    */
    async get(shortUrl: string, ip: string): Promise<string> {
        try {
            const result = await this.urlModel.findOne({ "shortUrl": shortUrl }).exec();

            if (result && result["isDeleted"]) {
                // Throw an exception if the URL has been deleted
                throw new HttpException("The Url has been deleted!", HttpStatus.NOT_FOUND);
            }
            if (result && result["longUrl"]) {
                const requestLimit = result["requestLimit"];

                // Sum the total visit count for this URL
                const sumVisitCount = await this.statisticsModel.aggregate([
                    { $match: { "shortUrl": shortUrl } },
                    {
                        $group: {
                            _id: null,
                            totalRequestCount: { $sum: '$visitCount' }
                        }
                    }
                ]);

                if (requestLimit > 0 && sumVisitCount.length > 0 && sumVisitCount[0].totalRequestCount >= requestLimit) {
                    // Throw an exception if the request limit has reached
                    throw new HttpException("Access to this URL cannot be granted as the visit request limit has been reached!", HttpStatus.FORBIDDEN);
                }
                else {
                    // update the statistics
                    await this.statisticsModel.findOneAndUpdate({ "shortUrl": shortUrl, "ip": ip }, { $inc: { visitCount: 1 }, shortUrl: shortUrl, longUrl: result["longUrl"], ip: ip, lastVisited: new Date() }, { new: true, upsert: true }).exec();
                }

                return result["longUrl"];
            }
            else {
                // Throw an exception if the URL does not exist
                throw new HttpException("Url does not exist!", HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    /**
     * Gets the Statistics for all the URLs from the Database
     * @returns URL Statistics Array
    */
    async getStatistics(): Promise<Statistics[]> {
        try {
            // Select fields to get
            const projection = "-_id shortUrl longUrl visitCount ip lastVisited";

            return await this.statisticsModel.find().select(projection).exec();
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    /**
     * Saves the Alias for the provided URL in the Database
     * @param url A shortURL
     * @returns The Aliased URL
    */
    async setAlias(url: Url): Promise<string> {
        try {
            const exists = await this.urlModel.findOne({ "shortUrl": url.longUrl }).exec();

            if (exists && exists["isDeleted"]) {
                // Throw an exception if the URL has been deleted
                throw new HttpException("The Url has been deleted!", HttpStatus.NOT_FOUND);
            }

            const aliasExists = await this.urlModel.findOne({ "shortUrl": url.shortUrl }).exec();

            if (aliasExists && aliasExists["shortUrl"]) {
                // Throw an exception if the Alias name already exists
                throw new HttpException("Alias name already exists! Please choose a different Alias name!", HttpStatus.UNPROCESSABLE_ENTITY);
            }
            else {
                // save the Alias
                const newUrl = new this.urlModel(url);
                const result = await newUrl.save();

                // save the statistics
                const newStat = new this.statisticsModel({
                    shortUrl: result.shortUrl,
                    longUrl: result.longUrl,
                    visitCount: 0,
                    ip: "",
                    lastVisited: null
                });

                await newStat.save();

                return result.shortUrl;
            }
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    /**
     * Updates the Request Limit for the provided URL in the Database
     * @param shortUrl A shortURL
     * @param requestLimit The request limit
     * @returns Success message
    */
    async setRequestLimit(shortUrl: string, requestLimit: number): Promise<string> {
        try {
            const exists = await this.urlModel.findOne({ "shortUrl": shortUrl }).exec();

            if (exists && exists["isDeleted"]) {
                // Throw an exception if the URL has been deleted
                throw new HttpException("The Url has been deleted!", HttpStatus.NOT_FOUND);
            }

            // Update the request limit
            const result = await this.urlModel.findOneAndUpdate({ "shortUrl": shortUrl }, { requestLimit: requestLimit }, { new: true }).exec();

            if (result) {
                return "Request Limit set successfully!";
            }
            else {
                // Throw an exception if the URL does not exist
                throw new HttpException("Short Url does not exist!", HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    /**
     * Soft Deletes the shortURL in the Database by setting its isDeleted field to true
     * @param shortUrl A shortURL
     * @returns Success message
    */
    async deleteUrl(shortUrl: string): Promise<string> {
        try {
            const exists = await this.urlModel.findOne({ "shortUrl": shortUrl }).exec();

            if (exists && exists["isDeleted"]) {
                // Throw an exception if the URL has already been deleted
                throw new HttpException("The Url has already been deleted!", HttpStatus.NOT_FOUND);
            }

            // Soft delete the URL by setting its isDeleted field to true
            await this.urlModel.findOneAndUpdate({ "shortUrl": shortUrl }, { isDeleted: true, deletedOn: new Date() }, { new: true }).exec();

            return "Short Url Deleted successfully!";
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }
}