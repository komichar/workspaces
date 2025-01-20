import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  chakra,
  Divider,
  GridItem,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

import { t } from "utils";

import { PageHeader } from "shared/Layout";

import { AddToCartButton } from "modules/carts/presentation";

import { Office } from "../../../../../api/office";

interface IProps {
  office: Office;
  onBack: () => void;
}

const OfficeDetails = ({ office, onBack }: IProps) => {
  const secondaryColor = useSecondaryTextColor();

  return (
    <SimpleGrid
      w="100%"
      maxW="1000px"
      columns={{ base: 1, lg: 2 }}
      gap={{ base: 6, md: 8 }}
    >
      <GridItem colSpan={1}>
        <Box overflow="hidden" rounded="xl">
          <Box
            h={{ base: 64, md: "lg" }}
            w="100%"
            bgSize="cover"
            bgPos="center"
          />
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        <VStack spacing={{ base: 1, lg: 3 }} w="100%" align="start">
          <PageHeader
            title={office.city}
            description={t("A part of out {category} collection.", {
              category: (
                <chakra.span fontStyle="italic">{office.id}</chakra.span>
              ),
            })}
          />
          <HStack w="100%" height="24px" spacing={4}>
            <Text fontWeight="semibold" fontSize={{ base: "lg", md: "xl" }}>
              {office.is_peak_limited ? "Peak limited" : "Not peak limited"}
            </Text>
            <Divider orientation="vertical" />
            <Button variant="link" colorScheme="orange">
              test
            </Button>
          </HStack>
          <Text
            color={secondaryColor}
            fontSize={{ base: "md", md: "lg" }}
            py={{ base: 4, md: 6 }}
          >
            ID: {office.id}
          </Text>
          <VStack w="100%">
            <AddToCartButton productId={office.id} colorScheme="orange" />
            <Button w="100%" variant="outline" onClick={onBack}>
              {t("Back to offices list")}
            </Button>
          </VStack>
          <Accordion w="100%" pt={4} defaultIndex={[0]}>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {t("Features")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {t("Care")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {t("Shipping")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {t("Returns")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
      </GridItem>
    </SimpleGrid>
  );
};

export { OfficeDetails };
