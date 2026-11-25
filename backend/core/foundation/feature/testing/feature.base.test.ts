import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { LoggerKey } from "@logger";
import type { FeatureTestConfig } from "./types";
import { mergeFeatureTestConfig } from "./types";
import {
  createMockConfigService,
  createMockLogger,
  createMockFeature,
  createMockRequestContext,
} from "./mocks";

/** Constructor signature shared by feature resolvers and controllers (feature, configService, moduleRef, logger). */
export type FeatureComponentConstructor<T = object> = new (
  feature: any,
  configService: ConfigService,
  moduleRef: ModuleRef,
  logger: any,
) => T;

/**
 * Base harness state shared by feature component test harnesses. Provides config,
 * feature, mocks, moduleRef, and requestContext. Subclasses add createResolver / createController.
 */
export interface FeatureComponentTestHarnessBase {
  /** Resolved config (defaults + overrides) */
  config: FeatureTestConfig;
  /** Mock feature module data */
  feature: ReturnType<typeof createMockFeature>;
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
 * Abstract base class for feature component test harnesses. Subclasses expose
 * createResolver / createController that delegate to createComponentInstance.
 *
 * Use static create(partialConfig?) to build a harness; it runs the async setup and returns
 * an instance of the subclass (e.g. FeatureResolverTestHarness.create(config)).
 */
export abstract class FeatureComponentTestHarness implements FeatureComponentTestHarnessBase {
  constructor(
    public readonly config: FeatureTestConfig,
    public readonly feature: ReturnType<typeof createMockFeature>,
    public readonly configService: ReturnType<typeof createMockConfigService>,
    public readonly logger: ReturnType<typeof createMockLogger>,
    public readonly moduleRef: ModuleRef,
    public readonly requestContext: (
      overrides?: Partial<import("@context/request").RequestContext>,
    ) => import("@context/request").RequestContext,
  ) {}

  /**
   * Instantiates a feature resolver or controller and optionally overrides resolveService.
   */
  protected createComponentInstance<T extends object>(
    ComponentClass: FeatureComponentConstructor<T>,
    options: { service?: unknown; [key: string]: unknown },
  ): T {
    const { service, ...restOverrides } = options;
    const instance = new ComponentClass(
      this.feature,
      this.configService as unknown as ConfigService,
      this.moduleRef,
      this.logger,
    ) as T & Record<string, unknown>;

    if (service !== undefined) {
      (instance as any).resolveService = () => service;
    }

    for (const [key, value] of Object.entries(restOverrides)) {
      if (value !== undefined && key !== "service") {
        (instance as any)[key] =
          typeof value === "function" ? value : () => value;
      }
    }

    return instance as T;
  }

  /**
   * Builds the harness. Call on a subclass to get that subclass instance, e.g.
   * FeatureResolverTestHarness.create(config) or FeatureControllerTestHarness.create(config).
   */
  static async create<T extends FeatureComponentTestHarness>(
    this: new (
      config: FeatureTestConfig,
      feature: ReturnType<typeof createMockFeature>,
      configService: ReturnType<typeof createMockConfigService>,
      logger: ReturnType<typeof createMockLogger>,
      moduleRef: ModuleRef,
      requestContext: (
        overrides?: Partial<import("@context/request").RequestContext>,
      ) => import("@context/request").RequestContext,
    ) => T,
    partialConfig?: Partial<FeatureTestConfig>,
  ): Promise<T> {
    const state = await (
      this as unknown as typeof FeatureComponentTestHarness
    ).buildState(partialConfig);
    return new this(
      state.config,
      state.feature,
      state.configService,
      state.logger,
      state.moduleRef,
      state.requestContext,
    );
  }

  private static async buildState(
    partialConfig?: Partial<FeatureTestConfig>,
  ): Promise<FeatureComponentTestHarnessBase> {
    const config = mergeFeatureTestConfig(partialConfig);
    const feature = createMockFeature(config);
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
      feature,
      configService,
      logger,
      moduleRef,
      requestContext,
    };
  }
}
