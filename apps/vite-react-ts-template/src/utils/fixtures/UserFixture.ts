import { User } from "../../../../api/user";
import { createFixture } from "./createFixture";

export const UserFixture = createFixture<User>({
  id: 1,
  email: "John@gmail.com",
  admin: false,
  name: "John doe",
  office_id: 1,
});
