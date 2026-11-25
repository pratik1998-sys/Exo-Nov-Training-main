import { describe, it, expect, beforeEach } from "vitest";
import type { TutorialPetRestPet, TutorialPetRestPetResultSet } from "./schema/tutorial-pet-rest.pet.schema";

import { PluginMapperTestHarness } from "@plugin/testing";
import { TutorialPetRestPetMapper } from "./tutorial-pet-rest.pet.mapper";

describe("TutorialPetRestPetMapper", () => {
  let harness: PluginMapperTestHarness;
  let mapper: TutorialPetRestPetMapper;

  beforeEach(async () => {
    harness = await PluginMapperTestHarness.create({
      pluginId: "tutorial-pet-rest",
      featureId: "pet",
      consumerIds: ["site-1"],
    });

    mapper = harness.createMapper(TutorialPetRestPetMapper, {
      componentId: "tutorial-pet-rest.pet.mapper",
    });
  });

  describe("mapPet", () => {
    it("maps datasource pet to feature Pet with all fields", () => {
      const dsPet: TutorialPetRestPet = {
        id: "1",
        identifier: "pet-1",
        type: "dog",
        firstName: "Rex",
        middleName: "J",
        lastName: "Doe",
        breed: "Lab",
        height: "24",
        weight: "60",
        thumbnail: { url: "https://example.com/thumb.png" },
      };

      const ctx = harness.requestContext();
      const result = mapper.mapPet(ctx, dsPet);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        id: "1",
        identifier: "pet-1",
        type: "dog",
        firstName: "Rex",
        middleName: "J",
        lastName: "Doe",
        breed: "Lab",
        height: "24",
        weight: "60",
      });
      expect(result!.thumbnail).toEqual({ url: "https://example.com/thumb.png" });
    });

    it("maps thumbnail to Image shape", () => {
      const dsPet: TutorialPetRestPet = {
        id: "2",
        identifier: "pet-2",
        type: "cat",
        firstName: "Whiskers",
        middleName: "",
        lastName: "Smith",
        breed: "Tabby",
        height: "12",
        weight: "8",
        thumbnail: { url: "https://example.com/cat.png" },
      };

      const ctx = harness.requestContext();
      const result = mapper.mapPet(ctx, dsPet);

      expect(result!.thumbnail).toEqual({ url: "https://example.com/cat.png" });
    });

    it("returns null when dsPet is null/undefined", () => {
      const ctx = harness.requestContext();
      expect(mapper.mapPet(ctx, null as any)).toBeNull();
      expect(mapper.mapPet(ctx, undefined as any)).toBeNull();
    });
  });

  describe("mapPetResultSet", () => {
    it("maps result set with pagination and results", () => {
      const dsResultSet: TutorialPetRestPetResultSet = {
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 2,
          resultCount: 15,
          hasMorePages: true,
        },
        results: [
          {
            id: "1",
            identifier: "pet-1",
            type: "dog",
            firstName: "Rex",
            middleName: "",
            lastName: "Doe",
            breed: "Lab",
            height: "24",
            weight: "60",
            thumbnail: { url: "https://example.com/rex.png" },
          },
        ],
      };

      const ctx = harness.requestContext();
      const result = mapper.mapPetResultSet(ctx, dsResultSet);

      expect(result).toBeDefined();
      expect(result!.pagination).toMatchObject({
        page: 1,
        pageSize: 10,
        pageCount: 2,
        resultCount: 15,
        hasMorePages: true,
      });
      expect(result!.results).toHaveLength(1);
      expect(result!.results![0]).toMatchObject({
        id: "1",
        identifier: "pet-1",
        firstName: "Rex",
        lastName: "Doe",
      });
      expect(result!.results![0].thumbnail).toEqual({ url: "https://example.com/rex.png" });
    });

    it("returns null when dsPetResultSet is null/undefined", () => {
      const ctx = harness.requestContext();
      expect(mapper.mapPetResultSet(ctx, null as any)).toBeNull();
      expect(mapper.mapPetResultSet(ctx, undefined as any)).toBeNull();
    });

    it("maps empty results array", () => {
      const dsResultSet: TutorialPetRestPetResultSet = {
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 0,
          resultCount: 0,
          hasMorePages: false,
        },
        results: [],
      };

      const ctx = harness.requestContext();
      const result = mapper.mapPetResultSet(ctx, dsResultSet);

      expect(result!.results).toEqual([]);
      expect(result!.pagination).toMatchObject({ page: 1, pageSize: 10, resultCount: 0 });
    });
  });
});
