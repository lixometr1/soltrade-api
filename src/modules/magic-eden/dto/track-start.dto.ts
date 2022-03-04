import { IsString } from 'class-validator';

export class TrackStartDto {
  @IsString()
  collectionName: string;
}
