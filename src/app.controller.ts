import { config } from 'src/config/config';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import * as fs from 'fs';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/logs')
  getLogs(@Res() res: Response) {
    const stream = fs.createReadStream(config.infoLogPath);
    stream.pipe(res)
  }
}
