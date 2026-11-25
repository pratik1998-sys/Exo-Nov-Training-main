import { QuoteResultSetQuery, QuoteResultSetQueryType } from "./quote.result-set.query.model";
import { BaseFeatureController } from "@feature/controller";

export class QuoteController extends BaseFeatureController {
    protected processResultSetQuery(query: QuoteResultSetQuery): QuoteResultSetQueryType {
        const rQuery = super.processResultSetQuery(query) as QuoteResultSetQueryType;

        rQuery.filter = {
            item: {
                ids: [],
                identifiers: [],
                slugs: [],
            },
        };

        this.addItemIdentifierToResultSetQuery(query.itemIdentifiers, rQuery.filter.item.identifiers);
        this.addItemIdentifierToResultSetQuery(query.itemIds, rQuery.filter.item.ids);
        this.addItemIdentifierToResultSetQuery(query.itemSlugs, rQuery.filter.item.slugs);

        return rQuery;
    }
}
