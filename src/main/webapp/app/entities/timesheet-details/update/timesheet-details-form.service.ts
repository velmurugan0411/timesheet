import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITimesheetDetails, NewTimesheetDetails } from '../timesheet-details.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { timesheetDetailsId: unknown }> = Partial<Omit<T, 'timesheetDetailsId'>> & {
  timesheetDetailsId: T['timesheetDetailsId'];
};

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITimesheetDetails for edit and NewTimesheetDetailsFormGroupInput for create.
 */
type TimesheetDetailsFormGroupInput = ITimesheetDetails | PartialWithRequiredKeyOf<NewTimesheetDetails>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITimesheetDetails | NewTimesheetDetails> = Omit<T, 'workdate'> & {
  workdate?: string | null;
};

type TimesheetDetailsFormRawValue = FormValueOf<ITimesheetDetails>;

type NewTimesheetDetailsFormRawValue = FormValueOf<NewTimesheetDetails>;

type TimesheetDetailsFormDefaults = Pick<NewTimesheetDetails, 'timesheetDetailsId' | 'workdate'>;

type TimesheetDetailsFormGroupContent = {
  timesheetDetailsId: FormControl<TimesheetDetailsFormRawValue['timesheetDetailsId'] | NewTimesheetDetails['timesheetDetailsId']>;
  taskId: FormControl<TimesheetDetailsFormRawValue['taskId']>;
  timesheetId: FormControl<TimesheetDetailsFormRawValue['timesheetId']>;
  timeoffTypeId: FormControl<TimesheetDetailsFormRawValue['timeoffTypeId']>;
  workdate: FormControl<TimesheetDetailsFormRawValue['workdate']>;
  hours: FormControl<TimesheetDetailsFormRawValue['hours']>;
  timeoffTypeId: FormControl<TimesheetDetailsFormRawValue['timeoffTypeId']>;
  taskId: FormControl<TimesheetDetailsFormRawValue['taskId']>;
  timesheetId: FormControl<TimesheetDetailsFormRawValue['timesheetId']>;
};

export type TimesheetDetailsFormGroup = FormGroup<TimesheetDetailsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TimesheetDetailsFormService {
  createTimesheetDetailsFormGroup(
    timesheetDetails: TimesheetDetailsFormGroupInput = { timesheetDetailsId: null }
  ): TimesheetDetailsFormGroup {
    const timesheetDetailsRawValue = this.convertTimesheetDetailsToTimesheetDetailsRawValue({
      ...this.getFormDefaults(),
      ...timesheetDetails,
    });
    return new FormGroup<TimesheetDetailsFormGroupContent>({
      timesheetDetailsId: new FormControl(
        { value: timesheetDetailsRawValue.timesheetDetailsId, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      taskId: new FormControl(timesheetDetailsRawValue.taskId, {
        validators: [Validators.required],
      }),
      timesheetId: new FormControl(timesheetDetailsRawValue.timesheetId, {
        validators: [Validators.required],
      }),
      timeoffTypeId: new FormControl(timesheetDetailsRawValue.timeoffTypeId, {
        validators: [Validators.required],
      }),
      workdate: new FormControl(timesheetDetailsRawValue.workdate, {
        validators: [Validators.required],
      }),
      hours: new FormControl(timesheetDetailsRawValue.hours, {
        validators: [Validators.required],
      }),
      timeoffTypeId: new FormControl(timesheetDetailsRawValue.timeoffTypeId),
      taskId: new FormControl(timesheetDetailsRawValue.taskId),
      timesheetId: new FormControl(timesheetDetailsRawValue.timesheetId, {
        validators: [Validators.required],
      }),
    });
  }

  getTimesheetDetails(form: TimesheetDetailsFormGroup): ITimesheetDetails | NewTimesheetDetails {
    return this.convertTimesheetDetailsRawValueToTimesheetDetails(
      form.getRawValue() as TimesheetDetailsFormRawValue | NewTimesheetDetailsFormRawValue
    );
  }

  resetForm(form: TimesheetDetailsFormGroup, timesheetDetails: TimesheetDetailsFormGroupInput): void {
    const timesheetDetailsRawValue = this.convertTimesheetDetailsToTimesheetDetailsRawValue({
      ...this.getFormDefaults(),
      ...timesheetDetails,
    });
    form.reset(
      {
        ...timesheetDetailsRawValue,
        timesheetDetailsId: { value: timesheetDetailsRawValue.timesheetDetailsId, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TimesheetDetailsFormDefaults {
    const currentTime = dayjs();

    return {
      timesheetDetailsId: null,
      workdate: currentTime,
    };
  }

  private convertTimesheetDetailsRawValueToTimesheetDetails(
    rawTimesheetDetails: TimesheetDetailsFormRawValue | NewTimesheetDetailsFormRawValue
  ): ITimesheetDetails | NewTimesheetDetails {
    return {
      ...rawTimesheetDetails,
      workdate: dayjs(rawTimesheetDetails.workdate, DATE_TIME_FORMAT),
    };
  }

  private convertTimesheetDetailsToTimesheetDetailsRawValue(
    timesheetDetails: ITimesheetDetails | (Partial<NewTimesheetDetails> & TimesheetDetailsFormDefaults)
  ): TimesheetDetailsFormRawValue | PartialWithRequiredKeyOf<NewTimesheetDetailsFormRawValue> {
    return {
      ...timesheetDetails,
      workdate: timesheetDetails.workdate ? timesheetDetails.workdate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
