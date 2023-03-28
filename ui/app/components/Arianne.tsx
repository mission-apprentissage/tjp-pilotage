import { ChevronRightIcon } from "@chakra-ui/icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
export const Arianne = () => {
  return (
    <Breadcrumb
      color="grey"
      fontSize={14}
      ml="4"
      spacing="8px"
      separator={<ChevronRightIcon />}
    >
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink href="/console/formations">Formations</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};
