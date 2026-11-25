import { AppConfigurationKeys } from "@configuration/app";
import { RequestContext } from "@context/request";
import { Country, CountryResultSet, State } from "@feature-region";
import { HCLCommerceRegionDatasource, } from "./hcl-commerce.region.datasource";
import { HCLCommerceRegionMapper } from "./hcl-commerce.region.mapper";
import { HCLCommerceCountriesStates } from "./types/hcl-commerce.region.type";
import { BaseRegistry } from "@registry";


class RegionCountryRegistryCountry extends Country {
    stateMap?: Record<string, State>;
}

export class HCLCommerceRegionCountryRegistry extends BaseRegistry {
    private consumerLocaleCountryMap: Record<string, Record<string, Record<string, RegionCountryRegistryCountry>>> = {};
    private consumerLocaleCountryResultSet: Record<string, Record<string, CountryResultSet>> = {};

    protected async load() {
        const methodname = `${HCLCommerceRegionCountryRegistry.name}.load`;

        await this.fetchData();

        this.logger.info(`${methodname} - Loaded region country registry with data: ${this.logger.formatJSON(this.consumerLocaleCountryMap)}`);
    }

    protected async fetchData() {
        const methodname = `${HCLCommerceRegionCountryRegistry.name}.fetchData`;

        for await (const consumer of Object.values(this.plugin.configuration.configuredConsumers)) {
            this.consumerLocaleCountryMap[consumer.id] = {};
            this.consumerLocaleCountryResultSet[consumer.id] = {};

            const locales: { id: string }[] = this.configService.get(AppConfigurationKeys.locales);

            for await (const locale of locales) {
                this.consumerLocaleCountryMap[consumer.id][locale.id] = {};
                this.consumerLocaleCountryResultSet[consumer.id][locale.id] = {
                    pagination: {
                        page: 1,
                        pageSize: 0,
                        pageCount: 1,
                        hasMorePages: false,
                        resultCount: 0,
                    },
                };

                //const countries = await this.getService<RegionService>(consumer.id, RegionService).getCountries(null, { consumer: consumer.id, locale: locale });

                let dsCountries: HCLCommerceCountriesStates = null;

                const requestContext: RequestContext = { consumer: consumer.id, locale: locale.id };

                try {
                    dsCountries = await this.getDatasource<HCLCommerceRegionDatasource>(consumer.id, HCLCommerceRegionDatasource).getCountries(requestContext);
                } catch (error) {
                    this.logger.info(`${methodname} - Error fetching countries: ${error}`);
                }

                const countries = this.getMapper<HCLCommerceRegionMapper>(consumer.id, HCLCommerceRegionMapper).mapCountryResultSet(requestContext, dsCountries.countries);

                this.consumerLocaleCountryResultSet[consumer.id][locale.id] = countries;

                countries.results.forEach((country) => {
                    this.consumerLocaleCountryMap[consumer.id][locale.id][country.identifier] = country;
                    this.consumerLocaleCountryMap[consumer.id][locale.id][country.identifier].stateMap = {};

                    country.states?.forEach((state) => {
                        this.consumerLocaleCountryMap[consumer.id][locale.id][country.identifier].stateMap[state.identifier] = state;
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
