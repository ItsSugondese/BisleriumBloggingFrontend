import { paginationPayload } from "@shared/model/pagination/pagination.model";

export interface User {
    accountNonLocked: boolean;
    email: string;
    profilePath: string;
    id: any;
    fullName: string;
    userType : string;
    isExternal: boolean;
    remainingAmount: number;
  }

export interface UserPayload {
    email: string;
    username: string;
    fileId : number;
  }


  export interface UserPaginationPayload extends paginationPayload{
    userType ?: string;
    name ?: string | undefined;
}