import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MarketplaceType } from 'src/types/marketplace-type.enum';
export type TrackCollectionDocument = TrackCollection & Document;

@Schema()
export class TrackCollectionItem {
  @Prop({ type: Date })
  date: Date | string;

  @Prop()
  value: number;
}
const TrackCollectionItemSchema =
  SchemaFactory.createForClass(TrackCollectionItem);
@Schema({ timestamps: true })
export class TrackCollection {
  @Prop({
    enum: MarketplaceType,
    default: MarketplaceType.magiceden,
  })
  type: string;

  @Prop({})
  collectionName: string;

  @Prop({ required: false })
  collectionTitle?: string;

  @Prop()
  image?: string;

  @Prop()
  description?: string;

  @Prop()
  totalItems?: number;

  @Prop()
  discord?: string;
  @Prop()
  twitter?: string;
  @Prop()
  website?: string;

  @Prop({ type: [TrackCollectionItemSchema], _id: false })
  floor: TrackCollectionItem[];

  @Prop({ type: [TrackCollectionItemSchema], _id: false })
  volumes: TrackCollectionItem[];

  @Prop({ type: [TrackCollectionItemSchema], _id: false })
  listedCount: TrackCollectionItem[];

  @Prop({ type: {}, default: () => ({}) })
  priceLayers: any;
}
export const TrackCollectionSchema =
  SchemaFactory.createForClass(TrackCollection);
