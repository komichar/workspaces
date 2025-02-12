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

import { parseISO, set } from "date-fns";
import type { Seat } from "../../../../api/src/offices-days-availability.routing";
import DiscreteTimeRangeSlider from "./DiscreteTimeRangeSlider";

type Props = {
  seats: Seat[];
  user: User;
  date: string;
  reservationCreateMutation: ReservationCreateMutation;
  reservationDeleteMutation: ReservationDeleteMutation;
  afterAction: () => Promise<unknown>;
};

export const SeatGrid = ({
  seats,
  date,
  user,
  reservationCreateMutation,
  reservationDeleteMutation,
  afterAction,
}: Props) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleCreateReservation = async (day: string, seat_number: number) => {
    setLoading(true);
    try {
      const date = parseISO(day);
      const startTime = set(date, {
        hours: 9,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
      const endTime = set(date, {
        hours: 17,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
      await reservationCreateMutation.mutateAsync({
        email: user.email,
        input: {
          office_id: user.office_id,
          end_time: endTime.toISOString(),
          seat_number: seat_number,
          start_time: startTime.toISOString(),
        },
      });
      toast({ title: "Reservation successful!", status: "success" });
      await afterAction();
    } catch (e: unknown) {
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
      {seats.map((seat) => {
        const available = !seat.timeslots.find((ts) => ts.reservation);
        const currentUserReservation = seat.timeslots.find(
          (slot) => slot.reservation?.user_id === user.id
        )?.reservation;
        const bookedByCurrentUser = currentUserReservation !== undefined;

        return (
          <GridItem
            key={seat.seat_number}
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
              <Tooltip label={`Seat ${seat.seat_number}`} fontSize="md">
                <Text as="b">Seat {seat.seat_number}</Text>
              </Tooltip>

              {bookedByCurrentUser && (
                <Button
                  colorScheme="red"
                  size="sm"
                  isLoading={loading}
                  onClick={() => handleCancel(currentUserReservation)}
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
                  onClick={() =>
                    handleCreateReservation(date, seat.seat_number)
                  } // TODO: pass the date
                  leftIcon={<CheckIcon />}
                >
                  Reserve
                </Button>
              )}

              {!bookedByCurrentUser && !available && (
                <DiscreteTimeRangeSlider></DiscreteTimeRangeSlider>
              )}
              {!bookedByCurrentUser && !available && (
                <Tooltip
                  label={`Reserved by user: ${
                    seat.timeslots.find((ts) => ts.reservation)?.reservation
                      ?.user_id
                  }`}
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
                    Reserved by user:{" "}
                    {
                      seat.timeslots.find((ts) => ts.reservation)?.reservation
                        ?.user_id
                    }
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
