import { CommercetoolsAttribute, CommercetoolsProductType } from "./schema/commercetools.product.schema";
import { CommercetoolsProductDatasource } from "./commercetools.product.datasource";
import { BaseRegistry } from "@registry";

export class CommercetoolsProductTypeRegistry extends BaseRegistry {
    private data: Record<string, CommercetoolsProductType> = {};

    private facetableAttributes: Record<string, CommercetoolsAttribute> = {};

    protected async load() {
        const methodname = `${CommercetoolsProductTypeRegistry.name}.load`;

        const dsProductTypes = await this.fetchData();

        const facetableAttributesMap: Record<string, CommercetoolsAttribute> = {};

        if (dsProductTypes?.length > 0) {
            const productTypeMap: Record<string, CommercetoolsProductType> = {};

            dsProductTypes.forEach((dsProductType) => {
                productTypeMap[dsProductType.id] = dsProductType;

                dsProductType._attributeMap = {};

                dsProductType.attributes.forEach((dsAttribute) => {
                    dsProductType._attributeMap[dsAttribute.name] = dsAttribute;

                    if (dsAttribute.isSearchable) {
                        dsAttribute._facetId = `variants.attributes.${dsAttribute.name}`;
                        facetableAttributesMap[dsAttribute._facetId] = dsAttribute;
                    }
                });
            });

            this.data = productTypeMap;
            this.facetableAttributes = facetableAttributesMap;

            this.logger.info(`${methodname} - Loaded registry [${this.registryId}]: ${this.logger.formatJSON(this.data)}`);
        }
    }

    protected async fetchData() {
        const methodname = `${CommercetoolsProductTypeRegistry.name}.fetchData`;

        const ds = this.getDatasource<CommercetoolsProductDatasource>(this.defaultConsumerId, CommercetoolsProductDatasource);

        let dsProductTypes: CommercetoolsProductType[];

        try {
            dsProductTypes = await ds.getProductTypesCompleteResultSet({ consumer: this.defaultConsumerId });
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching product types: ${this.logger.formatJSON(error)}`);
        }

        return dsProductTypes;
    }

    getRegistryData() {
        return this.data;
    }

    getProductType(id: string) {
        return this.data[id];
    }

    getProductTypeAttributes(id: string) {
        return this.data[id]?._attributeMap;
    }

    getFacetableAttributes() {
        return this.facetableAttributes;
    }

    getFacetableAttribute(id: string) {
        return this.facetableAttributes[id];
    }
}
