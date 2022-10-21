import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../timesheet-status.test-samples';

import { TimesheetStatusFormService } from './timesheet-status-form.service';

describe('TimesheetStatus Form Service', () => {
  let service: TimesheetStatusFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimesheetStatusFormService);
  });

  describe('Service methods', () => {
    describe('createTimesheetStatusFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTimesheetStatusFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            timesheetStatusId: expect.any(Object),
            statusName: expect.any(Object),
          })
        );
      });

      it('passing ITimesheetStatus should create a new form with FormGroup', () => {
        const formGroup = service.createTimesheetStatusFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            timesheetStatusId: expect.any(Object),
            statusName: expect.any(Object),
          })
        );
      });
    });

    describe('getTimesheetStatus', () => {
      it('should return NewTimesheetStatus for default TimesheetStatus initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTimesheetStatusFormGroup(sampleWithNewData);

        const timesheetStatus = service.getTimesheetStatus(formGroup) as any;

        expect(timesheetStatus).toMatchObject(sampleWithNewData);
      });

      it('should return NewTimesheetStatus for empty TimesheetStatus initial value', () => {
        const formGroup = service.createTimesheetStatusFormGroup();

        const timesheetStatus = service.getTimesheetStatus(formGroup) as any;

        expect(timesheetStatus).toMatchObject({});
      });

      it('should return ITimesheetStatus', () => {
        const formGroup = service.createTimesheetStatusFormGroup(sampleWithRequiredData);

        const timesheetStatus = service.getTimesheetStatus(formGroup) as any;

        expect(timesheetStatus).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITimesheetStatus should not enable timesheetStatusId FormControl', () => {
        const formGroup = service.createTimesheetStatusFormGroup();
        expect(formGroup.controls.timesheetStatusId.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.timesheetStatusId.disabled).toBe(true);
      });

      it('passing NewTimesheetStatus should disable timesheetStatusId FormControl', () => {
        const formGroup = service.createTimesheetStatusFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.timesheetStatusId.disabled).toBe(true);

        service.resetForm(formGroup, { timesheetStatusId: null });

        expect(formGroup.controls.timesheetStatusId.disabled).toBe(true);
      });
    });
  });
});
