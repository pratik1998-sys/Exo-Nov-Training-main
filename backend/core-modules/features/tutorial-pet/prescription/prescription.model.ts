import { ObjectType, InputType } from '@nestjs/graphql';
import { Pharmacy } from '../pharmacy/pharmacy.model';
import { Veterinarian } from '../veterinarian/veterinarian.model';
import { Pet } from '../pet/pet.model';
import { Field, FieldType } from '@api-decorators';
import { ResultSetQuery } from '@feature/controller/models';
import { ResultSet } from '@feature/models';

const { integer } = FieldType;

@InputType({ description: 'Prescription Filter Input' })
export class PrescriptionFilterInput {
    @Field({ type: () => [String], description: 'status' })
    status?: string[];

    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];
}

@InputType({ description: 'Prescription Input' })
export class PrescriptionInput {
    @Field({ description: 'type' })
    type?: string;

    @Field({ description: 'veterinarian identifier' })
    veterinarianIdentifier?: string;

    @Field({ description: 'pet identifier' })
    petIdentifier?: string;

    @Field({ description: 'pharmacy identifier' })
    pharmacyIdentifier?: string;

    @Field({ description: 'description' })
    description?: string;

    @Field({ description: 'prescription' })
    prescription?: string;

    @Field({ description: 'status' })
    status?: string;

    @Field({ description: 'refill count' }, integer)
    refillCount?: number;
}

@ObjectType({ description: 'Prescription' })
export class Prescription {
    @Field({ description: 'id' }, integer)
    id?: string;

    @Field({ description: 'identifier' })
    identifier?: string;

    @Field({ description: 'description' })
    description?: string;

    @Field({ description: 'prescription' })
    prescription?: string;

    @Field({ description: 'type' })
    type?: string;

    @Field({ type: () => Veterinarian, description: 'veterinarian' })
    veterinarian?: Veterinarian;

    @Field({ type: () => Pet, description: 'pet' })
    pet?: Pet;

    @Field({ type: () => Pharmacy, description: 'pharmacy' })
    pharmacy?: Pharmacy;

    @Field({ description: 'status' })
    status?: string;

    @Field({ description: 'refill count' }, integer)
    refillCount?: number;
}

@ObjectType({ description: 'Prescription Result Set' })
export class PrescriptionResultSet extends ResultSet<Prescription> {
    @Field({ type: () => [Prescription], description: 'prescription results' })
    results?: Prescription[];
}

export class PrescriptionResultSetQuery extends ResultSetQuery {
    @Field({ type: () => [String], description: 'status' })
    status?: string[];

    @Field({ type: () => [String], description: 'identifiers' })
    identifiers?: string[];
}
