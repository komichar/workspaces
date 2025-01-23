import { HttpService } from "./HttpService";
import { KyClient } from "./KyClient";

const headers = {
  "Content-Type": "application/json",
};

export const host = import.meta.env.VITE_RESERVATION_SYSTEM_API_HOST;

export const httpService = new HttpService(
  new KyClient({ prefixUrl: host, headers })
);

export const httpServiceReservationSystem = new HttpService(
  new KyClient({ prefixUrl: host, headers })
);

export type APIResponseWrapper<T> = {
  status: string;
  data: T;
};

export {
  InternalServerException,
  ResourceNotFoundException,
} from "./exceptions";
export { AjaxError } from "./AjaxError";
