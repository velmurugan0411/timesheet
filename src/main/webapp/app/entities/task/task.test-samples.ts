import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  taskId: 37978,
};

export const sampleWithPartialData: ITask = {
  taskId: 38844,
  taskName: 'Strategist National',
  description: 'synthesizing',
};

export const sampleWithFullData: ITask = {
  taskId: 98903,
  taskName: 'Granite TCP Table',
  description: 'Virginia Dynamic attitude',
  activeInd: false,
};

export const sampleWithNewData: NewTask = {
  taskId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
