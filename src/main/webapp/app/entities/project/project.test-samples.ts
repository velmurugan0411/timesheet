import dayjs from 'dayjs/esm';

import { IProject, NewProject } from './project.model';

export const sampleWithRequiredData: IProject = {
  projectId: 55962,
  startDate: dayjs('2022-10-20T05:19'),
  endDate: dayjs('2022-10-20T07:11'),
};

export const sampleWithPartialData: IProject = {
  projectId: 27695,
  projectName: 'redefine',
  description: 'deposit redundant',
  startDate: dayjs('2022-10-20T14:36'),
  endDate: dayjs('2022-10-20T09:22'),
};

export const sampleWithFullData: IProject = {
  projectId: 95336,
  projectName: 'AGP Grass-roots',
  description: 'Avon Ball',
  startDate: dayjs('2022-10-20T05:51'),
  endDate: dayjs('2022-10-20T13:21'),
};

export const sampleWithNewData: NewProject = {
  startDate: dayjs('2022-10-20T13:32'),
  endDate: dayjs('2022-10-20T13:40'),
  projectId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
