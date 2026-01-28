import type { Recipe } from "../types";

export const presets: Record<string, Recipe> = {
  LowNoise: {
    eeg: {
      noise_type: "white",
      noise_sigma: 0.6,
      channel_mask: {
        mode: "group",
        groups: ["left_hemi"],
        explicit: [],
      },
    },
    emg: {
      enabled: true,
      gain: Array.from({ length: 8 }, () => 0.9),
      delay_ms: 30,
    },
    sync: {
      jitter_ms: 6,
      dropout_rate: 0.03,
    },
    prior: {
      skeleton_strength: 0.75,
      dynamics_smoothness: 0.7,
    },
    output: {
      quality: "preview",
    },
  },
  HighNoise: {
    eeg: {
      noise_type: "1f",
      noise_sigma: 2.4,
      channel_mask: {
        mode: "group",
        groups: ["right_hemi"],
        explicit: [],
      },
    },
    emg: {
      enabled: true,
      gain: Array.from({ length: 8 }, () => 1.3),
      delay_ms: 90,
    },
    sync: {
      jitter_ms: 18,
      dropout_rate: 0.18,
    },
    prior: {
      skeleton_strength: 0.55,
      dynamics_smoothness: 0.45,
    },
    output: {
      quality: "bake",
    },
  },
};

export const CHANNELS_64 = Array.from({ length: 64 }, (_, i) => `Ch${i + 1}`);
