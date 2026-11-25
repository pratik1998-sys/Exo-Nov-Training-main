import { RequestContext } from "@context/request";
import { ItemCollectionCoupon } from "@feature-commerce/common";
import { Product } from "@feature-commerce/product";
import { AdobeCommerceBaseMapper } from "@plugin-adobe-commerce/common";
import { AdobeCommerceProduct, AdobeCommerceProductMapper } from "@plugin-adobe-commerce/features/product";
import { AdobeCommerceAppliedCoupon } from "./schema/adobe-commerce.quote.schema";

export class AdobeCommerceQuoteMapper extends AdobeCommerceBaseMapper {
    mapAppliedCoupons(requestContext: RequestContext, dsAppliedCoupons: AdobeCommerceAppliedCoupon[]) {
        return dsAppliedCoupons ? dsAppliedCoupons.map((dsAppliedCoupon) => this.mapAppliedCoupon(requestContext, dsAppliedCoupon)) : [];
    }

    mapAppliedCoupon(requestContext: RequestContext, dsAppliedCoupon: AdobeCommerceAppliedCoupon): ItemCollectionCoupon {
        return dsAppliedCoupon ?
            {
                id: dsAppliedCoupon.code,
                identifier: dsAppliedCoupon.code,
                code: dsAppliedCoupon.code,
            }
            : {};
    }

    mapItemProduct(requestContext: RequestContext, dsProduct: AdobeCommerceProduct): Product {
        const productMapper = this.getMapper<AdobeCommerceProductMapper>(requestContext, AdobeCommerceProductMapper);

        const product = productMapper.mapProduct(requestContext, dsProduct);

        return product;
    }
}
