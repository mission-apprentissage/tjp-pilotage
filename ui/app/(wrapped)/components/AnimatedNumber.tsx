import { Heading, Text, VStack } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  from: number;
  to: number;
  subtitle: string;
  NumberLabel: React.FunctionComponent<{ number: string }>;
  animateOnViewportEnter?: boolean;
  duration?: number;
}

/**
 * Foramt a number from "XXXX" to "X XXX". Like "2024" becomes "2 024".
 * @param number Any number you want to format with a space each 3 digits.
 * @returns Number formatted with a space every 3 digits.
 */
const formatNumber = (number: number) => {
  const numberText = "" + number;
  return numberText
    .split("")
    .reduce((p, c, i) => ((numberText.length - i) % 3 === 0 && i != 0 ? p + " " + c : p + c), "");
};

export const AnimatedNumber = ({
  subtitle,
  from,
  to,
  animateOnViewportEnter,
  duration = 2000,
  NumberLabel,
}: AnimatedNumberProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const animationFrame = useRef<number | null>(null);
  const startedAt = useRef<number>(-1);
  const [number, setNumber] = useState<number>(from);
  const previousAnimationFrame = useRef<number>(-1);

  const animate = (fromNumber: number, toNumber: number) => {
    if (startedAt.current === -1) {
      startedAt.current = Date.now();
    }

    animationFrame.current = requestAnimationFrame(() => {
      const wholeRemainder = toNumber - fromNumber;
      const intervalWithinDuration = wholeRemainder / duration;
      previousAnimationFrame.current = Date.now();
      setNumber(Math.floor((previousAnimationFrame.current - startedAt.current) * intervalWithinDuration));
      animate(fromNumber, toNumber);
    });

    if (animationFrame.current !== -1 && duration < Date.now() - startedAt.current) {
      setNumber(toNumber);
      cancelAnimationFrame(animationFrame.current);
    }
  };

  useEffect(() => {
    if (!animateOnViewportEnter) {
      animate(from, to);
    }
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    if (animateOnViewportEnter && isInView) {
      animate(from, to);
    }
  }, [isInView]);

  return (
    <VStack ref={ref} width="240px" textAlign="center">
      <Heading fontSize="40px">
        <NumberLabel number={formatNumber(number)} />
      </Heading>
      <Text fontSize="14px">{subtitle}</Text>
    </VStack>
  );
};
