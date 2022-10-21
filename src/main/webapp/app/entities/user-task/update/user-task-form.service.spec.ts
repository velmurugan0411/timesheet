import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-task.test-samples';

import { UserTaskFormService } from './user-task-form.service';

describe('UserTask Form Service', () => {
  let service: UserTaskFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTaskFormService);
  });

  describe('Service methods', () => {
    describe('createUserTaskFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserTaskFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            userTaskId: expect.any(Object),
            userId: expect.any(Object),
            taskId: expect.any(Object),
          })
        );
      });

      it('passing IUserTask should create a new form with FormGroup', () => {
        const formGroup = service.createUserTaskFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            userTaskId: expect.any(Object),
            userId: expect.any(Object),
            taskId: expect.any(Object),
          })
        );
      });
    });

    describe('getUserTask', () => {
      it('should return NewUserTask for default UserTask initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserTaskFormGroup(sampleWithNewData);

        const userTask = service.getUserTask(formGroup) as any;

        expect(userTask).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserTask for empty UserTask initial value', () => {
        const formGroup = service.createUserTaskFormGroup();

        const userTask = service.getUserTask(formGroup) as any;

        expect(userTask).toMatchObject({});
      });

      it('should return IUserTask', () => {
        const formGroup = service.createUserTaskFormGroup(sampleWithRequiredData);

        const userTask = service.getUserTask(formGroup) as any;

        expect(userTask).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserTask should not enable userTaskId FormControl', () => {
        const formGroup = service.createUserTaskFormGroup();
        expect(formGroup.controls.userTaskId.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.userTaskId.disabled).toBe(true);
      });

      it('passing NewUserTask should disable userTaskId FormControl', () => {
        const formGroup = service.createUserTaskFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.userTaskId.disabled).toBe(true);

        service.resetForm(formGroup, { userTaskId: null });

        expect(formGroup.controls.userTaskId.disabled).toBe(true);
      });
    });
  });
});
