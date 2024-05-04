import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { HomepageService } from './homepage-service/homepage.service';
import { FormControl, Validators } from '@angular/forms';
import { foodOrderPayload, onlineOrderPayload } from 'src/app/payload.interface';
import { createImageFromBlob } from 'src/app/shared/helper/attachment-helper/attachment.handler';
import { foodMenu } from 'src/app/shared/model/food/food.model';
import { foodOrdering } from 'src/app/shared/model/order/food-order.model';
import { UserOrderService } from '../user-order/user-order-service/user-order.service';
import { FoodFilter } from 'src/app/constant/filter/food-filter.model';
import { Router } from '@angular/router';
import { UserRouteConstant } from 'src/app/constant/routing/user-routing-constant.model';
import { UserOrderHistory } from '../user-order/user-order-service/model/user-order.model';
import { ManageFoodsService } from '../management/manage-food-body/manage-foods/manage-foods-service/manage-foods.service';
import { CommonVariable } from '@shared/helper/inherit/common-variable';
import { ManageStaffService } from '../management/people-management/manage-staff-body/manage-staff/manage-staff-service/manage-staff.service';
import { BlogService } from '../blog-inspect/blog-service/blog.service';
import { Blog, BlogPagination, BlogReactionPayload } from '../blog-inspect/blog-service/model/blog.model';



@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent extends CommonVariable implements OnInit, OnDestroy, AfterViewInit {
  blogFetch$ !: Subscription
  getUserPicture$ !: Subscription
  reactBlog$ !: Subscription
  foodMenuList !: Blog[]
  imageDataMap: { [key: string]: string } = {};


  blogPagination !: BlogPagination

  reactionPayload !: BlogReactionPayload
  
  constructor(public homepageService: HomepageService,
    public blogService: BlogService, private userOrderService: UserOrderService,
    private router: Router, private staffService: ManageStaffService
  ) {
super()
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 4000); // Snackbar duration
  
  }

  ngOnInit(): void {
    this.blogPagination = {
      page: 1,
      row: 10,
sort: this.blogService.defaltFoodSelect,
      name:  ''
    }
  }

  navigateToDetails(id: number){
    this.router.navigate([UserRouteConstant.blogView, id])
  }

  public getFoodMenu(){
    
    this.blogFetch$ = this.blogService.getBlogPaginated(this.blogPagination).subscribe(
      (response ) => {
        
        this.foodMenuList = response.data.content;

        this.foodMenuList.forEach((menu) => {
          if(menu.userProfile){
            this.getUserPicture$ = this.staffService.getUserPicture(menu.userId).subscribe((imageBlob: Blob) => {


            createImageFromBlob(imageBlob, menu.id)
             .then((imageData) => {
              this.imageDataMap[menu.userId] = imageData;
              
          })
          .catch((error) => {
              console.log("error when trying to access")
          });
          });
        }
        }); 
      }
    )
  }

  selectedFromFoodFilter(event: string | null){
    this.blogPagination.sort = event!
    this.getFoodMenu()
  }

  react(reactionType: boolean, blogPayload: Blog, index : number){
    const tempLoad = blogPayload.hasReacted
    const tempScore = blogPayload.score
    const payload : BlogReactionPayload = {
      blogId: blogPayload.id,
      reaction: reactionType? 'UPVOTE' : 'DOWNVOTE'
    }
    if(reactionType == blogPayload.hasReacted){
      this.foodMenuList[index].hasReacted = null
      if(reactionType){
        this.foodMenuList[index].score -= 2
      }else{
        this.foodMenuList[index].score += 1

      }
    }else{
      console.log(blogPayload.hasReacted)
      this.foodMenuList[index].hasReacted = reactionType
      if(tempLoad == null){
      if(reactionType){
        this.foodMenuList[index].score += 2
      }else{
        this.foodMenuList[index].score -= 1
      }
    }else{
      if(reactionType){
        this.foodMenuList[index].score += 3
      }else{
        this.foodMenuList[index].score -= 3
      }

    }
    }
    this.reactBlog$ = this.blogService.reactBlog(payload).subscribe(
      (res) => {

      },
      (onErr) => {
      this.foodMenuList[index].hasReacted = tempLoad
      this.foodMenuList[index].score = tempScore
      }
    )
  }

  onRangeSelect(event: Date[]) {
    const fromDate = event[0];
    const toDate = event[event.length - 1];

    const fromDateString = fromDate.getFullYear() + '-' + ('0' + (fromDate.getMonth() + 1)).slice(-2) + '-' + ('0' + fromDate.getDate()).slice(-2);
      const toDateString = toDate.getFullYear() + '-' + ('0' + (toDate.getMonth() + 1)).slice(-2) + '-' + ('0' + toDate.getDate()).slice(-2);
    this.blogPagination.fromDate = fromDateString
    this.blogPagination.toDate = toDateString

    this.getFoodMenu()
}

typedOrderToFilter(event: string){
    this.blogPagination.name = event
  
  this.getFoodMenu();
}





 





  ngOnDestroy(): void {
    if (this.blogFetch$) {
      this.blogFetch$.unsubscribe();
    }

    console.log("Here")
    
    
  }

}
