import { PluginConsumerConfiguration } from "@configuration/types";
import { RequestContext } from "@context/request";
import { Country, State } from "@feature-region";
import { GetCountries, GetCountryRegions } from "@plugin-sap-commerce/common";
import { SAPCommerceRegionDatasource } from "./sap-commerce.region.datasource";
import { BaseRegistry } from "@registry";
import { StringUtility } from "@utilities";

class RegionCountryRegistryCountry extends Country {
    stateMap?: Record<string, State>;
}

export class SAPCommerceRegionCountryRegistry extends BaseRegistry {
    private consumerCountryMap: Record<string, Record<string, RegionCountryRegistryCountry>> = {};

    protected async load() {
        const methodname = `${SAPCommerceRegionCountryRegistry.name}.load`;

        await this.fetchData();

        this.logger.info(`${methodname} - Loaded region country registry with data: ${this.logger.formatJSON(this.consumerCountryMap)}`);
    }

    //TODO - handle localization?
    protected async fetchData() {
        const methodname = `${SAPCommerceRegionCountryRegistry.name}.fetchData`;

        const consumerCountryMap = {};

        const async = [];

        Object.values(this.plugin.configuration.configuredConsumers).forEach((consumer) => {
            async.push(this.fetchConsumerCountries(consumer, consumerCountryMap));
        });

        await Promise.all(async);

        this.consumerCountryMap = consumerCountryMap;
    }

    protected async fetchConsumerCountries(consumer: PluginConsumerConfiguration, consumerCountryMap: Record<string, Record<string, RegionCountryRegistryCountry>>) {
        const methodname = `${SAPCommerceRegionCountryRegistry.name}.fetchConsumerCountries`;

        consumerCountryMap[consumer.id] = {};

        if (!consumer.configuration.countries || consumer.configuration.countries.length == 0) {
            this.logger.info(`${methodname} - Warning: No countries configured for consumer [${consumer.id}]`);
        } else if (StringUtility.isStringNotEmpty(consumer.configuration.siteId)) {
            const requestContext: RequestContext = { consumer: consumer.id };

            let dsCountryResults: GetCountries.Response._200 = null;

            try {
                dsCountryResults = await this.getDatasource<SAPCommerceRegionDatasource>(consumer.id, SAPCommerceRegionDatasource).getCountries(requestContext);
            } catch (error) {
                this.logger.info(`${methodname} - Error fetching site [${consumer.configuration.siteId}] countries: ${this.logger.formatJSON(error)}`);
            }

            const async = [];

            dsCountryResults?.countries?.forEach((dsCountry) => {
                if (consumer.configuration.countries.includes(dsCountry.isocode)) {
                    consumerCountryMap[consumer.id][dsCountry.isocode] = {
                        id: dsCountry.isocode,
                        identifier: dsCountry.isocode,
                        code: dsCountry.isocode,
                        name: dsCountry.name,
                        description: dsCountry.name,
                        states: [],
                        stateMap: {},
                    };

                    async.push(this.fetchCountryRegions(requestContext, consumerCountryMap[consumer.id][dsCountry.isocode]));
                }
            });

            await Promise.all(async);
        }
    }

    protected async fetchCountryRegions(requestContext: RequestContext, country: RegionCountryRegistryCountry) {
        const methodname = `${SAPCommerceRegionCountryRegistry.name}.fetchCountryRegions`;

        let dsCountryRegionResults: GetCountryRegions.Response._200 = null;

        try {
            dsCountryRegionResults = await this.getDatasource<SAPCommerceRegionDatasource>(requestContext.consumer, SAPCommerceRegionDatasource).getCountryRegions(requestContext, country.id);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching country [${country.id}] regions: ${this.logger.formatJSON(error)}`);
        }

        dsCountryRegionResults?.regions?.forEach((dsRegion) => {
            const state: State = {
                id: dsRegion.isocode,
                identifier: dsRegion.isocode,
                code: dsRegion.isocode,
                name: dsRegion.name,
                description: dsRegion.name,
            };

            country.states.push(state);

            country.stateMap[state.id] = state;
        });
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
