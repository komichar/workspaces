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

type AvailableReservation = Omit<Reservation, "user_id"> & {
  user_id: null;
};

type MixedReservation = Reservation | AvailableReservation;

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
            size="lg"
            value={availability.data.capacity.filled_ratio * 100}
          />
        </Box>
      )}

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {mixedReservations.map((reservation) => {
          const key = `${reservation.office_id}-${reservation.date}-${reservation.seat_number}`;
          const available = !reservation.user_id;
          const bookedByCurrentUser = user.id == reservation.user_id;

          return (
            <GridItem
              borderRadius={8}
              w="100%"
              p={8}
              bg={
                bookedByCurrentUser
                  ? "blue.100"
                  : available
                  ? "gray.100"
                  : "red.100"
              }
              key={key}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text as="b">Seat: {reservation.seat_number}</Text>

                {bookedByCurrentUser && (
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={async () => {
                      await reservationDeleteMutation
                        .mutateAsync(reservation.id)
                        .then(() => notifyDeletedSuccess())
                        .catch(() => notifyDeletedFailure());

                      await availability.refetch();
                    }}
                  >
                    Cancel
                  </Button>
                )}

                {available && (
                  <Button
                    colorScheme="teal"
                    variant="outline"
                    onClick={async () => {
                      await reservationCreateMutation
                        .mutateAsync({
                          email: user.email,
                          input: {
                            office_id: user.office_id as number,
                            date: params.date as string,
                            end_time: "00:00:00",
                            seat_number: reservation.seat_number,
                            start_time: "00:00:00",
                          },
                        })
                        .then(() => notifyCreatedSuccess())
                        .catch(() => notifyCreatedFailure());

                      await availability.refetch();
                    }}
                  >
                    Reserve
                  </Button>
                )}

                {!bookedByCurrentUser && !available && (
                  <Text as="b">Reserved by user: {reservation.user_id}</Text>
                )}
              </Box>
            </GridItem>
          );
        })}
      </Grid>

      <Box my={2}>
        <VStack spacing={4} align="stretch"></VStack>
      </Box>
    </Page>
  );
};
