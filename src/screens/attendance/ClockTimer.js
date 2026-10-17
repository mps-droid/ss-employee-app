import React, { useEffect, useState } from 'react';
import { AppText } from '../../components';
import { formatDuration } from '../../utils/date';

// Time since clock-in, ticking once a second. Kept in its own component so only
// this text re-renders every second, not the whole attendance screen.
export default function ClockTimer({ since }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <AppText
      variant="number"
      accessibilityLabel={`Clocked in for ${formatDuration(
        (now - since) / 1000,
      )}`}
    >
      {formatDuration((now - since) / 1000)}
    </AppText>
  );
}
