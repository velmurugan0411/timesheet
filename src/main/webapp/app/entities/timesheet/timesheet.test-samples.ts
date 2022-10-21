import dayjs from 'dayjs/esm';

import { ITimesheet, NewTimesheet } from './timesheet.model';

export const sampleWithRequiredData: ITimesheet = {
  timesheetId: 56556,
  periodStartingDate: dayjs('2022-10-20T08:17'),
  periodEndingDate: dayjs('2022-10-20T07:49'),
};

export const sampleWithPartialData: ITimesheet = {
  timesheetId: 98566,
  periodStartingDate: dayjs('2022-10-21T00:49'),
  periodEndingDate: dayjs('2022-10-20T18:41'),
};

export const sampleWithFullData: ITimesheet = {
  timesheetId: 7591,
  periodStartingDate: dayjs('2022-10-20T15:21'),
  periodEndingDate: dayjs('2022-10-20T10:23'),
  notes: 'microchip attitude-oriented',
};

export const sampleWithNewData: NewTimesheet = {
  periodStartingDate: dayjs('2022-10-20T18:15'),
  periodEndingDate: dayjs('2022-10-20T12:23'),
  timesheetId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
