import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pet')
export class DBTutorialPetPetEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ name: 'identifier' })
    identifier?: string;

    @Column({ name: 'user_identifier' })
    userIdentifier?: string;

    @Column({ name: 'firstname' })
    firstName?: string;

    @Column({ name: 'middlename' })
    middleName?: string;

    @Column({ name: 'lastname' })
    lastName?: string;

    @Column({ name: 'breed' })
    breed?: string;

    @Column({ name: 'height' })
    height?: string;

    @Column({ name: 'weight' })
    weight?: string;

    @Column({ name: 'thumbnail' })
    thumbnail?: string;

    @Column({ name: 'type' })
    type?: string;

    @Column({ name: 'can_edit' })
    canEdit?: boolean;
}
