import dayjs from 'dayjs/esm';
import { ITimesheetStatus } from 'app/entities/timesheet-status/timesheet-status.model';

export interface ITimesheet {
  timesheetId: number;
  userId?: number | null;
  timesheetStatusId?: number | null;
  periodStartingDate?: dayjs.Dayjs | null;
  periodEndingDate?: dayjs.Dayjs | null;
  notes?: string | null;
  timesheetStatusId?: Pick<ITimesheetStatus, 'timesheetStatusId'> | null;
}

export type NewTimesheet = Omit<ITimesheet, 'timesheetId'> & { timesheetId: null };
