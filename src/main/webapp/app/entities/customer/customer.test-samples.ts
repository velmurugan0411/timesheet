import { ICustomer, NewCustomer } from './customer.model';

export const sampleWithRequiredData: ICustomer = {
  customerId: 24379,
  customerName: 'Operations',
  description: 35573,
};

export const sampleWithPartialData: ICustomer = {
  customerId: 61881,
  customerName: 'Club 1080p Namibia',
  description: 50418,
  activeInd: true,
};

export const sampleWithFullData: ICustomer = {
  customerId: 58190,
  customerName: 'Chips',
  description: 36162,
  activeInd: false,
};

export const sampleWithNewData: NewCustomer = {
  customerName: 'THX Estonia',
  description: 76936,
  customerId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
