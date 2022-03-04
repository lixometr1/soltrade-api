import { IsNumber, IsString } from "class-validator";

export class MagicEdenSellDto {
    @IsString()
    mintAddress: string

    @IsNumber()
    price: number
}