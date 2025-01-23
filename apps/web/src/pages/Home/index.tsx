import { Page } from "shared/Layout";
import { InternalErrorResult } from "shared/Result";
import { useRouteError } from "shared/Router";

import { HeroSection } from "modules/marketing/presentation";

interface IProps {
  fallbackProductsNumber?: number;
}

const HomePage = ({ fallbackProductsNumber }: IProps) => {
  return (
    <Page maxW="container.xl" spacing={{ base: 8, lg: 20 }}>
      <HeroSection productNumber={fallbackProductsNumber ?? 0} />
    </Page>
  );
};

export const Component = HomePage;

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (error.status === 404) {
    return <HomePage fallbackProductsNumber={20} />;
  }

  return <InternalErrorResult />;
};
