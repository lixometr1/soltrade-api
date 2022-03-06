import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TrackCollectionService } from './track-collection.service';
import {
  CreateTrackCollectionDto,
  CreateTrackCollectionItemDto,
} from './dto/create-track-collection.dto';
import { UpdateTrackCollectionDto } from './dto/update-track-collection.dto';
import { AddTrackStatsDto } from './dto/add-track-stats.dto';

@Controller('track-collection')
export class TrackCollectionController {
  constructor(
    private readonly trackCollectionService: TrackCollectionService,
  ) {}

  @Get()
  findAll() {
    return this.trackCollectionService.findAll();
  }

  @Get(':collectionName')
  findByCollection(@Param('collectionName') collectionName: string) {
    return this.trackCollectionService.findByCollection(collectionName)
  }


  @Post()
  create(@Body() createTrackCollectionDto: CreateTrackCollectionDto) {
    return this.trackCollectionService.create(createTrackCollectionDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackCollectionService.remove(id);
  }
}
