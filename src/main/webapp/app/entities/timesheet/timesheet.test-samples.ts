import dayjs from 'dayjs/esm';

import { ITimesheet, NewTimesheet } from './timesheet.model';

export const sampleWithRequiredData: ITimesheet = {
  timesheetId: 56556,
  userId: 81571,
  timesheetStatusId: 83511,
  periodStartingDate: dayjs('2022-10-21T00:35'),
  periodEndingDate: dayjs('2022-10-20T04:12'),
};

export const sampleWithPartialData: ITimesheet = {
  timesheetId: 38212,
  userId: 7591,
  timesheetStatusId: 52106,
  periodStartingDate: dayjs('2022-10-20T10:23'),
  periodEndingDate: dayjs('2022-10-20T12:17'),
};

export const sampleWithFullData: ITimesheet = {
  timesheetId: 72270,
  userId: 17111,
  timesheetStatusId: 63869,
  periodStartingDate: dayjs('2022-10-20T21:30'),
  periodEndingDate: dayjs('2022-10-21T01:26'),
  notes: 'expedite Jordan',
};

export const sampleWithNewData: NewTimesheet = {
  userId: 5702,
  timesheetStatusId: 55438,
  periodStartingDate: dayjs('2022-10-20T11:50'),
  periodEndingDate: dayjs('2022-10-20T18:21'),
  timesheetId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
