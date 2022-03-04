import { CreateAccountDto } from './dto/create-account.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // @Post('/')
  // create(@Body('data') data: CreateAccountDto) {
  //   return this.accountService.create(data);
  // }
}
