import { TrackClientTrackType } from '../types/track-client-track-type.enum';

export class TrackClientStartDto {
  collectionName: string;
  type: TrackClientTrackType;
  time: number;
}
