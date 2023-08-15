const LOCAL_STORAGE_KEY_PREFIX = "datayes-copilot"

type FeatureKey = "positionY" | "placement"

export const getLocalStorageKey = (featureKey: FeatureKey) =>
  `${LOCAL_STORAGE_KEY_PREFIX}_${featureKey}`
