import { buildUrl, httpService } from "utils";
import {
  httpServiceReservationSystem,
  ReservationSystemResponseWrapper,
} from "utils/http";
import { AuthLoginInput, AuthLoginOutput } from "../../../../../api/routing";

export interface ICredentials {
  // TODO: cleanup this interface
  username: string;
  password: string;
}

export const loginUser = (body: AuthLoginInput) => {
  return httpServiceReservationSystem.post<
    ReservationSystemResponseWrapper<AuthLoginOutput>
  >(buildUrl("v1/auth/login"), body);
};
