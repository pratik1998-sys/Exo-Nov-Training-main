import { describe, it, expect, vi, beforeEach } from "vitest";
import type { TutorialPetRestPet, TutorialPetRestPetResultSet } from "./schema/tutorial-pet-rest.pet.schema";
import type { Pet, PetResultSet, PetInput } from "@feature-tutorial-pet/pet/pet.model";
import type { RequestContext } from "@context/request";

// Avoid loading the real datasource/mapper (and their REST/GraphQL chain) when loading the service.
vi.mock("./tutorial-pet-rest.pet.datasource", () => ({
  TutorialPetRestPetDatasource: class {},
}));
vi.mock("./tutorial-pet-rest.pet.mapper", () => ({
  TutorialPetRestPetMapper: class {},
}));

import { PluginServiceTestHarness } from "@plugin/testing";
import { TutorialPetRestPetServiceImpl } from "./tutorial-pet-rest.pet.service";

describe("TutorialPetRestPetServiceImpl", () => {
  let harness: PluginServiceTestHarness;
  let service: TutorialPetRestPetServiceImpl;
  let mockDatasource: {
    getPet: ReturnType<typeof vi.fn>;
    getPets: ReturnType<typeof vi.fn>;
    createPet: ReturnType<typeof vi.fn>;
    updatePet: ReturnType<typeof vi.fn>;
    deletePet: ReturnType<typeof vi.fn>;
  };
  let mockMapper: {
    mapPet: ReturnType<typeof vi.fn>;
    mapPetResultSet: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    harness = await PluginServiceTestHarness.create({
      pluginId: "tutorial-pet-rest",
      featureId: "pet",
      consumerIds: ["site-1"],
    });

    mockDatasource = {
      getPet: vi.fn(),
      getPets: vi.fn(),
      createPet: vi.fn(),
      updatePet: vi.fn(),
      deletePet: vi.fn(),
    };
    mockMapper = {
      mapPet: vi.fn((_ctx: RequestContext, ds: TutorialPetRestPet): Pet => ({
        id: ds.id,
        identifier: ds.identifier,
        type: ds.type,
        firstName: ds.firstName,
        middleName: ds.middleName,
        lastName: ds.lastName,
        breed: ds.breed,
        height: ds.height,
        weight: ds.weight,
        thumbnail: ds.thumbnail ? { url: ds.thumbnail.url } : undefined,
      })),
      mapPetResultSet: vi.fn(
        (_ctx: RequestContext, ds: TutorialPetRestPetResultSet): PetResultSet => ({
          pagination: ds.pagination as any,
          results: (ds.results ?? []).map((p) => mockMapper.mapPet(_ctx, p)),
        }),
      ),
    };

    service = harness.createService(TutorialPetRestPetServiceImpl, {
      componentId: "tutorial-pet-rest.pet.service",
      datasource: mockDatasource,
      mapper: mockMapper,
    });
  });

  describe("getPet", () => {
    it("returns mapped pet when datasource succeeds", async () => {
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
      mockDatasource.getPet.mockResolvedValue(dsPet);

      const requestContext = harness.requestContext();
      const result = await service.getPet("pet-1", requestContext);

      expect(mockDatasource.getPet).toHaveBeenCalledWith(requestContext, "pet-1");
      expect(mockMapper.mapPet).toHaveBeenCalledWith(requestContext, dsPet);
      expect(result).toBeDefined();
      expect(result!.id).toBe("1");
      expect(result!.firstName).toBe("Rex");
    });

    it("throws getPetFailed when datasource throws", async () => {
      mockDatasource.getPet.mockRejectedValue(new Error("network error"));

      await expect(service.getPet("pet-1", harness.requestContext())).rejects.toMatchObject({
        response: "PET_GET_FAILED",
      });
    });
  });

  describe("getPets", () => {
    it("returns mapped result set when datasource succeeds", async () => {
      const dsResultSet: TutorialPetRestPetResultSet = {
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          hasMorePages: false,
          resultCount: 1,
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
            thumbnail: { url: "https://example.com/thumb.png" },
          },
        ],
      };
      mockDatasource.getPets.mockResolvedValue(dsResultSet);

      const result = await service.getPets(
        {},
        { page: 1, pageSize: 10 },
        harness.requestContext(),
      );

      expect(mockDatasource.getPets).toHaveBeenCalled();
      expect(mockMapper.mapPetResultSet).toHaveBeenCalledWith(
        expect.anything(),
        dsResultSet,
      );
      expect(result).toBeDefined();
      expect(result.results).toHaveLength(1);
      expect(result.results![0].id).toBe("1");
    });

    it("throws getPetsFailed when datasource throws", async () => {
      mockDatasource.getPets.mockRejectedValue(new Error("network error"));

      await expect(
        service.getPets({}, {}, harness.requestContext()),
      ).rejects.toMatchObject({ response: "PETS_GET_FAILED" });
    });
  });

  describe("createPet", () => {
    it("returns mapped pet when datasource succeeds", async () => {
      const petInput: PetInput = {
        firstName: "Rex",
        lastName: "Doe",
        breed: "Lab",
      };
      const dsPet: TutorialPetRestPet = {
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
      mockDatasource.createPet.mockResolvedValue(dsPet);

      const result = await service.createPet(petInput, harness.requestContext());

      expect(mockDatasource.createPet).toHaveBeenCalled();
      expect(mockMapper.mapPet).toHaveBeenCalledWith(expect.anything(), dsPet);
      expect(result).toBeDefined();
      expect(result!.id).toBe("1");
    });

    it("throws createPetFailed when datasource throws", async () => {
      mockDatasource.createPet.mockRejectedValue(new Error("create failed"));

      await expect(
        service.createPet({ firstName: "Rex" } as PetInput, harness.requestContext()),
      ).rejects.toMatchObject({ response: "PET_CREATE_FAILED" });
    });
  });

  describe("updatePet", () => {
    it("returns mapped pet when datasource succeeds", async () => {
      const petInput: PetInput = { firstName: "Rex Updated" };
      const dsPet: TutorialPetRestPet = {
        id: "1",
        identifier: "pet-1",
        type: "dog",
        firstName: "Rex Updated",
        middleName: "",
        lastName: "Doe",
        breed: "Lab",
        height: "",
        weight: "",
        thumbnail: { url: "" },
      };
      mockDatasource.updatePet.mockResolvedValue(dsPet);

      const result = await service.updatePet(
        "pet-1",
        petInput,
        harness.requestContext(),
      );

      expect(mockDatasource.updatePet).toHaveBeenCalledWith(
        expect.anything(),
        "pet-1",
        expect.any(Object),
      );
      expect(mockMapper.mapPet).toHaveBeenCalledWith(expect.anything(), dsPet);
      expect(result!.firstName).toBe("Rex Updated");
    });

    it("throws updatePetFailed when datasource throws", async () => {
      mockDatasource.updatePet.mockRejectedValue(new Error("update failed"));

      await expect(
        service.updatePet(
          "pet-1",
          { firstName: "Rex" } as PetInput,
          harness.requestContext(),
        ),
      ).rejects.toMatchObject({ response: "PET_UPDATE_FAILED" });
    });
  });

  describe("deletePet", () => {
    it("returns mapped pet when datasource succeeds", async () => {
      const dsPet: TutorialPetRestPet = {
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
      mockDatasource.deletePet.mockResolvedValue(dsPet);

      const result = await service.deletePet("pet-1", harness.requestContext());

      expect(mockDatasource.deletePet).toHaveBeenCalledWith(
        expect.anything(),
        "pet-1",
      );
      expect(mockMapper.mapPet).toHaveBeenCalledWith(expect.anything(), dsPet);
      expect(result!.id).toBe("1");
    });

    it("throws deletePetFailed when datasource throws", async () => {
      mockDatasource.deletePet.mockRejectedValue(new Error("delete failed"));

      await expect(
        service.deletePet("pet-1", harness.requestContext()),
      ).rejects.toMatchObject({ response: "PET_DELETE_FAILED" });
    });
  });
});
