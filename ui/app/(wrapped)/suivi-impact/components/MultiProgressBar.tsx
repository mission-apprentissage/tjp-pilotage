import { Box, Text, Tooltip } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { formatPercentageFixedDigits } from "@/utils/formatUtils";

type Bar = {
  value: number;
  color: string;
  label: string;
  order: number;
  tooltip?: string;
};

function elementsOverlap(el1: HTMLElement, el2: HTMLElement): boolean {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function calculateTransform(
  labelElement: HTMLElement,
  containerElement: HTMLElement,
  leftPosition: number
): string {
  const labelRect = labelElement.getBoundingClientRect();
  const containerRect = containerElement.getBoundingClientRect();
  const labelWidth = labelRect.width;
  const containerWidth = containerRect.width;

  const absolutePosition = (leftPosition / 100) * containerWidth;

  if (absolutePosition + labelWidth > containerWidth) {
    const overflow = absolutePosition + labelWidth - containerWidth;
    const translatePercentage = (overflow / labelWidth) * 100;
    return `translateX(-${Math.min(translatePercentage, 100)}%)`;
  }

  if (labelRect.left - containerRect.left < 0) {
    const overflowPixels = containerRect.left - labelRect.left;
    const overflowRatio = Math.min(overflowPixels / labelWidth, 1);
    const translatePercentage = -100 * (1 - overflowRatio);
    return `translateX(${translatePercentage}%)`;
  }

  return "translateX(-100%)";
}

export const MultiProgressBar = ({
  bars,
  max = 100
}: {
  bars: Bar[];
  max: number;
}) => {
  const [visibleLabels, setVisibleLabels] = useState<Set<string>>(new Set());
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [temporarilyHiddenLabels, setTemporarilyHiddenLabels] = useState<Set<string>>(new Set());

  const labelRefs = useRef<{ [key: string]: HTMLElement }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcule les labels qui doivent être visibles par défaut
  useEffect(() => {
    if (!containerRef.current) return;

    const visibleSet = new Set<string>();
    const sortedBars = [...bars].sort((a, b) => a.order - b.order);

    // Initialiser tous les labels comme visibles
    sortedBars.forEach(bar => visibleSet.add(bar.label));

    // Vérifier les chevauchements
    for (let i = 0; i < sortedBars.length; i++) {
      const currentLabel = sortedBars[i].label;
      const currentElement = labelRefs.current[currentLabel];

      if (!currentElement || !visibleSet.has(currentLabel)) continue;

      for (let j = i + 1; j < sortedBars.length; j++) {
        const nextLabel = sortedBars[j].label;
        const nextElement = labelRefs.current[nextLabel];

        if (!nextElement || !visibleSet.has(nextLabel)) continue;

        if (elementsOverlap(currentElement, nextElement)) {
          // Le label avec l'ordre le plus bas devient invisible
          visibleSet.delete(currentLabel);
          break;
        }
      }
    }

    setVisibleLabels(visibleSet);
  }, [bars]);

  // Gère le masquage temporaire des labels qui se chevauchent avec le label survolé
  useEffect(() => {
    if (!hoveredBar || !containerRef.current) {
      setTemporarilyHiddenLabels(new Set());
      return;
    }

    const hoveredElement = labelRefs.current[hoveredBar];
    if (!hoveredElement) return;

    const hiddenSet = new Set<string>();

    // Vérifie les chevauchements avec le label survolé
    bars.forEach(bar => {
      if (bar.label === hoveredBar) return;

      const element = labelRefs.current[bar.label];
      if (!element) return;

      if (elementsOverlap(hoveredElement, element)) {
        hiddenSet.add(bar.label);
      }
    });

    setTemporarilyHiddenLabels(hiddenSet);
  }, [hoveredBar, bars]);

  const isLabelVisible = (label: string) => {
    if (hoveredBar === label) return true;
    if (temporarilyHiddenLabels.has(label)) return false;
    return visibleLabels.has(label);
  };

  return (
    <Box width="100%" position="relative" overflow="hidden" ref={containerRef}>
      {/* Zone des labels */}
      <Box position="relative" width="100%" height="70px">
        {bars.map((bar) => {
          const leftPosition = (bar.value / max) * 100;
          return (
            <Box
              key={bar.label}
              position="absolute"
              left={`${Math.min(Math.max(leftPosition, 0), 100)}%`}
              transform={
                labelRefs.current[bar.label] && containerRef.current
                  ? calculateTransform(
                    labelRefs.current[bar.label],
                    containerRef.current,
                    leftPosition
                  )
                  : "translateX(-100%)"
              }
              opacity={isLabelVisible(bar.label) ? 1 : 0}
              transition="opacity 0.2s"
              ref={(el) => {
                if (el) labelRefs.current[bar.label] = el;
              }}
              maxWidth="100%"
              whiteSpace="nowrap"
              zIndex={bar.order}
            >
              <Tooltip label={bar.tooltip}>
                <Text fontSize="32px" align="right">
                  <strong>
                    {formatPercentageFixedDigits(bar.value, 1, "-")}
                  </strong>
                </Text>
              </Tooltip>
              <Text align="right" color="#161616" fontWeight="bold">
                {bar.label}
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Repères de position */}
      <Box position="relative" width="100%" height="17px">
        {bars.map((bar) => (
          <Box
            key={`tick-${bar.label}`}
            position="absolute"
            top="0"
            left={`${Math.max((bar.value * 100) / max - 1, 0.3)}%`}
            width="2px"
            height="15px"
            borderRadius="full"
            backgroundColor="#161616"
            opacity={isLabelVisible(bar.label) ? 1 : 0}
          />
        ))}
      </Box>

      {/* Barres de progression */}
      <Box
        width="100%"
        position="relative"
        height="20px"
        bg="gray.100"
        borderRadius="full"
      >
        {bars.map((bar) => (
          <Box
            key={`progress-${bar.label}`}
            position="absolute"
            top="0"
            left="0"
            height="21px"
            width={`${Math.max((bar.value * 100) / max, 1)}%`}
            bg={bar.color}
            borderRadius="full"
            cursor="pointer"
            onMouseEnter={() => setHoveredBar(bar.label)}
            onMouseLeave={() => setHoveredBar(null)}
          />
        ))}
      </Box>
    </Box>
  );
};
