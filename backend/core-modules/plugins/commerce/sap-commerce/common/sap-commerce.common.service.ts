import { RequestContext } from "@context/request";
import { AddressInput } from "@feature-address";
import { SAPCommerceConsumerConfiguration } from "./types/sap-commerce.configuration.type";
import { BaseDatasourcePluginServiceImpl } from "@plugin/service";

export class SAPCommerceBaseServiceImpl extends BaseDatasourcePluginServiceImpl {
    /**
     * TODO - This probably is incorrect as it's untested -
     * @param requestContext
     * @param addressInput
     * @returns
     */
    protected translateSAPCommerceAddressInput(requestContext: RequestContext, addressInput: AddressInput) {
        return addressInput ?
            {
                firstName: addressInput.firstName,
                lastName: addressInput.lastName,
                line1: addressInput.line1,
                line2: addressInput.line2,
                town: addressInput.city,
                region: {
                    name: addressInput.state,
                },
                postalCode: addressInput.postalCode,
                country: {
                    isocode: addressInput.country,
                },
                pohone: addressInput.phone,
            }
            : {};
    }

    protected isB2B(requestContext: RequestContext) {
        const { configuration } = this.getPluginConsumerConfiguration<SAPCommerceConsumerConfiguration>(requestContext);

        return configuration.isB2B;
    }
}
