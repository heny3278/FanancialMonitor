import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function playNotificationSound(audioContext: AudioContext) {
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, now);
  oscillator.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.3);
}

export function NotificationBell({ trigger }: { trigger?: string | null }) {
  const [active, setActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const enableAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    return audioContextRef.current.resume().then(() => audioContextRef.current!);
  };

  useEffect(() => {
    const prepareAudio = () => void enableAudio();
    window.addEventListener("pointerdown", prepareAudio, { once: true });
    window.addEventListener("keydown", prepareAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", prepareAudio);
      window.removeEventListener("keydown", prepareAudio);
    };
  }, []);

  useEffect(() => {
    if (!trigger) return;

    setActive(true);
    if (audioContextRef.current?.state === "running") playNotificationSound(audioContextRef.current);

    const timeout = window.setTimeout(() => setActive(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [trigger]);

  return (
    <motion.button
      type="button"
      key={trigger ?? "notification-bell"}
      className={`notification-bell${active ? " is-active" : ""}`}
      aria-label={active ? "New transaction received" : "Transaction notifications"}
      title={active ? "New transaction received" : "Transaction notifications"}
      onClick={() => {
        void enableAudio().then(playNotificationSound).catch(() => undefined);
      }}
      animate={active ? { rotate: [0, -14, 14, -10, 10, 0] } : { rotate: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </svg>
      <span className="notification-dot" aria-hidden="true" />
    </motion.button>
  );
}
