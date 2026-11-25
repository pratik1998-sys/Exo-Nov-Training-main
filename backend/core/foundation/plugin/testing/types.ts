import type { RequestContext } from "@context/request";

/**
 * Configuration for plugin component tests. All plugin services, mappers, and datasources
 * can use the same shape; only the values (pluginId, featureId, consumerIds, etc.) differ.
 */
export interface PluginTestConfig {
  /** Plugin id (e.g. "tutorial-pet-rest") */
  pluginId: string;
  /** Feature id (e.g. "pet", "user") */
  featureId: string;
  /** Optional feature group for configuredFeatures lookup */
  featureGroup?: string;
  /** Consumer ids this plugin serves (default ["site-1"]) */
  consumerIds: string[];
  /** Default consumer id (defaults to first entry in consumerIds) */
  defaultConsumerId?: string;
  /** Per-consumer configuration exposed via getPluginConsumerConfiguration (e.g. pagination) */
  consumerConfiguration?: Record<string, unknown>;
  /** Datasource config returned for DATASOURCE_CONFIG_* keys (for datasource harness tests) */
  datasourceConfig?: Record<string, unknown>;
}

/** Default config used when partial config is passed to the harness */
export const DEFAULT_PLUGIN_TEST_CONFIG: PluginTestConfig = {
  pluginId: "tutorial-pet-rest",
  featureId: "pet",
  featureGroup: "",
  consumerIds: ["site-1"],
  defaultConsumerId: "site-1",
  consumerConfiguration: {
    pagination: { pageSize: { default: 10, max: 20 } },
  },
};

export function mergePluginTestConfig(
  partial?: Partial<PluginTestConfig>,
): PluginTestConfig {
  const base = { ...DEFAULT_PLUGIN_TEST_CONFIG };
  if (!partial) return base;
  const merged = { ...base, ...partial };
  if (merged.consumerIds.length > 0 && !merged.defaultConsumerId) {
    merged.defaultConsumerId = merged.consumerIds[0];
  }
  return merged;
}
