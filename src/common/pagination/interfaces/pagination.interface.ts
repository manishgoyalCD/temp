import { ENUM_PAGINATION_AVAILABLE_SORT_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export type IPaginationSort = Record<
    string,
    ENUM_PAGINATION_AVAILABLE_SORT_TYPE
>;

export interface IPaginationOptions {
    limit: number;
    skip: number;
    sort?: IPaginationSort;
}

export interface IPaginationFilterOptions {
    required?: boolean;
}

export interface IPaginationFilterDateOptions extends IPaginationFilterOptions {
    asEndDate?: {
        moreThanField: string;
    };
}

export interface IPaginationFilterStringOptions
    extends IPaginationFilterOptions {
    lowercase?: boolean;
}

export interface IPaginationByIdOptions {
    near_by: string[];
    city: string;
    last_index: number;
    batch: number,
    last_latest_article_id: string;
}