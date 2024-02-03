import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Url, UrlSchema } from "../Schemas/url.schema";
import { UrlController } from "../Controller/url.controller";
import { UrlRepository } from "../Repository/url.repository";
import { UrlService } from "../Service/url.service";
import { Statistics, StatisticsSchema } from "../Schemas/statistics.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }, { name: Statistics.name, schema: StatisticsSchema}])],
    controllers: [UrlController],
    providers: [UrlService, UrlRepository]
})
export class UrlModule {}