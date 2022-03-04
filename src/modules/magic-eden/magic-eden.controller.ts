import { MagicEdenSellDto } from './dto/magic-eden-sell.dto';
import { TrackStartDto } from './dto/track-start.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MagicEdenService } from './magic-eden.service';
import { CreateMagicEdenDto } from './dto/create-magic-eden.dto';
import { UpdateMagicEdenDto } from './dto/update-magic-eden.dto';
import { Query } from 'mongoose';

@Controller('magic-eden')
export class MagicEdenController {
  constructor(private readonly magicEdenService: MagicEdenService) {}

  @Get('/test')
  test() {
    return this.magicEdenService.test();
  }

  @Post('/sell')
  sell(@Body() body: MagicEdenSellDto) {
    return this.magicEdenService.sell(body.mintAddress, body.price);
  }

  @Post('/track/start-order')
  trackStartOrder(@Body() body: TrackStartDto) {
    return this.magicEdenService.trackStartOrder(body.collectionName);
  }
  @Post('/track/start')
  trackStart(@Body() body: TrackStartDto) {
    return this.magicEdenService.trackStart(body.collectionName);
  }
  @Post('/track/stop')
  trackStop(@Body('id') id: string) {
    return this.magicEdenService.trackStop(id);
  }
}
