import { ChevronRightIcon } from "@chakra-ui/icons";
import { Breadcrumb as ChakraBreadcrumb, BreadcrumbItem, BreadcrumbLink, chakra } from "@chakra-ui/react";

export const Breadcrumb = chakra(
  ({ pages, className }: { pages: { title: string; to?: string; active?: boolean }[]; className?: string }) => {
    return (
      <ChakraBreadcrumb className={className} separator={<ChevronRightIcon />}>
        {pages.map(({ title, to, active }) => (
          <BreadcrumbItem key={title} isCurrentPage={active}>
            <BreadcrumbLink href={to}>{title}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </ChakraBreadcrumb>
    );
  }
);
