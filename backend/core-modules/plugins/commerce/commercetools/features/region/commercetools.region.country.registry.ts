
import { BaseRegistry } from "@registry";
import { StringUtility } from "@utilities";
import { RequestContext } from "@context/request";
import { CommercetoolsRegionDatasource } from "./commercetools.region.datasource";
import { CommercetoolsStore } from "@plugin-commercetools/features/store";
import { Country, State } from "@feature-region";

class RegionCountryRegistryCountry extends Country {
    stateMap?: Record<string, State>;
}

export class CommercetoolsRegionCountryRegistry extends BaseRegistry {
    private consumerCountryMap: Record<string, Record<string, RegionCountryRegistryCountry>> = {};

    protected async load() {
        const methodname = `${CommercetoolsRegionCountryRegistry.name}.load`;

        await this.fetchData();

        this.logger.info(`${methodname} - Loaded region country registry with data: ${this.logger.formatJSON(this.consumerCountryMap)}`);
    }

    protected async fetchData() {
        const methodname = `${CommercetoolsRegionCountryRegistry.name}.fetchData`;

        for await (const consumer of Object.values(this.plugin.configuration.configuredConsumers)) {
            this.consumerCountryMap[consumer.id] = {};

            if (StringUtility.isStringNotEmpty(consumer.configuration.storeId)) {
                const requestContext: RequestContext = { consumer: consumer.id };

                let dsStore: CommercetoolsStore;

                try {
                    dsStore = await this.getDatasource<CommercetoolsRegionDatasource>(consumer.id, CommercetoolsRegionDatasource).getStoreByKey(requestContext, consumer.configuration.storeId);
                } catch (error) {
                    this.logger.info(`${methodname} - Error fetching store [${consumer.configuration.storeId}]: ${error}`);
                }

                dsStore.countries.forEach((dsCountry) => {
                    this.consumerCountryMap[consumer.id][dsCountry.code] = {
                        id: dsCountry.code,
                        identifier: dsCountry.code,
                        code: dsCountry.code,
                        name: dsCountry.code,
                        description: dsCountry.code,
                        states: [],
                        stateMap: {},
                    };
                });
            }
        }
    }

    getRegistryData() {
        return this.consumerCountryMap;
    }

    getCountries(consumerId: string): RegionCountryRegistryCountry[] {
        return this.consumerCountryMap[consumerId] ? Object.values(this.consumerCountryMap[consumerId]) : [];
    }

    getCountry(consumerId: string, countryCode: string): RegionCountryRegistryCountry {
        return this.consumerCountryMap[consumerId]?.[countryCode];
    }

    getCountryState(consumerId: string, countryCode: string, stateCode: string): RegionCountryRegistryCountry {
        return this.consumerCountryMap[consumerId]?.[countryCode]?.stateMap[stateCode];
    }
}
