import { httpServiceReservationSystem, APIResponseWrapper } from "utils/http";

import type { OfficeUsersListOutput } from "../../../../../api/src/offices-users.routing";
import type { User } from "../../../../../api/src/user";
import { queryClient, useQuery } from "utils";

export const getOfficesUsersQueryKey = (id: number) => ["offices-users", id];

const getOfficesUsersQuery = (id: number) => ({
  queryKey: getOfficesUsersQueryKey(id),
  queryFn: (): Promise<User[]> =>
    httpServiceReservationSystem
      .get<APIResponseWrapper<OfficeUsersListOutput>>(`v1/offices/${id}/users`)
      .then((res) => res.data.users),
});

export const useOfficesUsersQuery = (id: number) => {
  return useQuery({
    ...getOfficesUsersQuery(id),
  });
};

export const officesUsersLoader = async (id: number) =>
  queryClient.ensureQueryData(getOfficesUsersQuery(id));
