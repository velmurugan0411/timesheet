export interface ITimesheetStatus {
  timesheetStatusId: number;
  statusName?: string | null;
}

export type NewTimesheetStatus = Omit<ITimesheetStatus, 'timesheetStatusId'> & { timesheetStatusId: null };
