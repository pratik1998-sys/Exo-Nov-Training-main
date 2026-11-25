import { FeatureErrors, FeatureErrorsType } from "@feature/error";

export interface AdminRegistryErrorsType extends FeatureErrorsType {}

export class AdminRegistryErrors extends FeatureErrors {
  protected static errors: AdminRegistryErrorsType = {
    ...FeatureErrors.errors,
  };
}
