import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../timesheet.test-samples';

import { TimesheetFormService } from './timesheet-form.service';

describe('Timesheet Form Service', () => {
  let service: TimesheetFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimesheetFormService);
  });

  describe('Service methods', () => {
    describe('createTimesheetFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTimesheetFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            timesheetId: expect.any(Object),
            periodStartingDate: expect.any(Object),
            periodEndingDate: expect.any(Object),
            notes: expect.any(Object),
            timesheetStatusId: expect.any(Object),
            userId: expect.any(Object),
          })
        );
      });

      it('passing ITimesheet should create a new form with FormGroup', () => {
        const formGroup = service.createTimesheetFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            timesheetId: expect.any(Object),
            periodStartingDate: expect.any(Object),
            periodEndingDate: expect.any(Object),
            notes: expect.any(Object),
            timesheetStatusId: expect.any(Object),
            userId: expect.any(Object),
          })
        );
      });
    });

    describe('getTimesheet', () => {
      it('should return NewTimesheet for default Timesheet initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTimesheetFormGroup(sampleWithNewData);

        const timesheet = service.getTimesheet(formGroup) as any;

        expect(timesheet).toMatchObject(sampleWithNewData);
      });

      it('should return NewTimesheet for empty Timesheet initial value', () => {
        const formGroup = service.createTimesheetFormGroup();

        const timesheet = service.getTimesheet(formGroup) as any;

        expect(timesheet).toMatchObject({});
      });

      it('should return ITimesheet', () => {
        const formGroup = service.createTimesheetFormGroup(sampleWithRequiredData);

        const timesheet = service.getTimesheet(formGroup) as any;

        expect(timesheet).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITimesheet should not enable timesheetId FormControl', () => {
        const formGroup = service.createTimesheetFormGroup();
        expect(formGroup.controls.timesheetId.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.timesheetId.disabled).toBe(true);
      });

      it('passing NewTimesheet should disable timesheetId FormControl', () => {
        const formGroup = service.createTimesheetFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.timesheetId.disabled).toBe(true);

        service.resetForm(formGroup, { timesheetId: null });

        expect(formGroup.controls.timesheetId.disabled).toBe(true);
      });
    });
  });
});
