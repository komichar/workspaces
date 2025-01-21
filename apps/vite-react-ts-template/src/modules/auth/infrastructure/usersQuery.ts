import { httpServiceReservationSystem, APIResponseWrapper } from "utils/http";

import type { UsersListOutput } from "../../../../../api/routing";
import type { User } from "../../../../../api/user";
import { queryClient, useQuery } from "utils";

export const getUsersQueryKey = () => ["users"];

const getUsersQuery = () => ({
  queryKey: getUsersQueryKey(),
  queryFn: (): Promise<User[]> =>
    httpServiceReservationSystem
      .get<APIResponseWrapper<UsersListOutput>>("v1/users")
      .then((res) => res.data.users),
});

export const useUsersQuery = () => {
  return useQuery({
    ...getUsersQuery(),
  });
};

export const usersLoader = async () =>
  queryClient.ensureQueryData(getUsersQuery());
