import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICustomer, NewCustomer } from '../customer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { customerId: unknown }> = Partial<Omit<T, 'customerId'>> & { customerId: T['customerId'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICustomer for edit and NewCustomerFormGroupInput for create.
 */
type CustomerFormGroupInput = ICustomer | PartialWithRequiredKeyOf<NewCustomer>;

type CustomerFormDefaults = Pick<NewCustomer, 'customerId' | 'activeInd'>;

type CustomerFormGroupContent = {
  customerId: FormControl<ICustomer['customerId'] | NewCustomer['customerId']>;
  customerName: FormControl<ICustomer['customerName']>;
  description: FormControl<ICustomer['description']>;
  activeInd: FormControl<ICustomer['activeInd']>;
};

export type CustomerFormGroup = FormGroup<CustomerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CustomerFormService {
  createCustomerFormGroup(customer: CustomerFormGroupInput = { customerId: null }): CustomerFormGroup {
    const customerRawValue = {
      ...this.getFormDefaults(),
      ...customer,
    };
    return new FormGroup<CustomerFormGroupContent>({
      customerId: new FormControl(
        { value: customerRawValue.customerId, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      customerName: new FormControl(customerRawValue.customerName, {
        validators: [Validators.required],
      }),
      description: new FormControl(customerRawValue.description, {
        validators: [Validators.required],
      }),
      activeInd: new FormControl(customerRawValue.activeInd),
    });
  }

  getCustomer(form: CustomerFormGroup): ICustomer | NewCustomer {
    return form.getRawValue() as ICustomer | NewCustomer;
  }

  resetForm(form: CustomerFormGroup, customer: CustomerFormGroupInput): void {
    const customerRawValue = { ...this.getFormDefaults(), ...customer };
    form.reset(
      {
        ...customerRawValue,
        customerId: { value: customerRawValue.customerId, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CustomerFormDefaults {
    return {
      customerId: null,
      activeInd: false,
    };
  }
}
