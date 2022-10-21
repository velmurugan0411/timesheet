import { ITimesheetStatus, NewTimesheetStatus } from './timesheet-status.model';

export const sampleWithRequiredData: ITimesheetStatus = {
  timesheetStatusId: 28196,
};

export const sampleWithPartialData: ITimesheetStatus = {
  timesheetStatusId: 94012,
  statusName: 'array bypassing',
};

export const sampleWithFullData: ITimesheetStatus = {
  timesheetStatusId: 71808,
  statusName: 'Macedonia non-volatile',
};

export const sampleWithNewData: NewTimesheetStatus = {
  timesheetStatusId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
