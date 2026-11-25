import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { LoggerKey } from "@logger";
import type { PluginTestConfig } from "./types";
import { mergePluginTestConfig } from "./types";
import {
  createMockConfigService,
  createMockLogger,
  createMockPlugin,
  createMockRequestContext,
} from "./mocks";

/** Constructor signature shared by all plugin components (service, mapper, datasource). */
export type PluginComponentConstructor<T = object> = new (
  componentId: string,
  consumerIds: string[],
  plugin: any,
  moduleRef: ModuleRef,
  configService: ConfigService,
  logger: any,
) => T;

/**
 * Base harness state shared by all plugin component test harnesses. Provides config,
 * mocks, moduleRef, and requestContext. Subclasses add a create* factory.
 */
export interface PluginComponentTestHarnessBase {
  /** Resolved config (defaults + overrides) */
  config: PluginTestConfig;
  /** Mock plugin module data */
  plugin: ReturnType<typeof createMockPlugin>;
  /** Mock ConfigService */
  configService: ReturnType<typeof createMockConfigService>;
  /** Mock Logger */
  logger: ReturnType<typeof createMockLogger>;
  /** Nest ModuleRef from Test.createTestingModule (for constructor deps) */
  moduleRef: ModuleRef;
  /** Create a RequestContext for the configured default consumer (optional overrides) */
  requestContext: (
    overrides?: Partial<import("@context/request").RequestContext>,
  ) => import("@context/request").RequestContext;
}

/**
 * Maps option keys to instance method names. e.g. { datasource: "getDatasource", mapper: "getMapper" }.
 */
export type ResolverMap = Record<string, string>;

/**
 * Abstract base class for plugin component test harnesses. Subclasses override getResolverMap()
 * and expose a createService / createMapper / createDatasource method that delegates to createComponentInstance.
 *
 * Use static create(partialConfig?) to build a harness; it runs the async setup and returns an instance
 * of the subclass (e.g. PluginServiceTestHarness.create(config) returns PluginServiceTestHarness).
 */
export abstract class PluginComponentTestHarness implements PluginComponentTestHarnessBase {
  constructor(
    public readonly config: PluginTestConfig,
    public readonly plugin: ReturnType<typeof createMockPlugin>,
    public readonly configService: ReturnType<typeof createMockConfigService>,
    public readonly logger: ReturnType<typeof createMockLogger>,
    public readonly moduleRef: ModuleRef,
    public readonly requestContext: (
      overrides?: Partial<import("@context/request").RequestContext>,
    ) => import("@context/request").RequestContext,
  ) {}

  /** Override in subclasses to define which option keys map to which instance methods. */
  protected abstract getResolverMap(): ResolverMap;

  /** Instantiates a plugin component and applies resolver overrides from getResolverMap() plus any extra options. */
  protected createComponentInstance<T extends object>(
    ComponentClass: PluginComponentConstructor<T>,
    options: { componentId: string; [key: string]: unknown },
  ): T {
    const { componentId, ...rest } = options;
    const resolverMap = this.getResolverMap();
    const resolverKeys = new Set(Object.keys(resolverMap));
    const restOverrides: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rest)) {
      if (value === undefined) continue;
      if (resolverKeys.has(key)) continue;
      restOverrides[key] = value;
    }

    const instance = new ComponentClass(
      componentId,
      this.config.consumerIds,
      this.plugin,
      this.moduleRef,
      this.configService as unknown as ConfigService,
      this.logger,
    ) as T & Record<string, unknown>;

    for (const [optionKey, methodName] of Object.entries(resolverMap)) {
      const value = (options as Record<string, unknown>)[optionKey];
      if (value !== undefined) {
        (instance as any)[methodName] = () => value;
      }
    }

    for (const [key, value] of Object.entries(restOverrides)) {
      (instance as any)[key] =
        typeof value === "function" ? value : () => value;
    }

    return instance as T;
  }

  /**
   * Builds the harness. Call on a subclass to get that subclass instance, e.g.
   * PluginServiceTestHarness.create(config) or PluginMapperTestHarness.create(config).
   */
  static async create<T extends PluginComponentTestHarness>(
    this: new (
      config: PluginTestConfig,
      plugin: ReturnType<typeof createMockPlugin>,
      configService: ReturnType<typeof createMockConfigService>,
      logger: ReturnType<typeof createMockLogger>,
      moduleRef: ModuleRef,
      requestContext: (
        overrides?: Partial<import("@context/request").RequestContext>,
      ) => import("@context/request").RequestContext,
    ) => T,
    partialConfig?: Partial<PluginTestConfig>,
  ): Promise<T> {
    const state = await (
      this as unknown as typeof PluginComponentTestHarness
    ).buildState(partialConfig);
    return new this(
      state.config,
      state.plugin,
      state.configService,
      state.logger,
      state.moduleRef,
      state.requestContext,
    );
  }

  /** Builds the shared harness state (config, mocks, Nest module, requestContext). */
  private static async buildState(
    partialConfig?: Partial<PluginTestConfig>,
  ): Promise<PluginComponentTestHarnessBase> {
    const config = mergePluginTestConfig(partialConfig);
    const plugin = createMockPlugin(config);
    const configService = createMockConfigService(config);
    const logger = createMockLogger();

    const testingModule = await Test.createTestingModule({
      providers: [
        { provide: ConfigService, useValue: configService },
        { provide: LoggerKey, useValue: logger },
      ],
    }).compile();

    const moduleRef = testingModule.get(ModuleRef);

    function requestContext(
      overrides: Partial<import("@context/request").RequestContext> = {},
    ): import("@context/request").RequestContext {
      return createMockRequestContext(config, overrides);
    }

    return {
      config,
      plugin,
      configService,
      logger,
      moduleRef,
      requestContext,
    };
  }
}
