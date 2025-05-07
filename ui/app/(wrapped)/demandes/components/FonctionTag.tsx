import { chakra, Tag } from "@chakra-ui/react";

export const FonctionTag = chakra(({ className, fonction }: { className?: string; fonction?: string }) => {
  if (!fonction) return null;
  return (
    <Tag
      className={className}
      size={"md"}
      variant={"solid"}
      bgColor={"info.950"}
      color={"info.text"}
      gap={1}
      fontSize={12}
      fontWeight={700}
      textTransform={"uppercase"}
    >
      {fonction.toUpperCase()}
    </Tag>
  );
});
