import { paginationPayload } from "@shared/model/pagination/pagination.model";
import { Comments } from "../../comment-service/model/comment.model";

export interface Blog {
    id: number;
    title: string;
    content: string;
    postedOn: string; // Assuming this is in ISO 8601 format
    username: string;
    userProfile: string;
    userId: string;
    score: number;
    comments: number;
    hasReacted: boolean | null;
    imageUrl: string;
    myBlog : boolean;
    commentDetails: Comments[]
}

export interface BlogPagination extends paginationPayload{
    sort: string,
    fromDate ?: string;
    toDate ?: string;
    name ?: string
    ofUser ?: boolean
}

export interface BlogReactionPayload {
    blogId: number;
    reaction: string;
}