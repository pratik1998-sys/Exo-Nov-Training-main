import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  TutorialPetRestPet,
  TutorialPetRestPetBodyCreate,
  TutorialPetRestPetBodyUpdate,
  TutorialPetRestPetQuery,
  TutorialPetRestPetResultSet,
} from "./schema/tutorial-pet-rest.pet.schema";

// Avoid loading the real REST/graphql datasource chain (rest.datasource imports @plugin/datasource/api which loads graphql).
vi.mock("@plugin-datasource-rest", async () => {
  const actual = await vi.importActual<typeof import("@plugin/datasource")>("@plugin/datasource");
  const { BaseDatasource, DatasourceRequiredFieldType } = actual;
  class BaseRestDatasource extends BaseDatasource {
    protected getRequiredConfigFields() {
      return { host: DatasourceRequiredFieldType.string };
    }
  }
  return {
    HttpMethods: { get: "get", post: "post", put: "put", delete: "delete", patch: "patch" },
    BaseRestDatasource,
    RestDatasourceServiceDefinition: class {},
    RestDatasourceServiceDefinitions: class {},
  };
});

import { PluginDatasourceTestHarness } from "@plugin/testing";
import {
  TutorialPetRestPetDatasource,
  pathByIdentifier,
  pathRoot,
} from "./tutorial-pet-rest.pet.datasource";
import { HttpMethods } from "@plugin-datasource-rest";

describe("TutorialPetRestPetDatasource", () => {
  let harness: PluginDatasourceTestHarness;
  let datasource: TutorialPetRestPetDatasource;
  let mockExecute: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    harness = await PluginDatasourceTestHarness.create({
      pluginId: "tutorial-pet-rest",
      featureId: "pet",
      consumerIds: ["site-1"],
      datasourceConfig: {
        host: "http://localhost",
        clientId: "test-client",
        clientSecret: "test-secret",
        apiKey: "test-api-key",
      },
    });

    mockExecute = vi.fn();

    datasource = harness.createDatasource(TutorialPetRestPetDatasource, {
      componentId: "tutorial-pet-rest.pet.datasource",
      execute: mockExecute,
    });
  });

  describe("getPets", () => {
    it("calls execute with getPets service definition and query", async () => {
      const query: TutorialPetRestPetQuery = { page: 1, pageSize: 10 };
      const resultSet: TutorialPetRestPetResultSet = {
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          resultCount: 0,
          hasMorePages: false,
        },
        results: [],
      };
      mockExecute.mockResolvedValue(resultSet);

      const ctx = harness.requestContext();
      const result = await datasource.getPets(ctx, query);

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(mockExecute).toHaveBeenCalledWith(
        ctx,
        expect.objectContaining({
          id: "getPets",
          method: HttpMethods.get,
          path: pathRoot,
          timeout: 5000,
        }),
        query,
      );
      expect(result).toEqual(resultSet);
    });
  });

  describe("getPet", () => {
    it("calls execute with getPet service definition and identifier param", async () => {
      const pet: TutorialPetRestPet = {
        id: "1",
        identifier: "pet-1",
        type: "dog",
        firstName: "Rex",
        middleName: "",
        lastName: "Doe",
        breed: "Lab",
        height: "24",
        weight: "60",
        thumbnail: { url: "https://example.com/thumb.png" },
      };
      mockExecute.mockResolvedValue(pet);

      const ctx = harness.requestContext();
      const result = await datasource.getPet(ctx, "pet-1");

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(mockExecute).toHaveBeenCalledWith(
        ctx,
        expect.objectContaining({
          id: "getPet",
          method: HttpMethods.get,
          path: pathByIdentifier,
          timeout: 5000,
        }),
        {},
        {},
        { "{identifier}": "pet-1" },
      );
      expect(result).toEqual(pet);
    });
  });

  describe("createPet", () => {
    it("calls execute with createPet service definition and body", async () => {
      const body: TutorialPetRestPetBodyCreate = {
        firstName: "Rex",
        middleName: "J",
        lastName: "Doe",
        breed: "Lab",
        height: "24",
        weight: "60",
        thumbnail: "https://example.com/thumb.png",
      };
      const created: TutorialPetRestPet = {
        id: "1",
        identifier: "pet-1",
        type: "dog",
        ...body,
        thumbnail: { url: body.thumbnail },
      };
      mockExecute.mockResolvedValue(created);

      const ctx = harness.requestContext();
      const result = await datasource.createPet(ctx, body);

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(mockExecute).toHaveBeenCalledWith(
        ctx,
        expect.objectContaining({
          id: "createPet",
          method: HttpMethods.post,
          path: pathRoot,
          timeout: 5000,
        }),
        {},
        {},
        {},
        body,
      );
      expect(result).toEqual(created);
    });
  });

  describe("updatePet", () => {
    it("calls execute with updatePet service definition, identifier param, and body", async () => {
      const body: TutorialPetRestPetBodyUpdate = {
        firstName: "Rex Updated",
        middleName: "",
        lastName: "Doe",
        breed: "Lab",
        height: "24",
        weight: "60",
        thumbnail: "",
      };
      const updated: TutorialPetRestPet = {
        id: "1",
        identifier: "pet-1",
        type: "dog",
        ...body,
        thumbnail: { url: "" },
      };
      mockExecute.mockResolvedValue(updated);

      const ctx = harness.requestContext();
      const result = await datasource.updatePet(ctx, "pet-1", body);

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(mockExecute).toHaveBeenCalledWith(
        ctx,
        expect.objectContaining({
          id: "updatePet",
          method: HttpMethods.put,
          path: pathByIdentifier,
          timeout: 5000,
        }),
        {},
        {},
        { "{identifier}": "pet-1" },
        body,
      );
      expect(result).toEqual(updated);
    });
  });

  describe("deletePet", () => {
    it("calls execute with deletePet service definition and identifier param", async () => {
      const deleted: TutorialPetRestPet = {
        id: "1",
        identifier: "pet-1",
        type: "dog",
        firstName: "Rex",
        middleName: "",
        lastName: "Doe",
        breed: "Lab",
        height: "",
        weight: "",
        thumbnail: { url: "" },
      };
      mockExecute.mockResolvedValue(deleted);

      const ctx = harness.requestContext();
      const result = await datasource.deletePet(ctx, "pet-1");

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(mockExecute).toHaveBeenCalledWith(
        ctx,
        expect.objectContaining({
          id: "deletePet",
          method: HttpMethods.delete,
          path: pathByIdentifier,
          timeout: 5000,
        }),
        {},
        {},
        { "{identifier}": "pet-1" },
      );
      expect(result).toEqual(deleted);
    });
  });
});
