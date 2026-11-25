export type RequestParameterDefinition = {
  id: string;
  description: string;
};

export interface RequestParametersType {
  id: RequestParameterDefinition;
  identifier: RequestParameterDefinition;
  identifiers: RequestParameterDefinition;
  slug: RequestParameterDefinition;
  depth: RequestParameterDefinition;
  filter: RequestParameterDefinition;
  pagination: RequestParameterDefinition;
  page: RequestParameterDefinition;
  pageSize: RequestParameterDefinition;
  sortBy: RequestParameterDefinition;
  term: RequestParameterDefinition;
  status: RequestParameterDefinition;
  type: RequestParameterDefinition;
  startOn: RequestParameterDefinition;
  endOn: RequestParameterDefinition;
  isDetailed: RequestParameterDefinition;
}

export const RequestParameters: RequestParametersType = {
  id: {
    id: "id",
    description: "entity id",
  },
  identifier: {
    id: "identifier",
    description: "entity identifier",
  },
  identifiers: {
    id: "identifiers",
    description: "identifiers",
  },
  slug: {
    id: "slug",
    description: "entity slug",
  },
  depth: {
    id: "depth",
    description: "Maximum nested object depth",
  },
  filter: {
    id: "filter",
    description: "Entity filter",
  },
  pagination: {
    id: "pagination",
    description: "Entity pagination",
  },
  page: {
    id: "page",
    description: "Pagination page",
  },
  pageSize: {
    id: "pageSize",
    description: "Results per pagination page",
  },
  sortBy: {
    id: "sortBy",
    description: "Entity sort by value",
  },
  term: {
    id: "term",
    description: "Entity search term",
  },
  status: {
    id: "status",
    description: "Entity status",
  },
  type: {
    id: "type",
    description: "entity type",
  },
  startOn: {
    id: "startOn",
    description: "entity start on date",
  },
  endOn: {
    id: "endOn",
    description: "entity end on date",
  },
  isDetailed: {
    id: "isDetailed",
    description: "Flag to enable extra logic for a more detail rich response",
  },
};
