import { vi } from "vitest";
import { AppConfigurationKeys } from "@configuration/app";
import type { RequestContext } from "@context/request";
import type { PluginTestConfig } from "./types";

/**
 * Creates a mock Logger compatible with plugin components (info, debug, warn, error, formatJSON).
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
 * Creates a minimal PluginModuleData shape for tests. Same structure for any plugin;
 * only id, feature.id, and feature.group vary by config.
 */
export function createMockPlugin(config: PluginTestConfig) {
  return {
    id: config.pluginId,
    feature: {
      id: config.featureId,
      group: config.featureGroup ?? "",
    },
    configuration: {},
  } as any;
}

/**
 * Creates a ConfigService mock that returns values required by plugin components:
 * consumerIds, defaultConsumerId, and configuredFeatures (for getPluginConsumerConfiguration).
 */
export function createMockConfigService(config: PluginTestConfig) {
  const consumerId = config.defaultConsumerId ?? config.consumerIds[0];
  const configuredFeatures: Record<string, unknown> = {
    [config.featureId]: {
      configuredPlugins: {
        [config.pluginId]: {
          configuredConsumers: config.consumerIds.reduce(
            (acc, cid) => {
              acc[cid] = {
                configuration: config.consumerConfiguration ?? {},
              };
              return acc;
            },
            {} as Record<string, { configuration: unknown }>,
          ),
        },
      },
    },
  };
  return {
    get: vi.fn((key: string) => {
      if (key === AppConfigurationKeys.consumerIds) return config.consumerIds;
      if (key === AppConfigurationKeys.defaultConsumerId) return consumerId;
      if (key === AppConfigurationKeys.configuredFeatures)
        return configuredFeatures;
      if (typeof key === "string" && key.startsWith("DATASOURCE_CONFIG_")) {
        const dsConfig = config.datasourceConfig ?? {
          baseUrl: "http://localhost",
        };
        return JSON.stringify(dsConfig);
      }
      return undefined;
    }),
  };
}

/**
 * Creates a RequestContext mock. Consumer comes from config; other fields can be overridden.
 */
export function createMockRequestContext(
  config: PluginTestConfig,
  overrides: Partial<RequestContext> = {},
): RequestContext {
  const consumer = config.defaultConsumerId ?? config.consumerIds[0];
  return {
    consumer,
    ...overrides,
  } as RequestContext;
}
