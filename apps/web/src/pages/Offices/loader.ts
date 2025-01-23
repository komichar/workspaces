import { officesLoader } from "modules/offices/infrastructure/officesQuery";

export const officesPageLoader = () => {
  return officesLoader();
};
