import { Comments } from "src/app/features/blog-inspect/comment-service/model/comment.model";

export interface foodMenu{
    id : number,
    name: string,
    description: string,
    cost: number,
    photoId: number,
    isAvailableToday : boolean,
    foodType: string,
    isAuto : boolean,
  isAvailable: boolean;
  }
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
    imageUrl: string,
    commentDetails: Comments[]
}
 



export interface FoodMenuWithImageData{
  foodMenu: foodMenu,
  image: string
    
  }