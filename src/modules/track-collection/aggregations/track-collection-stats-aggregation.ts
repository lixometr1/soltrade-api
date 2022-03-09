import { differenceAggregation } from './difference.aggregation';

export const trackCollectionStatsAggregation = () => {
  return {
    $addFields: {
      floorDifference: differenceAggregation('$floor24.value'),
      volumesDifference: differenceAggregation('$volumes24.value'),
      listedCountDifference: differenceAggregation('$listedCount24.value'),
      volumes24h: {
        $round: [
          {
            $subtract: [
              { $arrayElemAt: ['$volumes24.value', -1] },
              { $arrayElemAt: ['$volumes24.value', 0] },
            ],
          },
          2,
        ],
      },
      floorRange24h: [{ $min: '$floor24.value' }, { $max: '$floor24.value' }],
    },
  };
};
