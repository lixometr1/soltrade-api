import { IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateOrderDto {
  @IsNumber()
  limit: number;
  @IsString()
  collectionName: string;
  @IsOptional()
  sell?: number;
  @IsOptional()
  type?: string;
}
