import dayjs from 'dayjs/esm';

import { IProject, NewProject } from './project.model';

export const sampleWithRequiredData: IProject = {
  projectId: 55962,
  customerId: 94324,
  startDate: dayjs('2022-10-20T07:11'),
  endDate: dayjs('2022-10-20T14:30'),
};

export const sampleWithPartialData: IProject = {
  projectId: 25512,
  customerId: 38489,
  projectName: 'Investor Awesome users',
  startDate: dayjs('2022-10-20T09:22'),
  endDate: dayjs('2022-10-20T05:05'),
};

export const sampleWithFullData: IProject = {
  projectId: 61186,
  customerId: 87605,
  projectName: 'enhance',
  description: 'payment Centers',
  startDate: dayjs('2022-10-20T05:37'),
  endDate: dayjs('2022-10-20T21:18'),
};

export const sampleWithNewData: NewProject = {
  customerId: 78732,
  startDate: dayjs('2022-10-20T05:51'),
  endDate: dayjs('2022-10-20T13:21'),
  projectId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
