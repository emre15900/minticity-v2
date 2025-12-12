import { NewUserPayload, User, UserFormValues } from '@/features/users/types/user';

export function mapUserToFormValues(user?: User): UserFormValues {
  return {
    name: user?.name ?? '',
    username: user?.username ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    website: user?.website ?? '',
    companyName: user?.company?.name ?? '',
    avatarUrl: user?.avatarUrl ?? '',
  };
}

export function mapFormValuesToPayload(values: UserFormValues): NewUserPayload {
  return {
    name: values.name.trim(),
    username: values.username.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    website: values.website?.trim(),
    avatarUrl: values.avatarUrl?.trim(),
    company: values.companyName
      ? { name: values.companyName.trim() }
      : undefined,
  };
}

