import {
  httpServiceReservationSystem,
  ReservationSystemResponseWrapper,
} from "utils/http";
import type { UserByIdOutput } from "../../../../../api/routing";
import type { User } from "../../../../../api/user";

export const getUser = async (id: string): Promise<User> => {
  const response = await httpServiceReservationSystem.get<
    ReservationSystemResponseWrapper<UserByIdOutput>
  >(`v1/users/${id}`);

  return response.data.user;
};
