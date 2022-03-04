import { CreateTrackCollectionItemDto } from './../dto/create-track-collection.dto';
export class TrackCollectionUpdateEvent {
  collectionName: string;
  floor?: CreateTrackCollectionItemDto;
  volumes?: CreateTrackCollectionItemDto;
  listedCount?: CreateTrackCollectionItemDto;
}
