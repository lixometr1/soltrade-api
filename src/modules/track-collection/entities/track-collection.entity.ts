import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MarketplaceType } from 'src/types/marketplace-type.enum';

export type TrackCollectionDocument = TrackCollection & Document;

@Schema()
export class TrackCollectionItem {
  @Prop({ type: Date })
  date: Date;

  @Prop()
  value: number;
}
const TrackCollectionItemSchema =
  SchemaFactory.createForClass(TrackCollectionItem);
@Schema()
export class TrackCollection {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({
    enum: MarketplaceType,
    default: MarketplaceType.magiceden,
  })
  type: string;

  @Prop()
  collectionName: string;

  @Prop({ required: false })
  collectionTitle?: string;

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
