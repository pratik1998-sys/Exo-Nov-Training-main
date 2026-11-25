import { FeatureErrors, FeatureErrorsType } from "@feature/error";

export interface AdminDatasourceErrorsType extends FeatureErrorsType {}

export class AdminDatasourceErrors extends FeatureErrors {
  protected static errors: AdminDatasourceErrorsType = {
    ...FeatureErrors.errors,
  };
}
