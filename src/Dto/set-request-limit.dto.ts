import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsUrl, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetRequestLimitDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false, require_protocol: true, require_port: true })
  @ApiProperty()
  shortUrl: string;

  @Type(() => Number)
  @Min(0)
  @ApiProperty()
  requestLimit: number;
}
