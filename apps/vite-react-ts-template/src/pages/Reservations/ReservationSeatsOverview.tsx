import { ArrowBackIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
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

import type { Reservation } from "../../../../api/reservation";
import { useReservationCreatedNotifications } from "modules/reservations/presentation/useReservationCreatedNotifications";

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

  const user = useAuthStore((store) => store.user);

  if (!user) {
    throw new Error("User not found");
  }

  const everyonesReservations = useReservationsQuery({
    date: params.date as string,
    office_id: user?.office_id!,
    // user_id: user.id,
  });

  const office = useOfficeQuery(`${user.office_id}`);

  const mixedReservations: MixedReservation[] = useMemo(() => {
    if (!user) {
      return [];
    }

    if (!office.data) {
      return [];
    }

    if (!everyonesReservations.data) {
      return [];
    }

    const combined: MixedReservation[] = [];

    // fill in with seats empty reservations
    for (let index = 0; index < office.data.capacity!; index++) {
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
    everyonesReservations.data.reservations.forEach((reservation) => {
      const seat_number = reservation.seat_number - 1;
      combined[seat_number] = reservation;
    });

    return combined;
  }, [
    JSON.stringify(user),
    everyonesReservations.dataUpdatedAt,
    office.dataUpdatedAt,
  ]);

  if (everyonesReservations.isInitialLoading) {
    return <h1>loading</h1>;
  }

  // 1. fetch reservations from api
  // 2. display reservations in a grid

  return (
    <Page>
      <PageHeader
        title={`Reservations for ${params.date}`}
        description="Make reservations"
      >
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate("/reservations")}
        >
          Reservations
        </Button>
      </PageHeader>

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
                  ? "green.100"
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
                    onClick={async () => {
                      await reservationDeleteMutation.mutateAsync(
                        reservation.id
                      );

                      await everyonesReservations.refetch();
                    }}
                  >
                    Cancel
                    {/* Taken by {reservation.user_id} */}
                  </Button>
                )}

                {available && (
                  <Button
                    colorScheme="teal"
                    variant="outline"
                    onClick={async () => {
                      await reservationCreateMutation
                        .mutateAsync({
                          user_id: user.id,
                          office_id: user.office_id as number,
                          date: params.date as string,
                          end_time: "00:00:00",
                          seat_number: reservation.seat_number,
                          start_time: "00:00:00",
                        })
                        .then(() => notifyCreatedSuccess())
                        .catch((err) => {
                          notifyCreatedFailure();
                        });

                      await everyonesReservations.refetch();
                    }}
                  >
                    Reserve
                  </Button>
                )}
              </Box>
            </GridItem>
          );
        })}
      </Grid>

      <Box py={4}>
        <h1>office</h1>
        <pre>{JSON.stringify(office.data, null, 2)}</pre>
        <h1>reservations</h1>
        <pre>{JSON.stringify(everyonesReservations.data, null, 2)}</pre>
        <h1>mixedReservations</h1>
        <pre>{JSON.stringify(mixedReservations, null, 2)}</pre>
      </Box>

      <Box my={2}>
        <VStack spacing={4} align="stretch"></VStack>
      </Box>
    </Page>
  );
};
