import { Column, Entity, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity('address')
export class DBTutorialPetAddressEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'identifier' })
    identifier: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'street1' })
    street1: string;

    @Column({ name: 'street2' })
    street2: string;

    @Column({ name: 'street3' })
    street3: string;

    @Column({ name: 'city' })
    city: string;

    @Column({ name: 'state' })
    state: string;

    @Column({ name: 'zipcode' })
    zipcode: string;

    @Column({ name: 'country' })
    country: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'phone' })
    phone: string;

    @Column({ name: 'type' })
    type: string;

    @Column({ name: 'can_edit' })
    canEdit: boolean;
}
