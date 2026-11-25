import type { FeatureTestConfig } from "./types";
import {
  FeatureComponentTestHarness,
  type FeatureComponentConstructor,
} from "./feature.base.test";

/**
 * Harness for testing feature controllers. Use FeatureControllerTestHarness.create(config) to build.
 */
export class FeatureControllerTestHarness extends FeatureComponentTestHarness {
  /**
   * Create a feature controller instance with resolveService overridden to return the given service mock.
   */
  createController<T extends object>(
    ControllerClass: FeatureComponentConstructor<T>,
    options: { service?: unknown; [key: string]: unknown } = {},
  ): T {
    return this.createComponentInstance(ControllerClass, options);
  }
}
