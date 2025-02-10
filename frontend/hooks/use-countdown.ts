import { useEffect, useState } from "react";

export function useCountdown(second: number) {
  const [countdown, setCountdown] = useState(second);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    if (!isCounting) {
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isCounting]);

  useEffect(() => {
    if (countdown <= 0) {
      setIsCounting(false);
    }
  }, [countdown]);

  return {
    countdown,
    isCounting,
    start: () => {
      setCountdown(second);
      setIsCounting(true);
    },
    pause: () => {
      setIsCounting(false);
    },
    resume: () => {
      setIsCounting(true);
    },
    end: () => {
      setIsCounting(false);
      setCountdown(0);
    },
    reset: () => {
      setIsCounting(false);
      setCountdown(second);
    },
  };
}
