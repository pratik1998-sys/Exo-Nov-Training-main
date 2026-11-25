export interface TutorialPetRestPagination {
    page?: number;
    pageSize?: number;
    pageCount?: number;
    resultCount?: number;
    hasMorePages?: boolean;
}

export interface TutorialPetRestResultSet {
    pagination?: TutorialPetRestPagination;
    results?: any[];
}

export interface TutorialPetRestQuery {
    page?: number;
    pageSize?: number;
    sortBy?: string;
}

export interface TutorialPetRestThumbnail {
    url: string;
}
