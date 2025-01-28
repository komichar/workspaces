import {
  Grid,
  GridItem,
  Box,
  Text,
  Button,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { CheckIcon, CloseIcon, LockIcon } from "@chakra-ui/icons";
import { MixedReservation } from "./ReservationSeatsOverview";
import type { User } from "../../../../api/src/user";
import {
  ReservationCreateMutation,
  ReservationDeleteMutation,
} from "modules/reservations/infrastructure/reservationQuery";

type Props = {
  mixedReservations: MixedReservation[];
  user: User;
  reservationCreateMutation: ReservationCreateMutation;
  reservationDeleteMutation: ReservationDeleteMutation;
  afterAction: () => Promise<unknown>;
};

export const SeatGrid = ({
  mixedReservations,
  user,
  reservationCreateMutation,
  reservationDeleteMutation,
  afterAction,
}: Props) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleReservation = async (reservation: MixedReservation) => {
    setLoading(true);
    try {
      await reservationCreateMutation.mutateAsync({
        email: user.email,
        input: {
          office_id: user.office_id,
          date: reservation.date,
          end_time: "00:00:00",
          seat_number: reservation.seat_number,
          start_time: "00:00:00",
        },
      });
      toast({ title: "Reservation successful!", status: "success" });
      await afterAction();
    } catch {
      toast({ title: "Failed to reserve seat.", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservation: MixedReservation) => {
    setLoading(true);
    try {
      await reservationDeleteMutation.mutateAsync(reservation.id);
      toast({ title: "Reservation canceled.", status: "info" });
      await afterAction();
    } catch {
      toast({ title: "Failed to cancel reservation.", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      {mixedReservations.map((reservation) => {
        const key = `${reservation.office_id}-${reservation.date}-${reservation.seat_number}`;
        const available = !reservation.user_id;
        const bookedByCurrentUser = user.id === reservation.user_id;

        return (
          <GridItem
            key={key}
            borderRadius={8}
            p={4}
            bg={
              bookedByCurrentUser
                ? "blue.100"
                : available
                ? "gray.100"
                : "red.100"
            }
            _hover={{
              bg: bookedByCurrentUser
                ? "blue.200"
                : available
                ? "gray.200"
                : "red.200",
              cursor: available || bookedByCurrentUser ? "pointer" : "default",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Tooltip label={`Seat ${reservation.seat_number}`} fontSize="md">
                <Text as="b">Seat {reservation.seat_number}</Text>
              </Tooltip>

              {bookedByCurrentUser && (
                <Button
                  colorScheme="red"
                  size="sm"
                  isLoading={loading}
                  onClick={() => handleCancel(reservation)}
                  leftIcon={<CloseIcon />}
                >
                  Cancel
                </Button>
              )}

              {available && (
                <Button
                  colorScheme="teal"
                  size="sm"
                  isLoading={loading}
                  onClick={() => handleReservation(reservation)}
                  leftIcon={<CheckIcon />}
                >
                  Reserve
                </Button>
              )}

              {!bookedByCurrentUser && !available && (
                <Tooltip
                  label={`Reserved by user: ${reservation.user_id}`}
                  fontSize="md"
                >
                  <Button
                    disabled
                    colorScheme="teal"
                    variant="ghost"
                    leftIcon={<LockIcon />}
                    _hover={{ bg: "transparent" }}
                    _disabled={{
                      opacity: 1,
                      color: "gray.500",
                      cursor: "not-allowed",
                    }}
                  >
                    Reserved by user: {reservation.user_id}
                  </Button>
                </Tooltip>
              )}
            </Box>
          </GridItem>
        );
      })}
    </Grid>
  );
};
