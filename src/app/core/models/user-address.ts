export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}