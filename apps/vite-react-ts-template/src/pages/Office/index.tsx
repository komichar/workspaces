import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

import { ResourceNotFoundException, t } from "utils";

import { Page } from "shared/Layout";
import { InternalErrorResult } from "shared/Result";
import { useNavigate, useParams, useRouteError } from "shared/Router";

import { useOfficeQuery } from "modules/offices/infrastructure/officeQuery";
import {
  OfficeDetails,
  OfficeNotFoundResult,
} from "modules/offices/presentation";

const OfficePage = () => {
  const params = useParams<{ officeId: string }>();
  const navigate = useNavigate();
  const { data } = useOfficeQuery(params.officeId as string);

  return (
    <Page spacing={6}>
      <Button
        leftIcon={<ArrowBackIcon />}
        variant="link"
        onClick={() => navigate("/offices")}
      >
        {t("Back to offices' list")}
      </Button>
      <OfficeDetails office={data} onBack={() => navigate("/offices")} />
    </Page>
  );
};

export const Component = OfficePage;

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (error instanceof ResourceNotFoundException) {
    return <OfficeNotFoundResult />;
  }

  return <InternalErrorResult />;
};
