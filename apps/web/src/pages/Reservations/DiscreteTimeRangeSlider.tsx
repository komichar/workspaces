import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Range, getTrackBackground } from "react-range";

const DiscreteTimeRangeSlider = () => {
  const [values, setValues] = useState([9, 17]); // Initial values in 24-hour format
  const min = 9; // 0 hours
  const max = 17; // 24 hours
  const step = 1; // Increment in hours

  return (
    <Box width="400px" mx="auto" py={6}>
      <Text fontSize="lg" mb={4}>
        Selected Time Range: {`${values[0]}:00`} - {`${values[1]}:00`}
      </Text>

      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={(newValues) => setValues(newValues)}
        renderTrack={({ props, children }) => (
          <Box
            {...props}
            height="8px"
            borderRadius="4px"
            bg={getTrackBackground({
              values,
              colors: ["#ccc", "#3182CE", "#ccc"],
              min,
              max,
            })}
            width="100%"
          >
            {children}
          </Box>
        )}
        renderThumb={({ props, index }) => (
          <Box
            {...props}
            height="20px"
            width="20px"
            bg="blue.500"
            borderRadius="50%"
            boxShadow="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xs" color="white">
              {values[index]}
            </Text>
          </Box>
        )}
      />
    </Box>
  );
};

export default DiscreteTimeRangeSlider;
