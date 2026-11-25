import { RequestContext } from "@context/request";
import { Category, CategoryResultSet } from "@feature-commerce/category";
import { CommercetoolsBaseMapper, CommercetoolsConsumerConfiguration } from "@plugin-commercetools/common";
import { CommercetoolsCategory, CommercetoolsCategoryResultSet } from "./schema/commercetools.category.schema";
import { StringUtility } from "@utilities";

export class CommercetoolsCategoryMapper extends CommercetoolsBaseMapper {
    mapResultSet(requestContext: RequestContext, dsResultSet: CommercetoolsCategoryResultSet): CategoryResultSet {
        dsResultSet.results = dsResultSet.results.sort((a, b) => {
            return parseFloat(a.orderHint) - parseFloat(b.orderHint);
        });

        return {
            pagination: this.mapLimitOffsetPagination(requestContext, { limit: dsResultSet.limit, offset: dsResultSet.offset }, dsResultSet.total),
            results: dsResultSet.results.map((dsResult) => this.mapResultSetEntity(requestContext, dsResult)),
        };
    }

    mapResultSetEntity(requestContext: RequestContext, dsCategory: CommercetoolsCategory): Category {
        return this.mapCategory(requestContext, dsCategory);
    }

    mapCategories(requestContext: RequestContext, dsCategories: CommercetoolsCategory[]): Category[] {
        return dsCategories?.length > 0 ? dsCategories.map((dsCategory) => this.mapCategory(requestContext, dsCategory)) : [];
    }

    mapCategory(requestContext: RequestContext, dsCategory: CommercetoolsCategory): Category {
        const category: Category = {
            id: dsCategory.id,
            slug: this.resolveLocaleFieldValue(requestContext, dsCategory.slug),
            identifier: dsCategory.key,
            name: this.resolveLocaleFieldValue(requestContext, dsCategory.name),
            description: this.resolveLocaleFieldValue(requestContext, dsCategory.description),
            children: dsCategory.children?.length > 0 ? dsCategory.children.map((dsChildCategory) => this.mapCategory(requestContext, dsChildCategory)) : [],
        };

        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext);

        if (StringUtility.isStringNotEmpty(configuration.categoryImageField) && dsCategory.custom?.fields?.[configuration.categoryImageField]) {
            const imageUrl = dsCategory.custom.fields[configuration.categoryImageField];
            category.images = [{
                url: imageUrl,
            }];

            category.thumbnail = {
                url: imageUrl,
            };
        }

        return category;
    }
}
