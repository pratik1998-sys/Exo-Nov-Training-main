import type { RequestContext } from "@context/request";

/**
 * Configuration for feature component tests. Resolvers and controllers
 * use the same shape; only the values (featureId, featureGroup, consumerIds, etc.) differ.
 */
export interface FeatureTestConfig {
  /** Feature id (e.g. "pet", "user", "account") */
  featureId: string;
  /** Optional feature group for getFeatureConfiguration (configuredFeatures[group].configuredFeatures[id]) */
  featureGroup?: string;
  /** App consumer ids (default ["site-1"]) */
  consumerIds: string[];
  /** Default consumer id for requestContext (defaults to first entry in consumerIds) */
  defaultConsumerId?: string;
  /** Returned by getFeatureConfiguration() when feature has no group */
  featureConfiguration?: Record<string, unknown>;
}

/** Default config used when partial config is passed to the harness */
export const DEFAULT_FEATURE_TEST_CONFIG: FeatureTestConfig = {
  featureId: "pet",
  featureGroup: "",
  consumerIds: ["site-1"],
  defaultConsumerId: "site-1",
  featureConfiguration: {},
};

export function mergeFeatureTestConfig(
  partial?: Partial<FeatureTestConfig>,
): FeatureTestConfig {
  const base = { ...DEFAULT_FEATURE_TEST_CONFIG };
  if (!partial) return base;
  const merged = { ...base, ...partial };
  if (merged.consumerIds.length > 0 && !merged.defaultConsumerId) {
    merged.defaultConsumerId = merged.consumerIds[0];
  }
  return merged;
}
