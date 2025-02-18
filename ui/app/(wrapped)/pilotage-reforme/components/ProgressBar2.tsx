import { Box, Text, Tooltip } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { formatPercentageFixedDigits } from "@/utils/formatUtils";

const calculateTransform = (
  labelElement: HTMLElement,
  containerElement: HTMLElement,
  leftPosition: number
): string => {
  const labelRect = labelElement.getBoundingClientRect();
  const containerRect = containerElement.getBoundingClientRect();
  const labelWidth = labelRect.width;
  const containerWidth = containerRect.width;

  // Position absolue du label par rapport au conteneur
  const absolutePosition = (leftPosition / 100) * containerWidth;

  // Si le label dépasse à droite
  if (absolutePosition + labelWidth > containerWidth) {
    // Calculer le décalage nécessaire pour que le label reste dans le conteneur
    const overflow = absolutePosition + labelWidth - containerWidth;
    const translatePercentage = (overflow / labelWidth) * 100;
    return `translateX(-${Math.min(translatePercentage, 100)}%)`;
  }

  // Si le label dépasse à gauche
  if(labelRect.left - containerRect.left < 0) {
    return `translateX(calc(-100% + 10px + ${Math.abs(labelRect.left - containerRect.left)}px))`;
  }

  // Comportement par défaut
  return 'translateX(-100%)';
};


export const ProgressBar2 = (
  { bars, max = 100 } :
  { bars: {value: number, color: string, label: string,  order: number, tooltip?: string}[],
    max: number,
  }) => {
  console.log({bars});

  const [visibleLabels, setVisibleLabels] = useState<{ [key: string]: boolean }>({});
  const [overflowingLabels, setOverflowingLabels] = useState<{ [key: string]: boolean }>({});
  const labelRefs = useRef<{ [key: string]: HTMLElement }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const visibleLabels: { [key: string]: boolean } = {};
    const overflowingLabels: { [key: string]: boolean } = {};
    const labels = Object.keys(labelRefs.current);

    console.log({labels});

    labels.forEach((label, i) => {
      let isVisible = true;
      const el1 = labelRefs.current[label];

      if(labels.length > 1) {
        labels.forEach((otherLabel, j) => {
          if (i !== j) {
            const el2 = labelRefs.current[otherLabel];
            const overlap = elementsOverlap(el1, el2);
            const sameLabelOrder = bars.find(b => b.label === otherLabel)?.order ?? 0;
            const otherLabelOrder = bars.find(b => b.label === label)?.order ?? 0;
            if (overlap && sameLabelOrder > otherLabelOrder) {
              isVisible = false;
            }
          }
        });
      }
      visibleLabels[label] = isVisible;

      if (containerRef.current) {
        overflowingLabels[label] = isOverflowing(el1, containerRef.current);
      }
    });

    setVisibleLabels(visibleLabels);
    setOverflowingLabels(overflowingLabels);
  }, [bars]);

  const elementsOverlap = (el1: HTMLElement, el2: HTMLElement) => {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  };

  const isOverflowing = (child: HTMLElement, parent: HTMLElement) => {
    const childRect = child.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    return (
      childRect.left < parentRect.left ||
      childRect.right > parentRect.right ||
      childRect.top < parentRect.top ||
      childRect.bottom > parentRect.bottom
    );
  };

  return (
    <Box width="100%" position="relative" overflow="hidden" ref={containerRef}>
      <Box position="relative" width="100%" height="70px">
        {bars.map((bar, index) => {
          const leftPosition = (bar.value / max) * 100;

          return (
            <Box
              id={`label-for-${bar.label}`}
              backgroundColor={"white"}
              key={index}
              top="0"
              position="absolute"
              left={`${Math.min(Math.max(leftPosition, 0), 100)}%`}
              transform={
                labelRefs.current[bar.label] && containerRef.current
                  ? calculateTransform(labelRefs.current[bar.label], containerRef.current, leftPosition)
                  : "translateX(-100%)"
              }
              zIndex={bar.order}
              ref={(el) => { if (el) labelRefs.current[bar.label] = el; }}
              maxWidth="100%"
              whiteSpace="nowrap"
            >
              <Tooltip label={bar.tooltip}>
                <Text fontSize="32px" align={"right"}>
                  <strong>{formatPercentageFixedDigits(bar.value, 1, '-')}</strong>
                </Text>
              </Tooltip>
              <Text align="right" color="#161616" fontWeight={"bold"}>
                {bar.label}
              </Text>
            </Box>
          );
        })}
      </Box>
      <Box position="relative" width="100%" height="17px">
        {bars.map((bar) => (
          <Box key={bar.label} position="absolute" top="0"  left={`${((bar.value * 100 / max) - 1)}%`} width={`2px`} height="15px" borderRadius="full" backgroundColor="#161616" />
        ))}
      </Box>
      <Box width="100%" position="relative" height="20px" bg="gray.100" borderRadius="full">
        {bars.map((bar) => (
          <Box
            key={bar.label}
            position="absolute"
            top="0"
            left="0"
            height={"21px"}
            width={`${(bar.value * 100 / max)}%`}
            bg={bar.color}
            borderRadius="8px"
            cursor={"pointer"}
          />
        ))}
      </Box>
    </Box>
  );
};
