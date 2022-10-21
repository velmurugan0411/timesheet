import { IUser } from 'app/entities/user/user.model';
import { ITask } from 'app/entities/task/task.model';

export interface IUserTask {
  userTaskId: number;
  userId?: Pick<IUser, 'id'> | null;
  taskId?: Pick<ITask, 'taskId'> | null;
}

export type NewUserTask = Omit<IUserTask, 'userTaskId'> & { userTaskId: null };
