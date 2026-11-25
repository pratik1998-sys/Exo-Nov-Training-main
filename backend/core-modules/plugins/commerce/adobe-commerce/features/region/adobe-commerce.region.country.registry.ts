import { RequestContext } from "@context/request";
import { Country, CountryResultSet, State } from "@feature-region";
import { AdobeCommerceRegionDatasource } from "./adobe-commerce.region.datasource";
import { AdobeCommerceRegionMapper } from "./adobe-commerce.region.mapper";
import { BaseRegistry } from "@registry";

class RegionCountryRegistryCountry extends Country {
    stateMap?: Record<string, State>;
}

export class AdobeCommerceRegionCountryRegistry extends BaseRegistry {
    private consumerLocaleCountryMap: Record<string, Record<string, Record<string, RegionCountryRegistryCountry>>> = {};
    private consumerLocaleCountryResultSet: Record<string, Record<string, CountryResultSet>> = {};

    protected async load() {
        const methodname = `${AdobeCommerceRegionCountryRegistry.name}.load`;

        await this.fetchData();

        this.logger.info(`${methodname} - Loaded region country registry with data: ${this.logger.formatJSON(this.consumerLocaleCountryMap)}`);
    }

    protected async fetchData() {
        const methodname = `${AdobeCommerceRegionCountryRegistry.name}.fetchData`;

        for await (const consumer of Object.values(this.plugin.configuration.configuredConsumers)) {
            this.consumerLocaleCountryMap[consumer.id] = {};
            this.consumerLocaleCountryResultSet[consumer.id] = {};

            for await (const locale of Object.keys(consumer.configuration.locales)) {
                this.consumerLocaleCountryMap[consumer.id][locale] = {};
                this.consumerLocaleCountryResultSet[consumer.id][locale] = {
                    pagination: {
                        page: 1,
                        pageSize: 0,
                        pageCount: 1,
                        hasMorePages: false,
                        resultCount: 0,
                    },
                };

                //const countries = await this.getService<RegionService>(consumer.id, RegionService).getCountries(null, { consumer: consumer.id, locale: locale });

                let dsCountries = [];

                const requestContext: RequestContext = { consumer: consumer.id, locale: locale };

                try {
                    dsCountries = await this.getDatasource<AdobeCommerceRegionDatasource>(consumer.id, AdobeCommerceRegionDatasource).getCountries(requestContext);
                } catch (error) {
                    this.logger.info(`${methodname} - Error fetching countries: ${error}`);
                }

                const countries = this.getMapper<AdobeCommerceRegionMapper>(consumer.id, AdobeCommerceRegionMapper).mapCountryResultSet(requestContext, dsCountries);

                this.consumerLocaleCountryResultSet[consumer.id][locale] = countries;

                countries.results.forEach((country) => {
                    this.consumerLocaleCountryMap[consumer.id][locale][country.identifier] = country;
                    this.consumerLocaleCountryMap[consumer.id][locale][country.identifier].stateMap = {};

                    country.states?.forEach((state) => {
                        this.consumerLocaleCountryMap[consumer.id][locale][country.identifier].stateMap[state.identifier] = state;
                    });
                });
            }
        }
    }

    getRegistryData() {
        return this.consumerLocaleCountryMap;
    }

    getCountryResultSet(consumerId: string, locale: string): CountryResultSet {
        return this.consumerLocaleCountryResultSet[consumerId]?.[locale] ?? null;
    }

    getCountry(consumerId: string, locale: string, countryCode: string): RegionCountryRegistryCountry {
        return this.consumerLocaleCountryMap[consumerId]?.[locale]?.[countryCode];
    }

    getCountryState(consumerId: string, locale: string, countryCode: string, stateCode: string): RegionCountryRegistryCountry {
        return this.consumerLocaleCountryMap[consumerId]?.[locale]?.[countryCode]?.stateMap[stateCode];
    }
}
