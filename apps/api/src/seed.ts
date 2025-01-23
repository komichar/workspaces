import { faker } from "@faker-js/faker";
import { db } from "./database.js";
import { Office } from "./office.js";
import { officesTable, usersTable } from "./schema.js";
import { NewUser, User } from "./user.js";

const BelgradeOfficeUsersCount = 10;
const IrvineOfficeUsersCount = 20;
const ParisOfficeUsersCount = 10;

const [belgradeOffice, irvineOffice, parisOffice]: Office[] = await db
  .insert(officesTable)
  .values([
    {
      capacity: 3,
      city: "Belgrade",
      is_peak_limited: false,
    },
    {
      capacity: 6,
      city: "Irvine",
      is_peak_limited: true,
    },
    {
      capacity: 5,
      city: "Paris",
      is_peak_limited: true,
    },
  ])
  .returning();
console.log(
  `Added offices: ${belgradeOffice.city}, ${irvineOffice.city}, ${parisOffice.city}`
);

const users: User[] = [];

for (let i = 0; i < BelgradeOfficeUsersCount; i++) {
  try {
    const newBelgradeUser = createOfficeUserPayload(belgradeOffice.id, i == 0);

    const [createdBelgradeUser] = await db
      .insert(usersTable)
      .values(newBelgradeUser)
      .returning();
    users.push(createdBelgradeUser);
  } catch (error) {
    console.error("unable to insert");
  }
}
for (let i = 0; i < IrvineOfficeUsersCount; i++) {
  try {
    const newIrvineUser = createOfficeUserPayload(irvineOffice.id, i == 0);
    const [createdIrvineUser] = await db
      .insert(usersTable)
      .values(newIrvineUser)
      .returning();
    users.push(createdIrvineUser);
  } catch (error) {
    console.error("unable to insert");
  }
}
for (let i = 0; i < ParisOfficeUsersCount; i++) {
  try {
    const newParisUser = createOfficeUserPayload(parisOffice.id, i == 0);
    const [createdParisUser] = await db
      .insert(usersTable)
      .values(newParisUser)
      .returning();
    users.push(createdParisUser);
  } catch (error) {
    console.error("unable to insert");
  }
}

function createOfficeUserPayload(office_id: number, admin: boolean) {
  const newUserPayload: NewUser = {
    email: faker.internet.email(),
    admin: admin,
    name: faker.person.firstName(),
    office_id: office_id,
  };
  return newUserPayload;
}

console.log(`Added users total: ${users.length}`);
const admins = users.filter((u) => u.admin);
console.log(`Admins:`);
admins.forEach((a) => console.log(a.email));
