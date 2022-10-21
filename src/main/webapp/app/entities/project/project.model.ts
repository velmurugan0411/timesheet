import dayjs from 'dayjs/esm';
import { ICustomer } from 'app/entities/customer/customer.model';

export interface IProject {
  projectId: number;
  customerId?: number | null;
  projectName?: string | null;
  description?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  customerId?: Pick<ICustomer, 'customerId'> | null;
}

export type NewProject = Omit<IProject, 'projectId'> & { projectId: null };
