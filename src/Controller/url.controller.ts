import { Body, Controller, Get, Param, Patch, Post, Ip, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ShortenUrlDto } from '../Dto/shorten-url.dto';
import { UrlService } from '../Service/url.service';
import { SetAliasDto } from '../Dto/set-alias.dto';
import { SetRequestLimitDto } from '../Dto/set-request-limit.dto';
import { DeleteUrlDto } from '../Dto/delete-url.dto';
import { ApiResponse, ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { isURL } from 'class-validator';
import { ConfigService } from '@nestjs/config';

/**
 * The Url Controller that handles all functionalities pertaining to the URL Shortening Service
 */
@Controller('url')
@ApiTags('Endpoints')
export class UrlController {
    constructor(private readonly urlService: UrlService, private configService: ConfigService) { }

    @Post()
    @ApiOperation({
        summary: "Shorten a URL",
        description: `Accepts a long URL as its input and ultimately returns a short
        URL that when accessed will redirect the user to the original long URL`,
    })
    @ApiResponse({
        status: 201,
        type: String,
    })
    async shorten(@Body() shortenUrlDto: ShortenUrlDto, @Res() res: Response) {
        try {
            let shortUrl = await this.urlService.createShortUrl(shortenUrlDto.longUrl);
            return res.status(HttpStatus.CREATED).send(shortUrl);
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    @Get('stats')
    @ApiOperation({
        summary: "Get the statistics of all URLs",
        description: `Returns all URLs and theirs statistics`,
    })
    @ApiResponse({
        status: 200,
        type: Array,
    })
    async getStatistics(@Res() res: Response) {
        try {
            let allStats = await this.urlService.getStatistics();
            return res.status(HttpStatus.OK).json(allStats);
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    /*
    summary: Get the long URL and Redirect to it
    description: Fetches the urlCode parameter from the visited shortURL as its input and ultimately
    redirects the user to the original longURL only when the shortURL is visited from a Browser
    */
    @Get(':urlCode')
    // This is excluded from Swagger as this endpoint is required to work from a Browser
    @ApiExcludeEndpoint(true)
    async getAndRedirect(@Param('urlCode') urlCode: string, @Ip() ip: string, @Res() res: Response) {
        try {
            var originalUrl = await this.urlService.getLongUrl(urlCode, ip);
            return res.redirect(originalUrl);
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    @Patch('alias')
    @ApiOperation({
        summary: "Set an Alias for a short URL",
        description: `Accepts a short URL and alias as its input and sets the alias for the short URL`,
    })
    @ApiResponse({
        status: 200,
        type: String,
    })
    async setAlias(@Body() setAliasDto: SetAliasDto, @Res() res: Response) {
        try {
            const urlShortenerDomain = this.configService.get<string>('urlShortenerDomain');
            if (!isURL(setAliasDto.shortUrl) && !setAliasDto.shortUrl.startsWith(urlShortenerDomain)) {
                throw new HttpException("shortURL must be an auto generated short URL or a valid long URL", HttpStatus.BAD_REQUEST);
            }

            let aliasUrl = await this.urlService.setAlias(setAliasDto.shortUrl, setAliasDto.alias);
            return res.status(HttpStatus.OK).send(aliasUrl);
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    @Patch('limit')
    @ApiOperation({
        summary: "Set the Request Limit for a short URL",
        description: `Accepts a short URL and Request Limit as its input and sets the Request Limit for the short URL`,
    })
    @ApiResponse({
        status: 200,
        type: String,
    })
    async setRequestLimit(@Body() setRequestLimitDto: SetRequestLimitDto, @Res() res: Response) {
        try {
            let response = await this.urlService.setRequestLimit(setRequestLimitDto.shortUrl, setRequestLimitDto.requestLimit);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }

    @Delete()
    @ApiOperation({
        summary: "Delete a short URL",
        description: `Accepts a short URL soft deletes it from the system`,
    })
    @ApiResponse({
        status: 200,
        type: String,
    })
    async deleteUrl(@Body() deleteUrlDto: DeleteUrlDto, @Res() res: Response) {
        try {
            let response = await this.urlService.deleteUrl(deleteUrlDto.shortUrl);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            throw new HttpException(error.response, error.status);
        }
    }
}