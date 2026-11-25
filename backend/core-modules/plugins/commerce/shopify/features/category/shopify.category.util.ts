export class ShopifyCategoryUtility {
    protected static readonly rootCategoryToken: string = ':';

    static getRootCategoryMenuPath(rootCategoryToken: string): string[] {
        return rootCategoryToken.split(this.rootCategoryToken);
    }

    static isCategoryHierarchyDefinedInMainMenu(rootCategoryToken: string) {
        return rootCategoryToken.includes(this.rootCategoryToken);
    }
}
