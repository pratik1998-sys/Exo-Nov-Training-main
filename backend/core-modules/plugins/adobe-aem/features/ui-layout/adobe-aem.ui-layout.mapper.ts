import { RequestContext } from "@context/request";
import { UILayout } from "@feature-ui-layout";

export class UILayoutMapper {
    protected static readonly layoutKeys = {
        path: ':path',
        items: ':items',
        itemsOrder: ':itemsOrder',
        type: ':type',
    };

    static mapUILayout(requestContext: RequestContext, result: any): UILayout {
        const uiLayout = new UILayout();
        if (!result) {
            uiLayout.data = null;
            uiLayout.rows = [];
            return uiLayout;
        }
        const mappedRows = this.mapUILayoutItem(requestContext, result);

        uiLayout.data = {
            path: result[UILayoutMapper.layoutKeys.path],
            items: mappedRows,
        };
        uiLayout.rows = mappedRows;

        return uiLayout;
    }

    private static mapUILayoutItem(requestContext: RequestContext, item: any) {
        let layoutItems: any = [];

        const items = item[UILayoutMapper.layoutKeys.items];

        const keys = item[UILayoutMapper.layoutKeys.itemsOrder];

        if (keys) {
            layoutItems = keys.map((key) => {
                const layoutItem = items[key];

                const obj: any = {
                    type: layoutItem[UILayoutMapper.layoutKeys.type] || 'generic',
                    id: key,
                };

                if (layoutItem[UILayoutMapper.layoutKeys.items]) {
                    obj.items = this.mapUILayoutItem(requestContext, layoutItem);
                } else {
                    obj.data = { ...layoutItem };
                    delete obj.data[UILayoutMapper.layoutKeys.type];
                }

                return obj;
            });
        }

        return layoutItems;
    }
}
