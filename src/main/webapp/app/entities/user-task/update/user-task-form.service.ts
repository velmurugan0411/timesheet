import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserTask, NewUserTask } from '../user-task.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { userTaskId: unknown }> = Partial<Omit<T, 'userTaskId'>> & { userTaskId: T['userTaskId'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserTask for edit and NewUserTaskFormGroupInput for create.
 */
type UserTaskFormGroupInput = IUserTask | PartialWithRequiredKeyOf<NewUserTask>;

type UserTaskFormDefaults = Pick<NewUserTask, 'userTaskId'>;

type UserTaskFormGroupContent = {
  userTaskId: FormControl<IUserTask['userTaskId'] | NewUserTask['userTaskId']>;
  userId: FormControl<IUserTask['userId']>;
  taskId: FormControl<IUserTask['taskId']>;
};

export type UserTaskFormGroup = FormGroup<UserTaskFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserTaskFormService {
  createUserTaskFormGroup(userTask: UserTaskFormGroupInput = { userTaskId: null }): UserTaskFormGroup {
    const userTaskRawValue = {
      ...this.getFormDefaults(),
      ...userTask,
    };
    return new FormGroup<UserTaskFormGroupContent>({
      userTaskId: new FormControl(
        { value: userTaskRawValue.userTaskId, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userId: new FormControl(userTaskRawValue.userId, {
        validators: [Validators.required],
      }),
      taskId: new FormControl(userTaskRawValue.taskId, {
        validators: [Validators.required],
      }),
    });
  }

  getUserTask(form: UserTaskFormGroup): IUserTask | NewUserTask {
    return form.getRawValue() as IUserTask | NewUserTask;
  }

  resetForm(form: UserTaskFormGroup, userTask: UserTaskFormGroupInput): void {
    const userTaskRawValue = { ...this.getFormDefaults(), ...userTask };
    form.reset(
      {
        ...userTaskRawValue,
        userTaskId: { value: userTaskRawValue.userTaskId, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserTaskFormDefaults {
    return {
      userTaskId: null,
    };
  }
}
