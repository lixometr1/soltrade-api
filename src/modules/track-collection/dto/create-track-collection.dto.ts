import { MarketplaceType } from './../../../types/marketplace-type.enum';
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from "class-validator";
export class CreateTrackCollectionItemDto {
    @IsString()
    date: Date

    @IsNumber()
    value: number
}
export class CreateTrackCollectionDto {
    @IsString()
    collectionName: string

    @IsOptional()
    type: MarketplaceType

    @IsOptional()
    @IsArray()
    floor: CreateTrackCollectionItemDto[]
}
