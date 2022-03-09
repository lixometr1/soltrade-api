export const filterArrayDateAggregation = (field: string, date: Date) => {
  return {
    $filter: {
      input: `$${field}`,
      as: 'item',
      cond: {
        $gt: ['$$item.date', date],
      },
    },
  };
};
