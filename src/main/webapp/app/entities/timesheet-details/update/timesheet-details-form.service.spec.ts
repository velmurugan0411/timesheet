import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../timesheet-details.test-samples';

import { TimesheetDetailsFormService } from './timesheet-details-form.service';

describe('TimesheetDetails Form Service', () => {
  let service: TimesheetDetailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimesheetDetailsFormService);
  });

  describe('Service methods', () => {
    describe('createTimesheetDetailsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTimesheetDetailsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            timesheetDetailsId: expect.any(Object),
            taskId: expect.any(Object),
            timesheetId: expect.any(Object),
            timeoffTypeId: expect.any(Object),
            workdate: expect.any(Object),
            hours: expect.any(Object),
            timeoffTypeId: expect.any(Object),
            taskId: expect.any(Object),
            timesheetId: expect.any(Object),
          })
        );
      });

      it('passing ITimesheetDetails should create a new form with FormGroup', () => {
        const formGroup = service.createTimesheetDetailsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            timesheetDetailsId: expect.any(Object),
            taskId: expect.any(Object),
            timesheetId: expect.any(Object),
            timeoffTypeId: expect.any(Object),
            workdate: expect.any(Object),
            hours: expect.any(Object),
            timeoffTypeId: expect.any(Object),
            taskId: expect.any(Object),
            timesheetId: expect.any(Object),
          })
        );
      });
    });

    describe('getTimesheetDetails', () => {
      it('should return NewTimesheetDetails for default TimesheetDetails initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTimesheetDetailsFormGroup(sampleWithNewData);

        const timesheetDetails = service.getTimesheetDetails(formGroup) as any;

        expect(timesheetDetails).toMatchObject(sampleWithNewData);
      });

      it('should return NewTimesheetDetails for empty TimesheetDetails initial value', () => {
        const formGroup = service.createTimesheetDetailsFormGroup();

        const timesheetDetails = service.getTimesheetDetails(formGroup) as any;

        expect(timesheetDetails).toMatchObject({});
      });

      it('should return ITimesheetDetails', () => {
        const formGroup = service.createTimesheetDetailsFormGroup(sampleWithRequiredData);

        const timesheetDetails = service.getTimesheetDetails(formGroup) as any;

        expect(timesheetDetails).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITimesheetDetails should not enable timesheetDetailsId FormControl', () => {
        const formGroup = service.createTimesheetDetailsFormGroup();
        expect(formGroup.controls.timesheetDetailsId.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.timesheetDetailsId.disabled).toBe(true);
      });

      it('passing NewTimesheetDetails should disable timesheetDetailsId FormControl', () => {
        const formGroup = service.createTimesheetDetailsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.timesheetDetailsId.disabled).toBe(true);

        service.resetForm(formGroup, { timesheetDetailsId: null });

        expect(formGroup.controls.timesheetDetailsId.disabled).toBe(true);
      });
    });
  });
});
