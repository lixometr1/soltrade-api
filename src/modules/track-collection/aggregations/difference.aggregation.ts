export const differenceAggregation = (field: string) => {
  return {
    $round: [
      {
        $cond: {
          if: {
            $eq: [{ $arrayElemAt: [field, 0] }, 0],
          },
          then: 0,
          else: {
            $multiply: [
              {
                $divide: [
                  {
                    $subtract: [
                      { $arrayElemAt: [field, -1] },
                      { $arrayElemAt: [field, 0] },
                    ],
                  },
                  { $arrayElemAt: [field, 0] },
                ],
              },
              100,
            ],
          },
        },
      },
      2,
    ],
  };
};
