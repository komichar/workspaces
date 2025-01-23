import { officeLoader } from "modules/offices/infrastructure";
import { LoaderFunctionArgs } from "shared/Router";

export const officePageLoader = ({ params }: LoaderFunctionArgs) => {
  return officeLoader((params as { officeId: string }).officeId);
};
