import { Box, Flex, Heading, HStack, Spinner } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { _post } from "../../common/httpClient";
import decodeJWT from "../../common/utils/decodeJWT";
import { decodeJwt } from "jose";
import useAuth from "../../hooks/useAuth";
import useToken from "../../hooks/useToken";
import { getAuthServerSideProps } from "../../common/SSR/getAuthServerSideProps";

export const getServerSideProps = async (context) => ({ props: { ...(await getAuthServerSideProps(context)) } });

const Confirmed = () => {
  const router = useRouter();
  const [, setAuth] = useAuth();
  const [, setToken] = useToken();
  const { activationToken } = router.query;
  const email = decodeJWT(activationToken).sub;
  const [error, setError] = useState(false);
  useEffect(() => {
    const run = async () => {
      if (activationToken) {
        try {
          const result = await _post("/api/v1/auth/activation", { activationToken });
          if (result.succeeded) {
            const user = decodeJwt(result.token);
            setAuth(user);
            setToken(result.token);
            window.location.href = "/";
          }
        } catch (e) {
          console.error(e);
          setError(true);
        }
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activationToken]);

  const title = `Confirmation du compte pour l'utilisateur ${email}`;

  return (
    <Flex minH="50vh" justifyContent="start" mt="10" flexDirection="column">
      {!error && (
        <HStack>
          <Spinner mr={3} />
          <Heading fontSize="1rem" fontFamily="Marianne" fontWeight="500" marginBottom="2w">
            {title}
          </Heading>
        </HStack>
      )}
      {error && (
        <HStack>
          <CloseIcon aria-hidden={true} color="error" cursor="pointer" />
          <Heading fontSize="1rem" fontFamily="Marianne" fontWeight="500" marginBottom="2w" color="error">
            Le lien est expiré ou invalide, merci de prendre contact avec un administrateur en précisant votre adresse
            mail :
          </Heading>
          <Box>
            {/* TODO */}
            <a href="mailto:cerfa@apprentissage.beta.gouv.fr">support-contrat@apprentissage.beta.gouv.fr</a>
          </Box>
        </HStack>
      )}
    </Flex>
  );
};

export default Confirmed;
