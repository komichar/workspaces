import { httpServiceReservationSystem, APIResponseWrapper } from "utils/http";
import type { UserByIdOutput } from "../../../../../api/src/users.routing";
import type { User } from "../../../../../api/src/user";

export const getUser = async (id: string): Promise<User> => {
  const response = await httpServiceReservationSystem.get<
    APIResponseWrapper<UserByIdOutput>
  >(`v1/users/${id}`);

  return response.data.user;
};
