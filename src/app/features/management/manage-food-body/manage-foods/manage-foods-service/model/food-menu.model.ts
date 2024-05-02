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
}



export interface FoodMenuWithImageData{
  foodMenu: foodMenu,
  image: string
    
  }