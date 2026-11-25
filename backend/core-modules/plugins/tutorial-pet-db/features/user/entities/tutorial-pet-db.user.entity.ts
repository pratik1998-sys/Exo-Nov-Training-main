import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class DBTutorialPetUserEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ name: 'identifier' })
    identifier?: string;

    @Column({ name: 'username' })
    username?: string;

    @Column({ name: 'password' })
    password?: string;

    @Column({ name: 'type' })
    type?: string;

    @Column({ name: 'firstname' })
    firstName?: string;

    @Column({ name: 'middlename' })
    middleName?: string;

    @Column({ name: 'lastname' })
    lastName?: string;

    @Column({ name: 'email' })
    email?: string;

    @Column({ name: 'phone' })
    phone?: string;

    @Column({ name: 'roles' })
    roles?: string;

    @Column({ name: 'can_edit' })
    canEdit?: boolean;
}
