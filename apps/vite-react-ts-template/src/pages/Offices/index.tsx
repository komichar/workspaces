import { useState } from "react";

import { SettingsIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

import { IQueryParams } from "types";

import { t } from "utils";

import { Page, PageHeader } from "shared/Layout";
import { ErrorPageStrategy } from "shared/Result";
import { useNotImplementedYetToast } from "shared/Toast";
import { useOfficesQuery } from "modules/offices/infrastructure/officesQuery";
import { OfficesList } from "modules/offices/presentation";

const defaultParams: IQueryParams = { limit: 10, sort: "asc" };

const OfficessPage = () => {
  const notImplemented = useNotImplementedYetToast();

  const [params, setParams] = useState<IQueryParams>(defaultParams);
  const { data, isFetching } = useOfficesQuery();

  // const noMoreProducts = data.meta.total <= params.limit;

  return (
    <Page>
      <PageHeader
        title={t("Offices list")}
        description={t(
          "Rivian is a global company with offices in many countries."
        )}
      >
        <Button leftIcon={<SettingsIcon />} onClick={notImplemented}>
          {t("More filters")}
        </Button>
      </PageHeader>
      <OfficesList offices={data.offices} />
    </Page>
  );
};

export const Component = OfficessPage;

export const ErrorBoundary = ErrorPageStrategy;
