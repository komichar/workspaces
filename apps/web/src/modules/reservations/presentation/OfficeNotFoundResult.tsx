import { Button, ButtonGroup } from "@chakra-ui/react";

import { t } from "utils";

import { ContactUsButton, Result, WarningIcon } from "shared/Result";
import { useNavigate } from "shared/Router";

const OfficeNotFoundResult = () => {
  const navigate = useNavigate();

  return (
    <Result
      image={<WarningIcon />}
      heading={t("Office doesn't exist")}
      subheading={t("Probably this office longer active.")}
    >
      <ButtonGroup>
        <ContactUsButton />
        <Button onClick={() => navigate("/offices")}>
          {t("Back to offices list")}
        </Button>
      </ButtonGroup>
    </Result>
  );
};

export { OfficeNotFoundResult };
