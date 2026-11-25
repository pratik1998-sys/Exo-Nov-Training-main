import { vi } from "vitest";
import { AppConfigurationKeys } from "@configuration/app";
import type { RequestContext } from "@context/request";
import type { FeatureTestConfig } from "./types";

/**
 * Creates a mock Logger compatible with feature components (info, debug, warn, error, formatJSON).
 */
export function createMockLogger() {
  return {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    emergency: vi.fn(),
    access: vi.fn(),
    formatJSON: vi.fn((v: unknown) => JSON.stringify(v)),
    startProfile: vi.fn(),
  };
}

/**
 * Creates a minimal FeatureModuleData shape for tests. Same structure for any feature;
 * only id and group vary by config.
 */
export function createMockFeature(config: FeatureTestConfig) {
  return {
    id: config.featureId,
    group: config.featureGroup ?? "",
    configuration: config.featureConfiguration ?? {},
    pluginModules: [],
    isStandalone: false,
  } as any;
}

/**
 * Creates a ConfigService mock that returns values required by feature components:
 * consumerIds and configuredFeatures (for getFeatureConfiguration).
 */
export function createMockConfigService(config: FeatureTestConfig) {
  const configuredFeatures: Record<string, unknown> = config.featureGroup
    ? {
        [config.featureGroup]: {
          configuredFeatures: {
            [config.featureId]: config.featureConfiguration ?? {},
          },
        },
      }
    : {
        [config.featureId]: config.featureConfiguration ?? {},
      };

  return {
    get: vi.fn((key: string) => {
      if (key === AppConfigurationKeys.consumerIds) return config.consumerIds;
      if (key === AppConfigurationKeys.configuredFeatures)
        return configuredFeatures;
      return undefined;
    }),
  };
}

/**
 * Creates a RequestContext mock. Consumer comes from config; other fields can be overridden.
 */
export function createMockRequestContext(
  config: FeatureTestConfig,
  overrides: Partial<RequestContext> = {},
): RequestContext {
  const consumer = config.defaultConsumerId ?? config.consumerIds[0];
  return {
    consumer,
    ...overrides,
  } as RequestContext;
}
