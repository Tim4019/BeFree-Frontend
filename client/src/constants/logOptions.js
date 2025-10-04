export const moodOptions = [
  {
    value: "very-low",
    label: "Tender",
    emoji: "😔",
    helper: "Running low, needing care",
  },
  {
    value: "low",
    label: "Wobbly",
    emoji: "😕",
    helper: "A bit off balance",
  },
  {
    value: "steady",
    label: "Steady",
    emoji: "🙂",
    helper: "Holding steady",
  },
  {
    value: "bright",
    label: "Bright",
    emoji: "😊",
    helper: "Feeling encouraged",
  },
  {
    value: "energised",
    label: "Energised",
    emoji: "😄",
    helper: "Charged up and hopeful",
  },
];

export const triggerPresets = [
  "Stress",
  "Social setting",
  "Boredom",
  "Loneliness",
  "Celebration",
  "Fatigue",
];

export const copingPresets = [
  "Breathing exercise",
  "Reached out",
  "Movement",
  "Hydrated",
  "Meditation",
  "Sleep reset",
];

export function findMoodDetails(value) {
  return moodOptions.find((option) => option.value === value) || null;
}
