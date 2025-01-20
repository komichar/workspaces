import { SimpleGrid, GridItem } from "@chakra-ui/react";

import { EmptyStateResult } from "shared/Result";

import { ProductAddedDialog } from "modules/carts/presentation";

import { IProduct } from "../types";
import { ProductCard } from "./ProductCard";
import { OfficeCard } from "./OfficeCard";
import { Office } from "../../../../../api/office";

interface IProps {
  offices: Office[];
}

const OfficesList = ({ offices }: IProps) => {
  if (offices.length === 0) {
    return <EmptyStateResult />;
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacingY={16} spacingX={10}>
      <ProductAddedDialog />
      {offices.map((office) => (
        <GridItem key={office.id} colSpan={1}>
          <OfficeCard
            key={office.id}
            id={office.id}
            city={office.city}
            capacity={office.capacity}
            is_peak_limited={office.is_peak_limited}
          />
        </GridItem>
      ))}
    </SimpleGrid>
  );
};

export { OfficesList };
