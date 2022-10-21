import dayjs from 'dayjs/esm';

import { ITimesheetDetails, NewTimesheetDetails } from './timesheet-details.model';

export const sampleWithRequiredData: ITimesheetDetails = {
  timesheetDetailsId: 14854,
  taskId: 52692,
  timesheetId: 90988,
  timeoffTypeId: 83239,
  workdate: dayjs('2022-10-20T11:58'),
  hours: 9789,
};

export const sampleWithPartialData: ITimesheetDetails = {
  timesheetDetailsId: 52227,
  taskId: 64480,
  timesheetId: 35810,
  timeoffTypeId: 89786,
  workdate: dayjs('2022-10-20T16:29'),
  hours: 96162,
};

export const sampleWithFullData: ITimesheetDetails = {
  timesheetDetailsId: 44583,
  taskId: 18486,
  timesheetId: 89432,
  timeoffTypeId: 20926,
  workdate: dayjs('2022-10-20T20:51'),
  hours: 56593,
};

export const sampleWithNewData: NewTimesheetDetails = {
  taskId: 74876,
  timesheetId: 8708,
  timeoffTypeId: 33771,
  workdate: dayjs('2022-10-20T11:56'),
  hours: 76582,
  timesheetDetailsId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
