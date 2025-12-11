export type UserAddress = {
  street?: string;
  suite?: string;
  city?: string;
  zipcode?: string;
};

export type UserCompany = {
  name?: string;
  catchPhrase?: string;
  bs?: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website?: string;
  address?: UserAddress;
  company?: UserCompany;
};

export type NewUserPayload = Omit<User, 'id'>;

export type UserFormValues = {
  name: string;
  username: string;
  email: string;
  phone: string;
  companyName: string;
  website?: string;
};

