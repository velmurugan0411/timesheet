import { IUserTask, NewUserTask } from './user-task.model';

export const sampleWithRequiredData: IUserTask = {
  userTaskId: 39131,
  userId: 42401,
  taskId: 48610,
};

export const sampleWithPartialData: IUserTask = {
  userTaskId: 63728,
  userId: 11717,
  taskId: 57951,
};

export const sampleWithFullData: IUserTask = {
  userTaskId: 41550,
  userId: 90598,
  taskId: 29352,
};

export const sampleWithNewData: NewUserTask = {
  userId: 23805,
  taskId: 42888,
  userTaskId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
