import { Field, FieldType } from "@api-decorators";
import { ResultSet } from "@feature/models";
import { InputType, ObjectType } from "@nestjs/graphql";

const { integer, integerArray } = FieldType;

@ObjectType()
export class AdminDatasourceServiceRetryModel {
  @Field({ description: "max retry attempts" }, integer)
  maxAttempts?: number;

  @Field(
    { description: "ignore retrying on http response status codes" },
    integerArray,
  )
  ignoreStatus?: number[];
}

@ObjectType()
export class AdminDatasourceServiceQueryModel {
  @Field({ description: "query id" })
  id?: string;

  @Field({ description: "query" })
  query?: string;
}

@ObjectType()
export class AdminDatasourceServiceModel {
  @Field({ description: "full service id", required: true })
  id?: string;

  @Field({ description: "service id", required: true })
  serviceId?: string;

  @Field({ description: "http method", required: true })
  method?: string;

  @Field({ description: "service path" })
  path?: string;

  @Field({
    type: () => AdminDatasourceServiceQueryModel,
    description: "gql service query",
  })
  query?: AdminDatasourceServiceQueryModel;

  @Field({ description: "service timeout" }, integer)
  timeout?: number;

  @Field({
    type: () => AdminDatasourceServiceRetryModel,
    description: "retry configuration",
  })
  retryConfig?: AdminDatasourceServiceRetryModel;

  @Field({ description: "is logging enabled" })
  isLoggingEnabled?: boolean;
}

@InputType()
export class AdminDatasourceServiceInputModel {
  @Field({ description: "service id" })
  id: string;

  @Field({ type: () => Boolean, description: "is logging enabled" })
  isLoggingEnabled: boolean;
}

@ObjectType()
export class AdminDatasourceServiceModelResultSet extends ResultSet<AdminDatasourceServiceModel> {
  @Field({ type: () => [AdminDatasourceServiceModel], description: "services" })
  results: AdminDatasourceServiceModel[];
}

export class AdminDatasourceServicesUpdateBody {
  datasourceServices: AdminDatasourceServiceInputModel[];
}
