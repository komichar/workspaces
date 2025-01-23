import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuthStore } from "modules/auth/application";
import { useOfficeQuery } from "modules/offices/infrastructure";
import {
  useReservationCreateMutation,
  useReservationDeleteMutation,
  useReservationsQuery,
} from "modules/reservations/infrastructure";
import { useMemo } from "react";
import { Page, PageHeader } from "shared/Layout";
import { useNavigate, useParams } from "shared/Router";
import { useNotImplementedYetToast } from "shared/Toast";

import { useReservationCreatedNotifications } from "modules/reservations/presentation/useReservationCreatedNotifications";
import { useReservationDeletedNotifications } from "modules/reservations/presentation/useReservationDeletedNotifications";
import type { Reservation } from "../../../../api/src/reservation";
import { useAvailabilityQuery } from "modules/availability/infrastructure";
import { SeatGrid } from "./SeatGrid";

type AvailableReservation = Omit<Reservation, "user_id"> & {
  user_id: null;
};

export type MixedReservation = Reservation | AvailableReservation;

export const ReservationSeatsOverview = () => {
  const notImplemented = useNotImplementedYetToast();
  const params = useParams<{ date: string }>();
  const navigate = useNavigate();

  const reservationCreateMutation = useReservationCreateMutation();
  const [notifyCreatedSuccess, notifyCreatedFailure] =
    useReservationCreatedNotifications();
  const reservationDeleteMutation = useReservationDeleteMutation();
  const [notifyDeletedSuccess, notifyDeletedFailure] =
    useReservationDeletedNotifications();

  const user = useAuthStore((store) => store.user);

  if (!user) {
    throw new Error("User not found");
  }

  const availability = useAvailabilityQuery({
    date: params.date as string,
    id: user.office_id as number,
    email: user.email,
  });

  const mixedReservations: MixedReservation[] = useMemo(() => {
    if (!user) {
      return [];
    }

    if (!availability.data) {
      return [];
    }

    const combined: MixedReservation[] = [];

    // fill in with seats empty reservations
    for (let index = 0; index < availability.data.office.capacity; index++) {
      const seat_number = index + 1;

      const item: AvailableReservation = {
        date: params.date!,
        id: 0,
        office_id: user.office_id!,
        status: "available",
        user_id: null,
        seat_number: seat_number,
        start_time: "00:00",
        end_time: "00:00",
      };

      combined[index] = item;
    }

    // fill in the reservations with reservations by seat number
    availability.data.reservations.forEach((reservation) => {
      const seat_number = reservation.seat_number - 1;
      combined[seat_number] = structuredClone(reservation);
    });

    return combined;
  }, [JSON.stringify(availability.data)]);

  if (!availability.data) {
    return <h1>loading</h1>;
  }

  return (
    <Page>
      <PageHeader
        title={`Reservations for ${params.date}`}
        description={
          availability.data.office
            ? `You work at ${availability.data.office.city} office (id: ${availability.data.office.id})`
            : `You work at...`
        }
      >
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate("/reservations")}
        >
          Reservations list
        </Button>
      </PageHeader>

      {availability.data && (
        <Box py={4}>
          <Box display="flex" justifyContent="space-between">
            <Box>
              {availability.data.capacity.high_demand ? (
                <Badge size="xl" colorScheme="red">
                  High demand: booking is time capped
                </Badge>
              ) : (
                <Badge size="xl">Normal demand, booking is not capped</Badge>
              )}
            </Box>
            <Box>
              <Text fontSize="lg">
                {`Filled at ${availability.data.capacity.filled_percentage} of total time capacity`}
              </Text>
            </Box>
          </Box>
          <Progress
            borderRadius={4}
            my={2}
            size="lg"
            value={availability.data.capacity.filled_ratio * 100}
          />
        </Box>
      )}

      <SeatGrid
        mixedReservations={mixedReservations}
        afterAction={async () => availability.refetch()}
        reservationCreateMutation={reservationCreateMutation}
        reservationDeleteMutation={reservationDeleteMutation}
        user={user}
      ></SeatGrid>

      <Box my={2}>
        <VStack spacing={4} align="stretch"></VStack>
      </Box>
    </Page>
  );
};
