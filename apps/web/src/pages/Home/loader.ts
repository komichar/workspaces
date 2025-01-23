import { usersLoader } from "modules/auth/infrastructure";

export const homePageLoader = () => {
  return usersLoader();
};
