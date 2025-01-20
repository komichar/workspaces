import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

import { moneyVO } from "utils";

import { useNavigate } from "shared/Router";

import { AddToCartButton } from "modules/carts/presentation";

import { Office } from "../../../../../api/office";

const OfficeCard = ({ city, capacity, is_peak_limited, id }: Office) => {
  const navigate = useNavigate();
  const categoryColor = useSecondaryTextColor();

  return (
    <VStack spacing={3} overflow="hidden" rounded="lg">
      <Box
        onClick={() => navigate(`/products/${id}`)}
        cursor="pointer"
        h={64}
        w="lg"
        bgSize="cover"
        bgPos="center"
      />
      <VStack w="100%" spacing={0} align="flex-start">
        <HStack
          w="100%"
          justify="space-between"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="semibold"
          spacing={6}
        >
          <Text
            isTruncated
            onClick={() => navigate(`/products/${id}`)}
            cursor="pointer"
          >
            {city}
          </Text>
          <Text>
            ID: {id}, capacity: {capacity}
          </Text>
        </HStack>
        <Text
          fontStyle="italic"
          fontSize={{ base: "sm", md: "md" }}
          color={categoryColor}
        >
          {is_peak_limited ? "Peak limited" : "Not peak limited"}
        </Text>
      </VStack>
      <AddToCartButton productId={id} />
    </VStack>
  );
};

export { OfficeCard };
