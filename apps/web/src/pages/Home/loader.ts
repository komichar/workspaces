import { usersLoader } from "modules/auth/infrastructure";
import { officesLoader } from "modules/offices/infrastructure";

export const homePageLoader = () => {
  return officesLoader();
};
