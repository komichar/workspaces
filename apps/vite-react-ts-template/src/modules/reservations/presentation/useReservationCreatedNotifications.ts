import { t } from "utils";

import { useToast } from "shared/Toast";

export const useReservationCreatedNotifications = () => {
  const toast = useToast();

  const success = () =>
    toast({
      status: "success",
      title: "Reservation created",
      description: "Your reservation has been created successfully.",
    });

  const failure = () =>
    toast({
      status: "error",
      title: "Reservation not created",
      description: t(
        "User can place only one reservation per day. Release the seat and try again."
      ),
    });

  return [success, failure] as const;
};
