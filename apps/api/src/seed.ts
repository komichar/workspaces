import { faker } from "@faker-js/faker";
import { db } from "./database.js";
import { Office } from "./office.js";
import { officesTable, usersTable } from "./schema.js";
import { NewUser } from "./user.js";

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

const usersss: NewUser[] = [];

for (let i = 0; i < BelgradeOfficeUsersCount; i++) {
  usersss.push(createOfficeUser(belgradeOffice.id, i == 0));
}
for (let i = 0; i < IrvineOfficeUsersCount; i++) {
  usersss.push(createOfficeUser(irvineOffice.id, i == 0));
}
for (let i = 0; i < ParisOfficeUsersCount; i++) {
  usersss.push(createOfficeUser(parisOffice.id, i == 0));
}

function createOfficeUser(office_id: number, admin: boolean) {
  const nu: NewUser = {
    email: faker.internet.email(),
    admin: admin,
    name: faker.person.firstName(),
    office_id: office_id,
  };
  return nu;
}

const users = await db.insert(usersTable).values(usersss).returning();

console.log(`Added users: ${users.length}`);
// list admins
const admins = users.filter((u) => u.admin);
console.log(`Admins: are ${admins.length}`);
admins.forEach((a) => console.log(a.email));
