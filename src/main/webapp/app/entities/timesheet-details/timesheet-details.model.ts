import dayjs from 'dayjs/esm';
import { ITimeoffType } from 'app/entities/timeoff-type/timeoff-type.model';
import { ITask } from 'app/entities/task/task.model';
import { ITimesheet } from 'app/entities/timesheet/timesheet.model';

export interface ITimesheetDetails {
  timesheetDetailsId: number;
  taskId?: number | null;
  timesheetId?: number | null;
  timeoffTypeId?: number | null;
  workdate?: dayjs.Dayjs | null;
  hours?: number | null;
  timeoffTypeId?: Pick<ITimeoffType, 'timeoffTypeId'> | null;
  taskId?: Pick<ITask, 'taskId'> | null;
  timesheetId?: Pick<ITimesheet, 'timesheetId'> | null;
}

export type NewTimesheetDetails = Omit<ITimesheetDetails, 'timesheetDetailsId'> & { timesheetDetailsId: null };
