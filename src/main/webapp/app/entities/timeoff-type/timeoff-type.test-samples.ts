import { ITimeoffType, NewTimeoffType } from './timeoff-type.model';

export const sampleWithRequiredData: ITimeoffType = {
  timeoffTypeId: 93773,
};

export const sampleWithPartialData: ITimeoffType = {
  timeoffTypeId: 51551,
};

export const sampleWithFullData: ITimeoffType = {
  timeoffTypeId: 23417,
  typeName: 'Sharable Specialist niches',
};

export const sampleWithNewData: NewTimeoffType = {
  timeoffTypeId: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
