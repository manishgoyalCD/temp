import { ClientSession } from 'mongoose';

export enum ENUM_PAGINATION_AVAILABLE_SORT_TYPE {
    ASC = 1,
    DESC = -1,
}

export type IPaginationSort = Record<
    string,
    ENUM_PAGINATION_AVAILABLE_SORT_TYPE
>;

export interface IPaginationOptions {
    limit: number;
    skip: number;
    sort?: IPaginationSort;
}

export interface IDatabaseFindOneOptions {
    select?: Record<string, number> | Record<string, string>;
    populate?: boolean;
    session?: ClientSession;
    withDeleted?: boolean;
}

export type IDatabaseFindOneAggregateOptions = Pick<
    IDatabaseFindOneOptions,
    'session' | 'withDeleted'
>;

export interface IDatabaseFindAllOptions
    extends IPaginationOptions,
        IDatabaseFindOneOptions {}

export interface IDatabaseFindAllAggregateOptions
    extends IPaginationOptions,
        Pick<IDatabaseFindOneOptions, 'session' | 'withDeleted'> {}

export type IDatabaseOptions = Pick<
    IDatabaseFindOneOptions,
    'session' | 'withDeleted'
>;

export type IDatabaseSoftDeleteOptions = Pick<
    IDatabaseFindOneOptions,
    'session'
>;

export interface IDatabaseCreateOptions
    extends Omit<IDatabaseOptions, 'withDeleted'> {
    _id?: string;
}

export type IDatabaseCreateManyOptions = Omit<IDatabaseCreateOptions, '_id'>;

export interface IDatabaseExistOptions extends IDatabaseOptions {
    excludeId?: string;
}

export interface IDatabaseGetTotalAggregateOptions extends IDatabaseOptions {
    field?: string;
}

export type IDatabaseRestoreOptions = Pick<IDatabaseFindOneOptions, 'session'>;
