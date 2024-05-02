import { paginationPayload } from "src/app/shared/model/pagination/pagination.model";

export interface FoodMenuPagination extends paginationPayload{
    name ?: string;
    foodType ?: string | null;
    filter ?: boolean | null
}
export interface BlogPagination extends paginationPayload{
    sort: string,
    fromDate ?: string;
    toDate ?: string;
    name ?: string
}

export interface ToggleAvailability{
    foodId: number;
    status: boolean
}
export interface BlogReactionPayload {
    blogId: number;
    reaction: string;
}
