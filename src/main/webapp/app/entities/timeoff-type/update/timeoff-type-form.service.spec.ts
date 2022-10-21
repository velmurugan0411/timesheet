import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../timeoff-type.test-samples';

import { TimeoffTypeFormService } from './timeoff-type-form.service';

describe('TimeoffType Form Service', () => {
  let service: TimeoffTypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeoffTypeFormService);
  });

  describe('Service methods', () => {
    describe('createTimeoffTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTimeoffTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            timeoffTypeId: expect.any(Object),
            typeName: expect.any(Object),
          })
        );
      });

      it('passing ITimeoffType should create a new form with FormGroup', () => {
        const formGroup = service.createTimeoffTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            timeoffTypeId: expect.any(Object),
            typeName: expect.any(Object),
          })
        );
      });
    });

    describe('getTimeoffType', () => {
      it('should return NewTimeoffType for default TimeoffType initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTimeoffTypeFormGroup(sampleWithNewData);

        const timeoffType = service.getTimeoffType(formGroup) as any;

        expect(timeoffType).toMatchObject(sampleWithNewData);
      });

      it('should return NewTimeoffType for empty TimeoffType initial value', () => {
        const formGroup = service.createTimeoffTypeFormGroup();

        const timeoffType = service.getTimeoffType(formGroup) as any;

        expect(timeoffType).toMatchObject({});
      });

      it('should return ITimeoffType', () => {
        const formGroup = service.createTimeoffTypeFormGroup(sampleWithRequiredData);

        const timeoffType = service.getTimeoffType(formGroup) as any;

        expect(timeoffType).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITimeoffType should not enable timeoffTypeId FormControl', () => {
        const formGroup = service.createTimeoffTypeFormGroup();
        expect(formGroup.controls.timeoffTypeId.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.timeoffTypeId.disabled).toBe(true);
      });

      it('passing NewTimeoffType should disable timeoffTypeId FormControl', () => {
        const formGroup = service.createTimeoffTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.timeoffTypeId.disabled).toBe(true);

        service.resetForm(formGroup, { timeoffTypeId: null });

        expect(formGroup.controls.timeoffTypeId.disabled).toBe(true);
      });
    });
  });
});
