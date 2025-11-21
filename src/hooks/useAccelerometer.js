import { useEffect, useState, useRef } from "react";
import { Accelerometer } from "expo-sensors";

export default function useAccelerometer(updateInterval = 16) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const lowpass = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    Accelerometer.setUpdateInterval(updateInterval);

    const subscription = Accelerometer.addListener((raw) => {
      // simple low-pass filter for smoother control
      const alpha = 0.15;
      lowpass.current.x = lowpass.current.x * (1 - alpha) + raw.x * alpha;
      lowpass.current.y = lowpass.current.y * (1 - alpha) + raw.y * alpha;
      lowpass.current.z = lowpass.current.z * (1 - alpha) + raw.z * alpha;

      setData({
        x: lowpass.current.x,
        y: lowpass.current.y,
        z: lowpass.current.z,
      });
    });

    return () => subscription && subscription.remove();
  }, [updateInterval]);

  return data;
}
