import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
