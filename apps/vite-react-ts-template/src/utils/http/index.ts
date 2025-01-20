import { HttpService } from "./HttpService";
import { KyClient } from "./KyClient";

const headers = {
  "Content-Type": "application/json",
};

export const host = import.meta.env.VITE_FAKE_STORE_API_HOST;
export const reservationSystemApiHost = import.meta.env
  .VITE_RESERVATION_SYSTEM_API_HOST;

export const httpService = new HttpService(
  new KyClient({ prefixUrl: host, headers })
);

export const httpServiceReservationSystem = new HttpService(
  new KyClient({ prefixUrl: reservationSystemApiHost, headers })
);

export type ReservationSystemResponseWrapper<T> = {
  status: string;
  data: T;
};

export {
  InternalServerException,
  ResourceNotFoundException,
} from "./exceptions";
export { AjaxError } from "./AjaxError";
