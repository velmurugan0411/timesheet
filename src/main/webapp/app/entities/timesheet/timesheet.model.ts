import dayjs from 'dayjs/esm';
import { ITimesheetStatus } from 'app/entities/timesheet-status/timesheet-status.model';
import { IUser } from 'app/entities/user/user.model';

export interface ITimesheet {
  timesheetId: number;
  periodStartingDate?: dayjs.Dayjs | null;
  periodEndingDate?: dayjs.Dayjs | null;
  notes?: string | null;
  timesheetStatusId?: Pick<ITimesheetStatus, 'timesheetStatusId'> | null;
  userId?: Pick<IUser, 'id'> | null;
}

export type NewTimesheet = Omit<ITimesheet, 'timesheetId'> & { timesheetId: null };
