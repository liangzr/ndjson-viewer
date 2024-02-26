import { useState } from "react";
import TimeRange from "react-timeline-range-slider";
import styled from "styled-components";

function Timeline({
  timeRange,
  range,
  onRangeChange,
}: {
  timeRange: [number, number];
  range: [number, number];
  onRangeChange: (range: [number, number]) => void;
}) {
  const [error, setError] = useState(false);

  const errorHandler = ({ error }: { error: any }) => setError(error);

  if (timeRange[0] === 0 && timeRange[1] === 0) {
    return null;
  }

  console.log("timeRange", timeRange);
  console.log("range", range);

  return (
    <Container>
      <TimeRange
        error={error}
        step={1}
        mode={1}
        timelineInterval={timeRange}
        selectedInterval={range}
        onChangeCallback={onRangeChange}
        onUpdateCallback={errorHandler}
      />
    </Container>
  );
}

export default Timeline;

const Container = styled.div`
  .react_time_range__time_range_container {
    padding-left: 0;
    padding-right: 0;
    width: 100%;

    .react_time_range__rail__inner {
      background-color: #252525;
    }
  }
`;
