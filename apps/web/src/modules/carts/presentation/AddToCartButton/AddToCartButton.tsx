import { Button, ButtonProps } from "@chakra-ui/react";

import { t } from "utils";

import { useAuthStore } from "modules/auth/application";

import { useProductAddedDialogStore } from "./ProductAddedDialog";
import { useAddToCartNotifications } from "./useAddToCartNotifications";

interface IProps {
  productId: number;
  colorScheme?: ButtonProps["colorScheme"];
}

const AddToCartButton = ({ productId, colorScheme = "gray" }: IProps) => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  const { notifyFailure, notifySuccess, notifyNotAuthenticated } =
    useAddToCartNotifications();
  const onOpen = useProductAddedDialogStore((store) => store.onOpen);

  return (
    <Button
      w="100%"
      colorScheme={colorScheme}
      isLoading={false}
      onClick={async () => {
        if (!isAuthenticated) {
          return notifyNotAuthenticated();
        }

        try {
          notifySuccess();
          onOpen(1);
        } catch {
          notifyFailure();
        }
      }}
    >
      {t("Add to cart")}
    </Button>
  );
};

export { AddToCartButton };
