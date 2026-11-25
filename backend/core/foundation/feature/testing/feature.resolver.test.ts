import type { FeatureTestConfig } from "./types";
import {
  FeatureComponentTestHarness,
  type FeatureComponentConstructor,
} from "./feature.base.test";

/**
 * Harness for testing feature resolvers. Use FeatureResolverTestHarness.create(config) to build.
 */
export class FeatureResolverTestHarness extends FeatureComponentTestHarness {
  /**
   * Create a feature resolver instance with resolveService overridden to return the given service mock.
   */
  createResolver<T extends object>(
    ResolverClass: FeatureComponentConstructor<T>,
    options: { service?: unknown; [key: string]: unknown } = {},
  ): T {
    return this.createComponentInstance(ResolverClass, options);
  }
}
