"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Animation timing constants
const SPIN_DURATION = 1.25; // Duration of wheel spin (360°)
const SCALE_UP_DURATION = 0.5; // Duration to scale up
const WAIT_AT_FULL_SCALE = 1; // Wait time at full size
const SCALE_DOWN_DURATION = 0.2; // Duration to scale down
const WAIT_BEFORE_NEXT_SPIN = 0; // No wait after scale down, spin immediately

// Total delay between spins = scale animation + wait
// scale_up(0.5) + wait(1) + scale_down(0.3) + wait(0) = 1.8s
const REPEAT_DELAY =
  SCALE_UP_DURATION +
  WAIT_AT_FULL_SCALE +
  SCALE_DOWN_DURATION +
  WAIT_BEFORE_NEXT_SPIN;

// Total cycle time (spin + delay)
const TOTAL_CYCLE = SPIN_DURATION + REPEAT_DELAY;

// Timeline within TOTAL_CYCLE (3.05s):
// 0s - 1.25s: Spin wheel is spinning (background/confetti hidden, scale=0)
// 1.25s - 1.75s: Scale up (0.5s) - background/confetti appear
// 1.75s - 2.75s: Stay at full size (1s)
// 2.75s - 3.05s: Scale down (0.3s) - background/confetti disappear
// 3.05s: Next spin starts immediately

export function SpinWheelAnimation() {
  // Calculate keyframe times as percentages of total cycle
  const t1 = SPIN_DURATION / TOTAL_CYCLE; // End of spin, start scale up
  const t2 = (SPIN_DURATION + SCALE_UP_DURATION) / TOTAL_CYCLE; // End scale up, at full size
  const t3 =
    (SPIN_DURATION + SCALE_UP_DURATION + WAIT_AT_FULL_SCALE) / TOTAL_CYCLE; // End wait, start scale down
  const t4 =
    (SPIN_DURATION +
      SCALE_UP_DURATION +
      WAIT_AT_FULL_SCALE +
      SCALE_DOWN_DURATION) /
    TOTAL_CYCLE; // End scale down

  // Animation for background - scale and x move together in tandem
  // Appears AFTER spin completes, during the repeat delay
  const backgroundAnimation = {
    scale: [0, 0, 1, 1, 0, 0],
    x: ["-50%", "-50%", "-70%", "-70%", "-50%", "-50%"],
  };

  // Animation for confetti - scale and x move together in tandem
  const confettiAnimation = {
    scale: [0, 0, 1, 1, 0, 0],
    x: ["-50%", "-50%", "-150%", "-150%", "-50%", "-50%"],
  };

  // Transition with same easing for both scale and x to keep them in sync
  const combinedTransition = {
    duration: TOTAL_CYCLE,
    repeat: Infinity,
    times: [
      0, // Start hidden at center (during spin)
      t1, // Still hidden at center at end of spin
      t2, // Fully expanded and moved left
      t3, // Still expanded and left after wait
      t4, // Scaled down and back to center
      1, // Stay hidden at center until next cycle
    ],
    ease: "easeInOut" as const,
  };

  return (
    <div className="relative w-full h-full">
      <motion.img
        src="/images/animation/wheel-background-gradient.png"
        alt="AON1E background"
        className="h-32 w-auto object-contain absolute left-1/2 top-full -translate-y-[70%]"
        animate={backgroundAnimation}
        transition={combinedTransition}
      />
      <motion.img
        src="/images/animation/wheel-gift-confetti.png"
        alt="AON1E confetti"
        className="h-14 w-auto object-contain absolute left-1/2 -translate-y-1/2"
        animate={confettiAnimation}
        transition={combinedTransition}
      />
      <motion.img
        src="/images/animation/spin-wheel.png"
        alt="AON1E spin wheel"
        className="h-28 w-auto object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{
          duration: SPIN_DURATION,
          repeat: Infinity,
          repeatDelay: REPEAT_DELAY,
          ease: "linear",
        }}
      />
      <Image
        src="/images/animation/pin.png"
        alt="AON1E pin"
        width={24}
        height={24}
        unoptimized
        className="h-3 w-auto object-contain absolute left-[45%] top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
