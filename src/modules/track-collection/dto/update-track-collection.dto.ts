import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackCollectionDto } from './create-track-collection.dto';

export class UpdateTrackCollectionDto extends PartialType(CreateTrackCollectionDto) {}
