import { Type } from 'class-transformer';
import { ValidateNested, IsObject, IsOptional } from 'class-validator';
import { PayloadDto } from './TokenizerPayload';

export class RequestTokenizerDto {
  @ValidateNested()
  @Type(() => PayloadDto)
  payload: PayloadDto;

  @IsOptional()
  @IsObject()
  query: object;

  @IsOptional()
  @IsObject()
  path: object;
}
