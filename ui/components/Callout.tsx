import type { FlexProps } from "@chakra-ui/react";
import { Flex, forwardRef, Text } from "@chakra-ui/react";

type CalloutProps = FlexProps & {
  body: React.ReactNode;
  title?: string | React.ReactNode;
  actionButton?: React.ReactNode;
};

export const Callout = forwardRef<CalloutProps, "div">(
  (
    {
      title,
      body,
      actionButton,
      ...rest
    }: {
      title?: string | React.ReactNode;
      body: string | React.ReactNode;
      actionButton?: React.ReactNode;
    },
    ref
  ) => (
    <Flex
      bgColor={"grey.975"}
      h={"100%"}
      borderLeftColor={"bluefrance.525"}
      borderLeftWidth={"4px"}
      direction={"column"}
      padding={"16px"}
      gap={2}
      ref={ref}
      {...rest}
    >
      {title && (
        <Text fontSize={14} fontWeight={700}>
          {title}
        </Text>
      )}
      <Flex flex="inline" fontSize={14} fontWeight={400} lineHeight={"24px"} flexDirection={"column"}>
        {body}
      </Flex>
      {actionButton}
    </Flex>
  )
);
