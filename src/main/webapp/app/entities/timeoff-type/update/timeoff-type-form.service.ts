import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITimeoffType, NewTimeoffType } from '../timeoff-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { timeoffTypeId: unknown }> = Partial<Omit<T, 'timeoffTypeId'>> & {
  timeoffTypeId: T['timeoffTypeId'];
};

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITimeoffType for edit and NewTimeoffTypeFormGroupInput for create.
 */
type TimeoffTypeFormGroupInput = ITimeoffType | PartialWithRequiredKeyOf<NewTimeoffType>;

type TimeoffTypeFormDefaults = Pick<NewTimeoffType, 'timeoffTypeId'>;

type TimeoffTypeFormGroupContent = {
  timeoffTypeId: FormControl<ITimeoffType['timeoffTypeId'] | NewTimeoffType['timeoffTypeId']>;
  typeName: FormControl<ITimeoffType['typeName']>;
};

export type TimeoffTypeFormGroup = FormGroup<TimeoffTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TimeoffTypeFormService {
  createTimeoffTypeFormGroup(timeoffType: TimeoffTypeFormGroupInput = { timeoffTypeId: null }): TimeoffTypeFormGroup {
    const timeoffTypeRawValue = {
      ...this.getFormDefaults(),
      ...timeoffType,
    };
    return new FormGroup<TimeoffTypeFormGroupContent>({
      timeoffTypeId: new FormControl(
        { value: timeoffTypeRawValue.timeoffTypeId, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      typeName: new FormControl(timeoffTypeRawValue.typeName),
    });
  }

  getTimeoffType(form: TimeoffTypeFormGroup): ITimeoffType | NewTimeoffType {
    return form.getRawValue() as ITimeoffType | NewTimeoffType;
  }

  resetForm(form: TimeoffTypeFormGroup, timeoffType: TimeoffTypeFormGroupInput): void {
    const timeoffTypeRawValue = { ...this.getFormDefaults(), ...timeoffType };
    form.reset(
      {
        ...timeoffTypeRawValue,
        timeoffTypeId: { value: timeoffTypeRawValue.timeoffTypeId, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TimeoffTypeFormDefaults {
    return {
      timeoffTypeId: null,
    };
  }
}
