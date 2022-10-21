import { IUserTask, NewUserTask } from './user-task.model';

export const sampleWithRequiredData: IUserTask = {
  userTaskId: 39131,
};

export const sampleWithPartialData: IUserTask = {
  userTaskId: 42401,
};

export const sampleWithFullData: IUserTask = {
  userTaskId: 48610,
};

export const sampleWithNewData: NewUserTask = {
  userTaskId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
