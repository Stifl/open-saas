import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@prisma/client';
import type { User } from '@wasp/entities';
import { TierIds } from '@wasp/shared/constants.js';

// in a terminal window run `wasp db seed` to seed your dev database with this data
export function createRandomUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const user: Omit<User, 'id'> = {
    email: faker.internet.email({
      firstName,
      lastName,
    }),
    username: faker.internet.userName({
      firstName,
      lastName,
    }),
    password: faker.internet.password({
      length: 12,
      prefix: 'Aa1!',
    }),
    createdAt: faker.date.between({ from: new Date('2023-01-01'), to: new Date() }),
    lastActiveTimestamp: faker.date.recent(),
    isAdmin: false,
    isEmailVerified: faker.helpers.arrayElement([true, false]),
    stripeId: `cus_${faker.string.uuid()}`,
    hasPaid: faker.helpers.arrayElement([true, false]),
    sendEmail: false,
    subscriptionStatus: faker.helpers.arrayElement(['active', 'canceled', 'past_due', 'deleted']),
    datePaid: faker.date.recent(),
    credits: faker.number.int({ min: 0, max: 3 }),
    emailVerificationSentAt: null,
    passwordResetSentAt: null,
    checkoutSessionId: null,
    subscriptionTier: faker.helpers.arrayElement([TierIds.HOBBY, TierIds.PRO]),
  };
  return user;
}

const USERS: Omit<User, 'id'>[] = faker.helpers.multiple(createRandomUser, {
  count: 50,
});

export async function devSeedUsers(prismaClient: PrismaClient) {
  try {
    await Promise.all(
      USERS.map(async (user) => {
        await prismaClient.user.create({
          data: user,
        });
      })
    );
  } catch (error) {
    console.error(error);
  }
}
