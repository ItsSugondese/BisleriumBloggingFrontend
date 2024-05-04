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

 



export interface FoodMenuWithImageData{
  foodMenu: foodMenu,
  image: string
    
  }