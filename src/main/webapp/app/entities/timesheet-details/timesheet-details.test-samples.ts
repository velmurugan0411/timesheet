import dayjs from 'dayjs/esm';

import { ITimesheetDetails, NewTimesheetDetails } from './timesheet-details.model';

export const sampleWithRequiredData: ITimesheetDetails = {
  timesheetDetailsId: 14854,
  workdate: dayjs('2022-10-20T15:14'),
  hours: 90988,
};

export const sampleWithPartialData: ITimesheetDetails = {
  timesheetDetailsId: 83239,
  workdate: dayjs('2022-10-20T11:58'),
  hours: 9789,
};

export const sampleWithFullData: ITimesheetDetails = {
  timesheetDetailsId: 52227,
  workdate: dayjs('2022-10-20T12:24'),
  hours: 35810,
};

export const sampleWithNewData: NewTimesheetDetails = {
  workdate: dayjs('2022-10-20T06:20'),
  hours: 47462,
  timesheetDetailsId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
