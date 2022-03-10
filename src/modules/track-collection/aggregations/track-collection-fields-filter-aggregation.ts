import * as moment from 'moment';
import { filterArrayDateAggregation } from './filter-array-date';

export const trackCollectionFieldsFilterAggregation = (days = 0) => {
  const fromDate = moment().startOf('day').subtract(days, 'days').toDate();
  const yesterday = moment().subtract(24, 'hours').toDate();
  return {
    $addFields: {
      floor: filterArrayDateAggregation('floor', fromDate),
      floor24: filterArrayDateAggregation('floor', yesterday),
      volumes: filterArrayDateAggregation('volumes', fromDate),
      volumes24: filterArrayDateAggregation('volumes', yesterday),
      listedCount: filterArrayDateAggregation('listedCount', fromDate),
      listedCount24: filterArrayDateAggregation('listedCount', yesterday),
    },
  };
};
