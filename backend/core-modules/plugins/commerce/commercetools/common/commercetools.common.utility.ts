import { RequestContext } from "@context/request";
import { StringUtility } from "@utilities";

export interface CommercetoolsIdVersion {
    id?: string;
    version?: number;
}

export class CommercetoolsUtility {
    protected static idVersionDelimiter = '?version=';

    static resolveIdAndVersionFromId(requestContext: RequestContext, id: string): CommercetoolsIdVersion {
        let obj: CommercetoolsIdVersion = {};

        if (StringUtility.isStringNotEmpty(id)) {
            const arr = id.split(this.idVersionDelimiter);

            obj = {
                id: arr[0],
            };

            if (arr.length == 2) {
                obj.version = parseInt(arr[1]);
            }
        }

        return obj;
    }
}
