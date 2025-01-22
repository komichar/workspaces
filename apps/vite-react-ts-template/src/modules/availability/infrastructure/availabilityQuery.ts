import { buildUrl, queryClient, useQuery } from "utils";
import { APIResponseWrapper, httpServiceReservationSystem } from "utils/http";
import {
  GetOfficeDayAvailabilityInput,
  GetOfficeDayAvailabilityOutput,
} from "../../../../../api/src/offices-days-availability.routing";

export const getAvailabilityQueryKey = (
  params: GetOfficeDayAvailabilityInput
) => ["availability", params.date, params.id];

const getAvailabilityQuery = (
  email: string,
  params: GetOfficeDayAvailabilityInput
) => ({
  queryKey: getAvailabilityQueryKey(params),
  queryFn: (): Promise<GetOfficeDayAvailabilityOutput> =>
    httpServiceReservationSystem
      .get<APIResponseWrapper<GetOfficeDayAvailabilityOutput>>(
        buildUrl<GetOfficeDayAvailabilityOutput>(
          `v1/offices/${params.id}/days/${params.date}/availability`
        ),
        {
          headers: { Authorization: `Bearer ${email}` },
        }
      )
      .then((res) => res.data),
});

export const useAvailabilityQuery = (
  email: string,
  params: GetOfficeDayAvailabilityInput
) => {
  return useQuery({
    ...getAvailabilityQuery(email, params),
  });
};

export const availabilityLoader = async (
  email: string,
  params: GetOfficeDayAvailabilityInput
) => queryClient.ensureQueryData(getAvailabilityQuery(email, params));
