import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Pet, PetFilterInput, PetInput, PetResultSet } from "./pet.model";
import type { PaginationInput } from "@feature/models";

import { FeatureResolverTestHarness } from "@feature/testing";
import { PetResolver } from "./pet.resolver";
import { PetService } from "./pet.service";

describe("PetResolver", () => {
  let harness: FeatureResolverTestHarness;
  let resolver: PetResolver;
  let mockPetService: {
    getPets: ReturnType<typeof vi.fn>;
    getPet: ReturnType<typeof vi.fn>;
    createPet: ReturnType<typeof vi.fn>;
    updatePet: ReturnType<typeof vi.fn>;
    deletePet: ReturnType<typeof vi.fn>;
  };

  function buildContext(overrides?: Partial<{ requestContext: unknown }>) {
    const requestContext = harness.requestContext(overrides as any);
    return { raw: { requestContext } };
  }

  beforeEach(async () => {
    harness = await FeatureResolverTestHarness.create({
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

    resolver = harness.createResolver(PetResolver, { service: mockPetService });
  });

  describe("pets", () => {
    it("returns result set from service.getPets", async () => {
      const filter: PetFilterInput = {};
      const pagination: PaginationInput = { page: 1, pageSize: 10 };
      const resultSet: PetResultSet = {
        results: [{ id: "1", identifier: "pet-1", firstName: "Rex" } as Pet],
        pagination: { page: 1, pageSize: 10, resultCount: 1, pageCount: 1, hasMorePages: false },
      };
      mockPetService.getPets.mockResolvedValue(resultSet);

      const context = buildContext();
      const result = await resolver.pets(filter, pagination, context);

      expect(mockPetService.getPets).toHaveBeenCalledWith(
        filter,
        pagination,
        expect.any(Object),
        context,
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

      const context = buildContext();
      const result = await resolver.pet("pet-1", context);

      expect(mockPetService.getPet).toHaveBeenCalledWith(
        "pet-1",
        expect.any(Object),
        context,
      );
      expect(result).toEqual(pet);
    });
  });

  describe("petCreate", () => {
    it("returns created pet from service.createPet", async () => {
      const petInput: PetInput = { firstName: "Rex", lastName: "Doe" };
      const created: Pet = { id: "1", identifier: "pet-1", ...petInput } as Pet;
      mockPetService.createPet.mockResolvedValue(created);

      const context = buildContext();
      const result = await resolver.petCreate(petInput, context);

      expect(mockPetService.createPet).toHaveBeenCalledWith(
        petInput,
        expect.any(Object),
        context,
      );
      expect(result).toEqual(created);
    });
  });

  describe("petUpdate", () => {
    it("returns updated pet from service.updatePet", async () => {
      const petInput: PetInput = { firstName: "Rex Updated" };
      const updated: Pet = { id: "1", identifier: "pet-1", ...petInput } as Pet;
      mockPetService.updatePet.mockResolvedValue(updated);

      const context = buildContext();
      const result = await resolver.petUpdate("pet-1", petInput, context);

      expect(mockPetService.updatePet).toHaveBeenCalledWith(
        "pet-1",
        petInput,
        expect.any(Object),
        context,
      );
      expect(result).toEqual(updated);
    });
  });

  describe("petDelete", () => {
    it("returns deleted pet from service.deletePet", async () => {
      const deleted: Pet = { id: "1", identifier: "pet-1" } as Pet;
      mockPetService.deletePet.mockResolvedValue(deleted);

      const context = buildContext();
      const result = await resolver.petDelete("pet-1", context);

      expect(mockPetService.deletePet).toHaveBeenCalledWith(
        "pet-1",
        expect.any(Object),
        context,
      );
      expect(result).toEqual(deleted);
    });
  });
});
