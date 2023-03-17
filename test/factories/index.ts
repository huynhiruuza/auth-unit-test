import { faker } from '@faker-js/faker';
export function userFactory(rest = {}) {
  return {
    email: faker.helpers.unique(faker.internet.email),
    password: faker.internet.password(),
    role: 'Admin',
    ...rest,
  };
}
