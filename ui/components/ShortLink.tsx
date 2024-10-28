import type { LinkProps } from "@chakra-ui/react";
import { forwardRef, Link } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

export type ShortLinkProps = LinkProps & {
  label: string;
  iconLeft?: string;
  iconRight?: string;
};

export const ShortLink = forwardRef<ShortLinkProps, "a">(
  ({ label, href, iconLeft, iconRight, target, ...rest }, ref) => (
    <Link
      variant={"link"}
      mx={"12px"}
      color={"bluefrance.113"}
      href={href}
      target={target}
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      ref={ref}
      {...rest}
    >
      {iconLeft && <Icon icon={iconLeft} height={"16px"} width={"16px"} style={{ marginRight: "8px" }} />}
      {label}
      {iconRight && <Icon icon={iconRight} height={"16px"} width={"16px"} style={{ marginLeft: "8px" }} />}
    </Link>
  )
);
