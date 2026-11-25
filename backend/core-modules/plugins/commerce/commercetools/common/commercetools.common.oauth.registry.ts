import { CommercetoolsBaseDatasource } from "@plugin-commercetools/common";
import { CommercetoolsGetTokenResponse } from "./schema/commercetools.common.type";
import { BaseRegistry } from "@registry";

export class CommercetoolsOAuthRegistry extends BaseRegistry {
    private data: { adminClient: CommercetoolsGetTokenResponse; client: CommercetoolsGetTokenResponse };

    protected async load() {
        const methodname = `${CommercetoolsOAuthRegistry.name}.load`;

        const [adminClient, client] = await this.fetchData();

        this.data = {
            adminClient,
            client,
        };
    }

    protected async fetchData(): Promise<CommercetoolsGetTokenResponse[]> {
        const methodname = `${CommercetoolsOAuthRegistry.name}.fetchData`;

        const ds = this.getDatasource<CommercetoolsBaseDatasource>(this.defaultConsumerId, CommercetoolsBaseDatasource);

        const async = [ds.getClientToken({ consumer: this.defaultConsumerId }, false), ds.getClientToken({ consumer: this.defaultConsumerId }, true)];

        let dsResults: CommercetoolsGetTokenResponse[];

        try {
            dsResults = await Promise.all(async);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching client tokens: ${error}`);
        }

        return dsResults;
    }

    getRegistryData() {
        return this.data;
    }

    getAdminClientAccessToken() {
        return this.data.adminClient?.access_token;
    }

    getClientAccessToken() {
        return this.data.client?.access_token;
    }
}
