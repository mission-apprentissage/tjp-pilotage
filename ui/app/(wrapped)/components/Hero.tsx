"use client";

import { Box, useBreakpointValue } from "@chakra-ui/react";
import type { CSSProperties } from "react";

interface HeroProps {
  children: React.ReactNode;
  variant?: "blue" | "white";
}

const blue = "250,251,255";
const white = "255,255,255";

export const Hero = ({ children, variant = "blue" }: HeroProps) => {
  const maskStyle = useBreakpointValue<CSSProperties>({
    base: {
      mask: `url(/pattern.svg)`,
      maskRepeat: "repeat repeat",
      maskSize: "auto 25vh",
      maskPosition: "center center",
    },
    md: {
      mask: `url(/pattern.svg)`,
      maskRepeat: "repeat repeat",
      maskSize: "auto 25vw",
      maskPosition: "center center",
    },
  });

  return (
    <Box width="100%" position="relative" backgroundColor={`rgb(${variant === "blue" ? blue : white})`}>
      <Box
        height="100%"
        width="100%"
        position="absolute"
        top="0"
        left="0"
        backgroundImage={`url(/gradient_accueil.jpg)`}
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="top center"
        zIndex={5}
        transform="scaleY(-1)"
        style={maskStyle}
      ></Box>
      <Box
        height="100%"
        width="100%"
        position="absolute"
        top="0"
        left="0"
        backgroundColor="rgba(0,0,0,0)"
        backgroundImage={`linear-gradient(0deg, rgba(${
          variant === "blue" ? blue : white
        }, .5) 0%, rgba(${variant === "blue" ? blue : white}, .9) 50%, rgba(${
          variant === "blue" ? blue : white
        }, 1) 100%)`}
        zIndex={5}
      ></Box>
      <Box position="relative" zIndex={10}>
        {children}
      </Box>
    </Box>
  );
};
