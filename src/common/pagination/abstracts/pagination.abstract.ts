import { IPaginationSort } from 'src/common/pagination/interfaces/pagination.interface';

export abstract class PaginationListAbstract {
    abstract search?: string;
    abstract availableSearch?: string[];
    abstract page?: number;
    abstract per_page?: number;
    abstract sort?: IPaginationSort;
    abstract available_sort?: string[];
}

export abstract class PaginationSimpleListAbstract {
    abstract search?: string;
    abstract page?: number;
    abstract per_page: number;
}

export abstract class PaginationMiniListAbstract {
    abstract per_page: number;
}
