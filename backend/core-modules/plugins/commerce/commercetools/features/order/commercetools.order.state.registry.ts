import { CommercetoolsStateBaseRegistry, CommercetoolsStateResultSet } from "@plugin-commercetools/common";
import { CommercetoolsOrderDatasource } from "@plugin-commercetools/features/order";

export class CommercetoolsOrderStateRegistry extends CommercetoolsStateBaseRegistry {
    protected async fetchData() {
        const methodname = `${CommercetoolsOrderStateRegistry.name}.fetchData`;

        const ds = this.getDatasource<CommercetoolsOrderDatasource>(this.defaultConsumerId, CommercetoolsOrderDatasource);

        let dsStateResultSet: CommercetoolsStateResultSet;

        try {
            dsStateResultSet = await ds.getOrderStates({ consumer: this.defaultConsumerId });
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching order states: ${this.logger.formatJSON(error)}`);
        }

        return dsStateResultSet.results;
    }
}
