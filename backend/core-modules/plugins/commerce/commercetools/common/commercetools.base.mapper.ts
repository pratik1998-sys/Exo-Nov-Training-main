import { RequestContext } from "@context/request";
import { Image, Money } from "@feature-shared-models";
import { ResultSet } from "@feature/models";
import { CommercetoolsEntity, CommercetoolsImage, CommercetoolsLocaleField, CommercetoolsMoney, CommercetoolsResultSet } from "./schema/commercetools.common.type";
import { BaseMapper } from "@plugin/mapper";


export abstract class CommercetoolsBaseMapper extends BaseMapper {
    abstract mapResultSetEntity(requestContext: RequestContext, dsEntity: CommercetoolsEntity);

    mapResultSet(requestContext: RequestContext, dsResultSet: CommercetoolsResultSet): ResultSet {
        return {
            pagination: this.mapLimitOffsetPagination(requestContext, { limit: dsResultSet.limit, offset: dsResultSet.offset }, dsResultSet.total),
            results: dsResultSet.results.map((dsResult) => this.mapResultSetEntity(requestContext, dsResult)),
        };
    }

    protected mapImages(requestContext: RequestContext, dsImages: CommercetoolsImage[]): Image[] {
        return dsImages ? dsImages.map((dsImage) => this.mapImage(requestContext, dsImage)) : [];
    }

    protected mapImage(requestContext: RequestContext, dsImage: CommercetoolsImage): Image {
        return dsImage ?
            {
                url: dsImage.url,
                altText: dsImage.label,
            }
            : {};
    }

    protected mapMoney(requestContext: RequestContext, dsMoney: CommercetoolsMoney): Money {
        if (dsMoney) {
            var divisor = dsMoney.fractionDigits > 0 ? 10 ** dsMoney.fractionDigits : 1;

            var centAmount = dsMoney.preciseAmount ? dsMoney.preciseAmount : dsMoney.centAmount;

            return {
                value: (centAmount / divisor).toFixed(2),
                currency: dsMoney.currencyCode,
            };
        } else {
            return null;
        }
    }

    protected resolveLocaleFieldValue(requestContext: RequestContext, localeField: CommercetoolsLocaleField) {
        return localeField ? localeField[requestContext.locale] ?? localeField[requestContext.language] : null;
    }
}
