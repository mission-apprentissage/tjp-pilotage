import { Box, Card, CardBody, Tooltip } from "@chakra-ui/react";

import { TooltipIcon } from "../../../../components/TooltipIcon";

export const StatCard = ({
  label,
  value,
  isValeurAjoutee = false,
  color = "inherit",
  tooltip,
}: {
  label: string;
  value?: string | number;
  isValeurAjoutee?: boolean;
  color?: string;
  tooltip?: string;
}) => (
  <Card>
    <CardBody
      color={color}
      py="2"
      px="3"
      alignItems={"center"}
      display={"flex"}
      gap={[2, null, 4]}
      flexDir={["column", null, "row"]}
    >
      <Box flex={1}>
        {label}
        {isValeurAjoutee && (
          <TooltipIcon
            ml="3"
            label="Capacité de l’établissement à insérer, en prenant en compte le profil social des élèves et le taux de chômage de la zone d’emploi, comparativement au taux de référence d’établissements similaires."
          />
        )}
      </Box>
      <Tooltip label={tooltip}>
        <Box fontWeight="bold" fontSize="2xl" textAlign="center">
          {value ?? "-"}
        </Box>
      </Tooltip>
    </CardBody>
  </Card>
);
