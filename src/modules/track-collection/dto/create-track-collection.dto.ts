import { MarketplaceType } from './../../../types/marketplace-type.enum';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateTrackCollectionItemDto {
  @IsString()
  date: string | Date;

  @IsNumber()
  value: number;
}
export class CreateTrackCollectionDto {
  @IsString()
  collectionName: string;

  @IsOptional()
  @IsString()
  collectionTitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  totalItems?: number;
  @IsOptional()
  @IsString()
  discord?: string;
  @IsOptional()
  @IsString()
  twitter?: string;
  @IsOptional()
  @IsString()
  website?: string;
  @IsOptional()
  type?: MarketplaceType;

  @IsOptional()
  @IsArray()
  floor?: CreateTrackCollectionItemDto[];
}
