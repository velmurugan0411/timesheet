export interface ITimeoffType {
  timeoffTypeId: number;
  typeName?: string | null;
}

export type NewTimeoffType = Omit<ITimeoffType, 'timeoffTypeId'> & { timeoffTypeId: null };
