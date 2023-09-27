import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";

export const UaiForm = ({
  defaultUai,
  onUaiChanged,
}: {
  defaultUai?: string;
  onUaiChanged: (value: string) => void;
}) => {
  const [uai, setUai] = useState(defaultUai ?? "");
  return (
    <FormControl
      margin="auto"
      maxW="300px"
      onSubmit={(e) => {
        e.preventDefault();
        onUaiChanged(uai);
      }}
    >
      <FormLabel>Saisissez un code UAI pour commencer</FormLabel>
      <Flex>
        <Input
          flex={1}
          mr="2"
          placeholder="Code UAI"
          onInput={(e) => setUai((e.target as HTMLInputElement).value)}
          variant="input"
          value={uai}
        />
        <Button type="submit" variant="primary">
          Valider
        </Button>
      </Flex>
    </FormControl>
  );
};
