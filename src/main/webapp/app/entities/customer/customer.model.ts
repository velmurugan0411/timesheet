export interface ICustomer {
  customerId: number;
  customerName?: string | null;
  description?: number | null;
  activeInd?: boolean | null;
}

export type NewCustomer = Omit<ICustomer, 'customerId'> & { customerId: null };
