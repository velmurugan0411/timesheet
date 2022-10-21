import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITimesheet, NewTimesheet } from '../timesheet.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { timesheetId: unknown }> = Partial<Omit<T, 'timesheetId'>> & { timesheetId: T['timesheetId'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITimesheet for edit and NewTimesheetFormGroupInput for create.
 */
type TimesheetFormGroupInput = ITimesheet | PartialWithRequiredKeyOf<NewTimesheet>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITimesheet | NewTimesheet> = Omit<T, 'periodStartingDate' | 'periodEndingDate'> & {
  periodStartingDate?: string | null;
  periodEndingDate?: string | null;
};

type TimesheetFormRawValue = FormValueOf<ITimesheet>;

type NewTimesheetFormRawValue = FormValueOf<NewTimesheet>;

type TimesheetFormDefaults = Pick<NewTimesheet, 'timesheetId' | 'periodStartingDate' | 'periodEndingDate'>;

type TimesheetFormGroupContent = {
  timesheetId: FormControl<TimesheetFormRawValue['timesheetId'] | NewTimesheet['timesheetId']>;
  periodStartingDate: FormControl<TimesheetFormRawValue['periodStartingDate']>;
  periodEndingDate: FormControl<TimesheetFormRawValue['periodEndingDate']>;
  notes: FormControl<TimesheetFormRawValue['notes']>;
  timesheetStatusId: FormControl<TimesheetFormRawValue['timesheetStatusId']>;
  userId: FormControl<TimesheetFormRawValue['userId']>;
};

export type TimesheetFormGroup = FormGroup<TimesheetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TimesheetFormService {
  createTimesheetFormGroup(timesheet: TimesheetFormGroupInput = { timesheetId: null }): TimesheetFormGroup {
    const timesheetRawValue = this.convertTimesheetToTimesheetRawValue({
      ...this.getFormDefaults(),
      ...timesheet,
    });
    return new FormGroup<TimesheetFormGroupContent>({
      timesheetId: new FormControl(
        { value: timesheetRawValue.timesheetId, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      periodStartingDate: new FormControl(timesheetRawValue.periodStartingDate, {
        validators: [Validators.required],
      }),
      periodEndingDate: new FormControl(timesheetRawValue.periodEndingDate, {
        validators: [Validators.required],
      }),
      notes: new FormControl(timesheetRawValue.notes),
      timesheetStatusId: new FormControl(timesheetRawValue.timesheetStatusId, {
        validators: [Validators.required],
      }),
      userId: new FormControl(timesheetRawValue.userId, {
        validators: [Validators.required],
      }),
    });
  }

  getTimesheet(form: TimesheetFormGroup): ITimesheet | NewTimesheet {
    return this.convertTimesheetRawValueToTimesheet(form.getRawValue() as TimesheetFormRawValue | NewTimesheetFormRawValue);
  }

  resetForm(form: TimesheetFormGroup, timesheet: TimesheetFormGroupInput): void {
    const timesheetRawValue = this.convertTimesheetToTimesheetRawValue({ ...this.getFormDefaults(), ...timesheet });
    form.reset(
      {
        ...timesheetRawValue,
        timesheetId: { value: timesheetRawValue.timesheetId, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TimesheetFormDefaults {
    const currentTime = dayjs();

    return {
      timesheetId: null,
      periodStartingDate: currentTime,
      periodEndingDate: currentTime,
    };
  }

  private convertTimesheetRawValueToTimesheet(rawTimesheet: TimesheetFormRawValue | NewTimesheetFormRawValue): ITimesheet | NewTimesheet {
    return {
      ...rawTimesheet,
      periodStartingDate: dayjs(rawTimesheet.periodStartingDate, DATE_TIME_FORMAT),
      periodEndingDate: dayjs(rawTimesheet.periodEndingDate, DATE_TIME_FORMAT),
    };
  }

  private convertTimesheetToTimesheetRawValue(
    timesheet: ITimesheet | (Partial<NewTimesheet> & TimesheetFormDefaults)
  ): TimesheetFormRawValue | PartialWithRequiredKeyOf<NewTimesheetFormRawValue> {
    return {
      ...timesheet,
      periodStartingDate: timesheet.periodStartingDate ? timesheet.periodStartingDate.format(DATE_TIME_FORMAT) : undefined,
      periodEndingDate: timesheet.periodEndingDate ? timesheet.periodEndingDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
