"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Animation timing constants - SYNCED WITH SPIN WHEEL
const MAIN_ACTION_DURATION = 1.25; // Same as spin wheel's SPIN_DURATION
const MORPH_COUNT = 4; // Number of morph slots (0->1, 1->2, 2->3, 3->0)
const MORPH_SLOT_DURATION = MAIN_ACTION_DURATION / MORPH_COUNT; // 0.3125s per slot
const SCALE_UP_DURATION = 0.5; // Duration to scale up background/coin
const WAIT_AT_FULL_SCALE = 1; // Wait time at full size
const SCALE_DOWN_DURATION = 0.2; // Duration to scale down (same as spin wheel)
const WAIT_BEFORE_NEXT_CYCLE = 0; // No wait after scale down

// Total delay between morph cycles = scale animation
const REPEAT_DELAY =
  SCALE_UP_DURATION +
  WAIT_AT_FULL_SCALE +
  SCALE_DOWN_DURATION +
  WAIT_BEFORE_NEXT_CYCLE;

// Total cycle time (morph + delay) - matches spin wheel
const TOTAL_CYCLE = MAIN_ACTION_DURATION + REPEAT_DELAY;

// Timeline within TOTAL_CYCLE (2.95s) - SYNCED WITH SPIN WHEEL:
// 0s - 0.3125s: Image 0 visible (slot 0)
// 0.3125s - 0.625s: Image 1 visible (slot 1)
// 0.625s - 0.9375s: Image 2 visible (slot 2)
// 0.9375s - 1.25s: Image 3 visible (slot 3, includes 3->0 delay)
// 1.25s - 1.75s: Scale up (0.5s) - background/coin appear
// 1.75s - 2.75s: Stay at full size (1s)
// 2.75s - 2.95s: Scale down (0.2s) - background/coin disappear
// 2.95s: Next cycle starts, image 3 fades out to reveal image 0

export function CheckInAnimation() {
  // Calculate keyframe times as percentages of total cycle
  const t1 = MAIN_ACTION_DURATION / TOTAL_CYCLE; // End of morph phase, start scale up
  const t2 = (MAIN_ACTION_DURATION + SCALE_UP_DURATION) / TOTAL_CYCLE; // End scale up, at full size
  const t3 =
    (MAIN_ACTION_DURATION + SCALE_UP_DURATION + WAIT_AT_FULL_SCALE) /
    TOTAL_CYCLE; // End wait, start scale down
  const t4 =
    (MAIN_ACTION_DURATION +
      SCALE_UP_DURATION +
      WAIT_AT_FULL_SCALE +
      SCALE_DOWN_DURATION) /
    TOTAL_CYCLE; // End scale down

  // Animation for background - scale and x move together in tandem
  const backgroundAnimation = {
    scale: [0, 0, 1, 1, 0, 0],
    x: ["-50%", "-50%", "-70%", "-70%", "-50%", "-50%"],
  };

  // Animation for coin - scale and x move together in tandem
  const coinAnimation = {
    scale: [0, 0, 1, 1, 0, 0],
    x: ["-50%", "-50%", "-149%", "-149%", "-50%", "-50%"],
  };

  // Transition with same easing for both scale and x to keep them in sync
  const combinedTransition = {
    duration: TOTAL_CYCLE,
    repeat: Infinity,
    times: [
      0, // Start hidden at center (during morph)
      t1, // Still hidden at center at end of morph
      t2, // Fully expanded and moved left
      t3, // Still expanded and left after wait
      t4, // Scaled down and back to center
      1, // Stay hidden at center until next cycle
    ],
    ease: "easeInOut" as const,
  };

  // Morph animation - images 1, 2, 3 fade in/out on top of static image 0
  // 4 equal time slots within MAIN_ACTION_DURATION (1.25s):
  // Slot 0 (0 - 0.3125s): Image 0 visible
  // Slot 1 (0.3125s - 0.625s): Image 1 visible
  // Slot 2 (0.625s - 0.9375s): Image 2 visible
  // Slot 3 (0.9375s - 1.25s): Image 3 visible (3->0 delay included)

  // Convert morph slot times to cycle percentages
  const m1 = MORPH_SLOT_DURATION / TOTAL_CYCLE; // End of slot 0, image 1 fades in
  const m2 = (2 * MORPH_SLOT_DURATION) / TOTAL_CYCLE; // End of slot 1, image 2 fades in
  const m3 = (3 * MORPH_SLOT_DURATION) / TOTAL_CYCLE; // End of slot 2, image 3 fades in
  const m4 = (4 * MORPH_SLOT_DURATION) / TOTAL_CYCLE; // End of slot 3 (= t1, start of background animation)

  // Opacity keyframes for animated images (times must be monotonically increasing)
  // Image 1: fade in at m1, stay visible m1->m2, fade out at m2
  const morph1Animation = {
    opacity: [0, 1, 1, 0, 0, 0],
    times: [0, m1, m2 - 0.001, m2, 0.99, 1],
  };

  // Image 2: hidden until m1, fade in at m2, stay visible m2->m3, fade out at m3
  const morph2Animation = {
    opacity: [0, 0, 1, 1, 0, 0],
    times: [0, m2 - 0.001, m2, m3 - 0.001, m3, 1],
  };

  // Image 3: hidden until m2, fade in at m3, stay visible until cycle end, fade out at restart
  const morph3Animation = {
    opacity: [0, 0, 0, 1, 1, 0],
    times: [0, m2, m3 - 0.001, m3, 0.99, 1],
  };

  const morphTransition = {
    duration: TOTAL_CYCLE,
    repeat: Infinity,
    ease: "linear" as const,
  };

  return (
    <div className="relative w-full h-full">
      {/* Background gradient */}
      <motion.img
        src="/images/animation/check-in-background-gradient.png"
        alt="Check-in background"
        className="h-36 w-auto object-contain absolute left-1/2 top-full -translate-y-[70%]"
        animate={backgroundAnimation}
        transition={combinedTransition}
      />

      {/* Coin */}
      <motion.img
        src="/images/animation/check-in-coin.png"
        alt="Check-in coin"
        className="h-14 w-auto object-contain absolute left-1/2 top-full -translate-y-[70%]"
        animate={coinAnimation}
        transition={combinedTransition}
      />

      {/* Check-in base image (static, always visible) */}
      <Image
        src="/images/animation/check-in-0.png"
        alt="Check-in 0"
        width={128}
        height={128}
        unoptimized
        className="h-36 w-auto object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Check-in morph images 1, 2, 3 (animated, layered on top) */}
      <motion.img
        src="/images/animation/check-in-1.png"
        alt="Check-in 1"
        className="h-36 w-auto object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ opacity: morph1Animation.opacity }}
        transition={{ ...morphTransition, times: morph1Animation.times }}
      />
      <motion.img
        src="/images/animation/check-in-2.png"
        alt="Check-in 2"
        className="h-36 w-auto object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ opacity: morph2Animation.opacity }}
        transition={{ ...morphTransition, times: morph2Animation.times }}
      />
      <motion.img
        src="/images/animation/check-in-3.png"
        alt="Check-in 3"
        className="h-36 w-auto object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ opacity: morph3Animation.opacity }}
        transition={{ ...morphTransition, times: morph3Animation.times }}
      />
    </div>
  );
}
