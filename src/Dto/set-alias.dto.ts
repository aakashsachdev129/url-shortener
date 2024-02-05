import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetAliasDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  shortUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  alias: string;
}
