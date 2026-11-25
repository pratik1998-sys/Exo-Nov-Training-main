import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Pet, PetFilterInput, PetInput, PetResultSet, PetResultSetQuery } from "./pet.model";

import { FeatureControllerTestHarness } from "@feature/testing";
import { PetController } from "./pet.controller";
import { PetService } from "./pet.service";

describe("PetController", () => {
  let harness: FeatureControllerTestHarness;
  let controller: PetController;
  let mockPetService: {
    getPets: ReturnType<typeof vi.fn>;
    getPet: ReturnType<typeof vi.fn>;
    createPet: ReturnType<typeof vi.fn>;
    updatePet: ReturnType<typeof vi.fn>;
    deletePet: ReturnType<typeof vi.fn>;
  };

  function buildRequest(overrides?: Partial<{ requestContext: unknown }>) {
    const requestContext = harness.requestContext(overrides as any);
    return { raw: { requestContext } } as any;
  }

  beforeEach(async () => {
    harness = await FeatureControllerTestHarness.create({
      featureId: "pet",
      consumerIds: ["site-1"],
    });

    mockPetService = {
      getPets: vi.fn(),
      getPet: vi.fn(),
      createPet: vi.fn(),
      updatePet: vi.fn(),
      deletePet: vi.fn(),
    };

    controller = harness.createController(PetController, { service: mockPetService });
  });

  describe("pets", () => {
    it("returns result set from service.getPets", async () => {
      const query: PetResultSetQuery = { page: 1, pageSize: 10 };
      const resultSet: PetResultSet = {
        results: [{ id: "1", identifier: "pet-1", firstName: "Rex" } as Pet],
        pagination: { page: 1, pageSize: 10, resultCount: 1, pageCount: 1, hasMorePages: false },
      };
      mockPetService.getPets.mockResolvedValue(resultSet);

      const request = buildRequest();
      const result = await controller.pets(request, query);

      expect(mockPetService.getPets).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Object),
        request,
      );
      expect(result).toEqual(resultSet);
    });
  });

  describe("pet", () => {
    it("returns pet from service.getPet", async () => {
      const pet: Pet = {
        id: "1",
        identifier: "pet-1",
        firstName: "Rex",
        lastName: "Doe",
      } as Pet;
      mockPetService.getPet.mockResolvedValue(pet);

      const request = buildRequest();
      const result = await controller.pet("pet-1", request);

      expect(mockPetService.getPet).toHaveBeenCalledWith(
        "pet-1",
        expect.any(Object),
        request,
      );
      expect(result).toEqual(pet);
    });
  });

  describe("petCreate", () => {
    it("returns created pet from service.createPet", async () => {
      const petInput: PetInput = { firstName: "Rex", lastName: "Doe" };
      const created: Pet = { id: "1", identifier: "pet-1", ...petInput } as Pet;
      mockPetService.createPet.mockResolvedValue(created);

      const request = buildRequest();
      const result = await controller.petCreate(petInput, request);

      expect(mockPetService.createPet).toHaveBeenCalledWith(
        petInput,
        expect.any(Object),
        request,
      );
      expect(result).toEqual(created);
    });
  });

  describe("petUpdate", () => {
    it("returns updated pet from service.updatePet", async () => {
      const petInput: PetInput = { firstName: "Rex Updated" };
      const updated: Pet = { id: "1", identifier: "pet-1", ...petInput } as Pet;
      mockPetService.updatePet.mockResolvedValue(updated);

      const request = buildRequest();
      const result = await controller.petUpdate("pet-1", petInput, request);

      expect(mockPetService.updatePet).toHaveBeenCalledWith(
        "pet-1",
        petInput,
        expect.any(Object),
        request,
      );
      expect(result).toEqual(updated);
    });
  });

  describe("petDelete", () => {
    it("returns deleted pet from service.deletePet", async () => {
      const deleted: Pet = { id: "1", identifier: "pet-1" } as Pet;
      mockPetService.deletePet.mockResolvedValue(deleted);

      const request = buildRequest();
      const result = await controller.petDelete("pet-1", request);

      expect(mockPetService.deletePet).toHaveBeenCalledWith(
        "pet-1",
        expect.any(Object),
        request,
      );
      expect(result).toEqual(deleted);
    });
  });
});
