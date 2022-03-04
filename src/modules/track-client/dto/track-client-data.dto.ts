import { TrackClientTrackType } from './../types/track-client-track-type.enum';
export class TrackClientDataDto {
    type: TrackClientTrackType
    collectionName: string
    data: any
}