import { CommercetoolsCategory } from "./schema/commercetools.category.schema";
import { BaseRegistry } from "@registry";
import { CommercetoolsCategoryDatasource } from "./commercetools.category.datasource";

export class CommercetoolsCategoryRegistry extends BaseRegistry {
    private data: Record<string, CommercetoolsCategory> = {};

    protected async load() {
        const methodname = `${CommercetoolsCategoryRegistry.name}.load`;

        const dsCategories = await this.fetchData();

        if (dsCategories?.length > 0) {
            const map: Record<string, CommercetoolsCategory> = {};

            dsCategories.forEach((dsCategory) => {
                map[dsCategory.id] = dsCategory;
            });

            this.data = map;
        }

        this.logger.info(`${methodname} - Loaded registry [${this.registryId}]: ${this.logger.formatJSON(this.data)}`);
    }

    protected async fetchData() {
        const methodname = `${CommercetoolsCategoryRegistry.name}.fetchData`;

        const ds = this.getDatasource<CommercetoolsCategoryDatasource>(this.defaultConsumerId, CommercetoolsCategoryDatasource);

        let dsCategories: CommercetoolsCategory[];

        try {
            dsCategories = await ds.getCategoryCompleteResultSet({ consumer: this.defaultConsumerId });
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching categories: ${this.logger.formatJSON(error)}`);
        }

        return dsCategories;
    }

    getRegistryData() {
        return this.data;
    }

    getCategory(id: string) {
        return this.data[id];
    }
}
