import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop()
  limit: number;

  @Prop({ enum: ['magiceden'], default: 'magiceden' })
  type: string;

  @Prop()
  collectionName: string;

  @Prop()
  sell?: number;

  @Prop({ default: false })
  done: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
