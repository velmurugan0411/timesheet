import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  taskId: 37978,
  projectId: 78079,
};

export const sampleWithPartialData: ITask = {
  taskId: 61703,
  projectId: 99632,
  taskName: 'Up-sized Cheese Representative',
};

export const sampleWithFullData: ITask = {
  taskId: 50690,
  projectId: 31278,
  taskName: 'Jewelery functionalities Virginia',
  description: "Pa'anga Soft Producer",
  activeInd: true,
};

export const sampleWithNewData: NewTask = {
  projectId: 84731,
  taskId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
