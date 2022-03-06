export class TrackClientCollectionInfoDto {
  collectionName: string;
  floorPrice: number;
  priceLayers: {
    [key: string]: number;
  };
  volumes: number;
  listedCount: number;
}
