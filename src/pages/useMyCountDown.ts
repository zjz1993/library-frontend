import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Options } from 'ahooks/lib/useCountDown/index';

const useMyCountDown = (options: Options = {}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { targetDate = undefined } = options;
  const calcTimeLeft = useCallback(() => {
    if (!targetDate) {
      return 0;
    }
    const nowDate = Date.now();
    const validDate = dayjs(targetDate).valueOf();
    return validDate - nowDate;
  }, [targetDate]);

  const parseMs = (milliseconds: number) => {
    return {
      days: Math.floor(milliseconds / 86400000),
      hours: Math.floor(milliseconds / 3600000) % 24,
      minutes: Math.floor(milliseconds / 60000) % 60,
      seconds: Math.floor(milliseconds / 1000) % 60,
      milliseconds: Math.floor(milliseconds) % 1000
    };
  };
  const formattedRes = useMemo(() => parseMs(timeLeft), []);
  useEffect(() => {
    const result = calcTimeLeft();
    setTimeLeft(result);
  }, [calcTimeLeft, targetDate]);
  return [timeLeft, formattedRes] as const;
};
export default useMyCountDown;
