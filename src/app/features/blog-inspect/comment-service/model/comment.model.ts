export interface Comments {
    id: number;
    content: string;
    postedOn: string; // Assuming this is in ISO 8601 format
    username: string;
    userProfile: string;
    userId: string;
    score: number;
    hasReacted: boolean | null;
    myComment: boolean;
}

export interface CommentReactionPayload {
    commentId: number;
    reaction: string;
}

export interface CommentPayload {
    id?: number;
    blogId: number;
    content: string | null;
}