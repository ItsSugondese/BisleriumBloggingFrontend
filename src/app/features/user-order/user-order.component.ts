import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserOrderHistory } from './user-order-service/model/user-order.model';
import { PaginatedData } from 'src/app/constant/data/pagination/pagination.model';
import { defaultPaginationNavigator } from 'src/app/shared/model/pagination/pagination.model';
import { UserOrderHistoryPagination } from './user-order-service/model/user-order.payload';
import { Subscription } from 'rxjs';
import { UserOrderService } from './user-order-service/user-order.service';
import { ResponseData } from 'src/app/constant/data/response-data.model';
import { createImageFromBlob } from 'src/app/shared/helper/attachment-helper/attachment.handler';
import { SidenavService } from 'src/app/shared/ui/nav/sidenav/sidenav-service/sidenav.service';
import { foodOrdering } from 'src/app/shared/model/order/food-order.model';
import { Router } from '@angular/router';
import { UserRouteConstant } from 'src/app/constant/routing/user-routing-constant.model';
import { FoodMenuPagination } from '../management/manage-food-body/manage-foods/manage-foods-service/model/food-menu.payload';
import { ManageFoodsService } from '../management/manage-food-body/manage-foods/manage-foods-service/manage-foods.service';
import { CommonVariable } from '@shared/helper/inherit/common-variable';
import { CommentService } from '../blog-inspect/comment-service/comment.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BlogService } from '../blog-inspect/blog-service/blog.service';
import { Blog, BlogPagination, BlogReactionPayload } from '../blog-inspect/blog-service/model/blog.model';
import { ManageStaffService } from '../management/people-management/manage-staff-body/manage-staff/manage-staff-service/manage-staff.service';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss']
})
export class UserOrderComponent extends CommonVariable implements OnInit, OnDestroy {
 
  visible = false

  foodMenuFetch$ !: Subscription
  getUserPicture$ !: Subscription
  reactBlog$ !: Subscription
  postComment$ !: Subscription
  foodMenuList !: Blog[]
  imageDataMap: { [key: string]: string } = {};


  blogPagination !: BlogPagination

  reactionPayload !: BlogReactionPayload
  deleteBlogPopUp = false
  selectedBlog : Blog | null = null
 

 

  constructor(public blogService: BlogService, private router: Router,
    private staffService: ManageStaffService
  ) {
      super()

  }

  
  ngOnInit(): void {
    this.blogPagination = {
      page: 1,
      row: 10,
sort: this.blogService.defaltFoodSelect,
      name:  '',
      ofUser: true
    }
  }



  afterUpdate(event : boolean){
    this.visible = false; 
    // this.selectedComment = null;
    if(event){
      this.getBlog()
    }
  }


  deleteBlog(){
    this.postComment$ = this.blogService.deleteBlog(this.selectedBlog?.id!).subscribe(
      (res) => {
        this.deleteBlogPopUp = false;
        this.getBlog()
      },
    )
  }
  


  
  navigateToDetails(id: number){
    this.router.navigate([UserRouteConstant.blogView, id])
  }

  public getBlog(){
    
    this.foodMenuFetch$ = this.blogService.getBlogPaginated(this.blogPagination).subscribe(
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
    this.getBlog()
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

    this.getBlog()
}

typedOrderToFilter(event: string){
    this.blogPagination.name = event
  
  this.getBlog();
}





 





  ngOnDestroy(): void {
    if (this.foodMenuFetch$) {
      this.foodMenuFetch$.unsubscribe();
    }
    if(this.postComment$){
    this.postComment$.unsubscribe()
    }
    
    
  }
}
