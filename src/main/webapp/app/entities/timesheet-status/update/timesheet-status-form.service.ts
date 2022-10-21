import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITimesheetStatus, NewTimesheetStatus } from '../timesheet-status.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { timesheetStatusId: unknown }> = Partial<Omit<T, 'timesheetStatusId'>> & {
  timesheetStatusId: T['timesheetStatusId'];
};

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITimesheetStatus for edit and NewTimesheetStatusFormGroupInput for create.
 */
type TimesheetStatusFormGroupInput = ITimesheetStatus | PartialWithRequiredKeyOf<NewTimesheetStatus>;

type TimesheetStatusFormDefaults = Pick<NewTimesheetStatus, 'timesheetStatusId'>;

type TimesheetStatusFormGroupContent = {
  timesheetStatusId: FormControl<ITimesheetStatus['timesheetStatusId'] | NewTimesheetStatus['timesheetStatusId']>;
  statusName: FormControl<ITimesheetStatus['statusName']>;
};

export type TimesheetStatusFormGroup = FormGroup<TimesheetStatusFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TimesheetStatusFormService {
  createTimesheetStatusFormGroup(timesheetStatus: TimesheetStatusFormGroupInput = { timesheetStatusId: null }): TimesheetStatusFormGroup {
    const timesheetStatusRawValue = {
      ...this.getFormDefaults(),
      ...timesheetStatus,
    };
    return new FormGroup<TimesheetStatusFormGroupContent>({
      timesheetStatusId: new FormControl(
        { value: timesheetStatusRawValue.timesheetStatusId, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      statusName: new FormControl(timesheetStatusRawValue.statusName),
    });
  }

  getTimesheetStatus(form: TimesheetStatusFormGroup): ITimesheetStatus | NewTimesheetStatus {
    return form.getRawValue() as ITimesheetStatus | NewTimesheetStatus;
  }

  resetForm(form: TimesheetStatusFormGroup, timesheetStatus: TimesheetStatusFormGroupInput): void {
    const timesheetStatusRawValue = { ...this.getFormDefaults(), ...timesheetStatus };
    form.reset(
      {
        ...timesheetStatusRawValue,
        timesheetStatusId: { value: timesheetStatusRawValue.timesheetStatusId, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TimesheetStatusFormDefaults {
    return {
      timesheetStatusId: null,
    };
  }
}
