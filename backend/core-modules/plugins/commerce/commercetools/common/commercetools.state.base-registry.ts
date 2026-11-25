import { CommercetoolsState } from "./schema/commercetools.common.type";
import { BaseRegistry } from "@registry";

export abstract class CommercetoolsStateBaseRegistry extends BaseRegistry {
    private data: Record<string, CommercetoolsState> = {};
    private states: CommercetoolsState[] = [];

    protected async load() {
        const methodname = `${CommercetoolsStateBaseRegistry.name}.load`;

        const dsOrderStates: CommercetoolsState[] = await this.fetchData();

        if (dsOrderStates?.length > 0) {
            const stateMap: Record<string, CommercetoolsState> = {};

            dsOrderStates.forEach((dsOrderState) => {
                stateMap[dsOrderState.id] = dsOrderState;
            });

            this.data = stateMap;
            this.states = Object.values(stateMap);

            this.logger.info(`${methodname} - Loaded registry [${this.registryId}]: ${this.logger.formatJSON(this.data)}`);
        }
    }

    getRegistryData() {
        return this.data;
    }

    getStates() {
        return this.states;
    }

    getState(id: string) {
        return this.data[id];
    }
}
