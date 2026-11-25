import { applyDecorators } from "@nestjs/common";
import {
  Field as NestField,
  FieldOptions as NestFieldOptions,
  Float,
  ID,
  Int,
  ReturnTypeFunc as NestReturnTypeFunc,
} from "@nestjs/graphql";
import {
  ApiProperty as NestApiProperty,
  ApiPropertyOptions as NestApiPropertyOptions,
} from "@nestjs/swagger";
import { GraphQLJSON } from "graphql-scalars";

export type FieldOptions = NestFieldOptions & {
  type?: NestReturnTypeFunc;
};

export type ApiPropertyOptions = NestApiPropertyOptions & {};

export interface PropertyOptions {
  description: string;
  required?: boolean;
  defaultValue?: any;
  rest?: ApiPropertyOptions;
  graphql?: FieldOptions;
  type?: Function | NestReturnTypeFunc;
}

export function Field(
  options: PropertyOptions,
  propertyType?: PropertyTypeOptions,
) {
  let { description, required, defaultValue, rest, graphql, type } = options;

  rest = rest ?? {};
  graphql = graphql ?? {};

  if (propertyType?.graphql?.type) {
    graphql.type = propertyType.graphql.type;
  }

  if (propertyType?.rest?.type) {
    rest.type = propertyType.rest.type;
  }

  graphql.description = graphql.description ?? description;
  graphql.nullable = graphql.nullable ?? !required;
  graphql.defaultValue = graphql.defaultValue ?? defaultValue;
  graphql.type = graphql.type ?? (type as NestReturnTypeFunc) ?? (() => String);

  rest.description = rest.description ?? description;
  rest.required = rest.required ?? required ?? false;
  rest.default = rest.default ?? defaultValue;
  rest.type = rest.type ?? (type as Function);

  const decorators: PropertyDecorator[] = [
    NestField(graphql.type, graphql),
    NestApiProperty(rest),
  ];

  return applyDecorators(...decorators);
}

export type PropertyTypeOptions = {
  rest?: Pick<ApiPropertyOptions, "type">;
  graphql?: Pick<FieldOptions, "type">;
};

export const FieldType: Record<
  "integer" | "integerArray" | "float" | "floatArray" | "json" | "id",
  PropertyTypeOptions
> = {
  integer: {
    rest: { type: "integer" },
    graphql: { type: () => Int },
  },
  integerArray: {
    rest: { type: ["integer"] },
    graphql: { type: () => [Int] },
  },
  float: {
    rest: { type: "number" },
    graphql: { type: () => Float },
  },
  floatArray: {
    rest: { type: ["number"] },
    graphql: { type: () => [Float] },
  },
  json: {
    rest: { type: Object },
    graphql: { type: () => GraphQLJSON },
  },
  id: {
    rest: { type: String },
    graphql: { type: () => ID },
  },
};
