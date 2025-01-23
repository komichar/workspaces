import { buildUrl } from "utils";
import { httpServiceReservationSystem, APIResponseWrapper } from "utils/http";
import type {
  AuthLoginInput,
  AuthLoginOutput,
} from "../../../../../api/src/auth.routing";

export interface ICredentials {
  username: string;
  password: string;
}

export const loginUser = (body: AuthLoginInput) => {
  return httpServiceReservationSystem.post<APIResponseWrapper<AuthLoginOutput>>(
    buildUrl("v1/auth/login"),
    body
  );
};
