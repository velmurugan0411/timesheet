import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../task.test-samples';

import { TaskFormService } from './task-form.service';

describe('Task Form Service', () => {
  let service: TaskFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskFormService);
  });

  describe('Service methods', () => {
    describe('createTaskFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTaskFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            taskId: expect.any(Object),
            projectId: expect.any(Object),
            taskName: expect.any(Object),
            description: expect.any(Object),
            activeInd: expect.any(Object),
            projectId: expect.any(Object),
          })
        );
      });

      it('passing ITask should create a new form with FormGroup', () => {
        const formGroup = service.createTaskFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            taskId: expect.any(Object),
            projectId: expect.any(Object),
            taskName: expect.any(Object),
            description: expect.any(Object),
            activeInd: expect.any(Object),
            projectId: expect.any(Object),
          })
        );
      });
    });

    describe('getTask', () => {
      it('should return NewTask for default Task initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTaskFormGroup(sampleWithNewData);

        const task = service.getTask(formGroup) as any;

        expect(task).toMatchObject(sampleWithNewData);
      });

      it('should return NewTask for empty Task initial value', () => {
        const formGroup = service.createTaskFormGroup();

        const task = service.getTask(formGroup) as any;

        expect(task).toMatchObject({});
      });

      it('should return ITask', () => {
        const formGroup = service.createTaskFormGroup(sampleWithRequiredData);

        const task = service.getTask(formGroup) as any;

        expect(task).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITask should not enable taskId FormControl', () => {
        const formGroup = service.createTaskFormGroup();
        expect(formGroup.controls.taskId.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.taskId.disabled).toBe(true);
      });

      it('passing NewTask should disable taskId FormControl', () => {
        const formGroup = service.createTaskFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.taskId.disabled).toBe(true);

        service.resetForm(formGroup, { taskId: null });

        expect(formGroup.controls.taskId.disabled).toBe(true);
      });
    });
  });
});
