import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Database-backed counterpart of CatalystStaticProductRecord.
 * Registered on the plugin's primary database connection (no @PluginDatabaseConnection needed).
 */
@Entity({ name: 'product', schema: 'public' })
export class CatalystStaticProductEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ name: 'identifier', type: 'varchar', length: 64, unique: true })
    identifier?: string;

    @Column({ name: 'slug', type: 'varchar', length: 255, unique: true })
    slug?: string;

    @Column({ name: 'sku', type: 'varchar', length: 64 })
    sku?: string;

    @Column({ name: 'name', type: 'varchar', length: 255 })
    name?: string;

    @Column({ name: 'description', type: 'varchar', length: 1024, nullable: true })
    description?: string;

    /** numeric columns come back from pg as strings, which matches the Money model (no rounding issues). */
    @Column({ name: 'price', type: 'numeric', precision: 12, scale: 2 })
    price?: string;

    @Column({ name: 'list_price', type: 'numeric', precision: 12, scale: 2, nullable: true })
    listPrice?: string;

    @Column({ name: 'category', type: 'varchar', length: 128, nullable: true })
    category?: string;
}
