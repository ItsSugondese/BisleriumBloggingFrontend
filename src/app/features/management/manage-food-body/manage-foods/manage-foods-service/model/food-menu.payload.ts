import { paginationPayload } from "src/app/shared/model/pagination/pagination.model";

export interface FoodMenuPagination extends paginationPayload{
    name ?: string;
    foodType ?: string | null
}

export interface ToggleAvailability{
    foodId: number;
    status: boolean
}