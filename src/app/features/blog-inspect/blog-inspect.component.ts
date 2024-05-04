import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ManageFoodsService } from '../management/manage-food-body/manage-foods/manage-foods-service/manage-foods.service';
import { ManageStaffService } from '../management/people-management/manage-staff-body/manage-staff/manage-staff-service/manage-staff.service';
import { CommonVariable } from '@shared/helper/inherit/common-variable';

import { CommentService } from './comment-service/comment.service';
import { CommentPayload, CommentReactionPayload, Comments } from './comment-service/model/comment.model';
import { Location } from '@angular/common';
import { BlogService } from './blog-service/blog.service';
import { Blog, BlogReactionPayload } from './blog-service/model/blog.model';

@Component({
  selector: 'app-blog-inspect',
  templateUrl: './blog-inspect.component.html',
  styleUrls: ['./blog-inspect.component.scss']
})
export class BlogInspectComponent extends CommonVariable implements OnInit, OnDestroy {

  blogId !: number
  blogFetch$ !: Subscription
  blog !: Blog
  getUserPicture$ !: Subscription
  getBlogPicture$ !: Subscription
  getAutherPicture$ !: Subscription
  postComment$ !: Subscription
  reactBlog$ !: Subscription
  authorImage !: string
  blogImage !: string
  imageDataMap: { [key: string]: string } = {};
  writtenComment : string | null =null
  selectedComment : Comments | null = null
  deleteBlogPopUp = false
  blogEditVisible = false;

  visible = false;
  constructor(private route: ActivatedRoute, public blogService: BlogService,
    private userService : ManageStaffService, public commentService: CommentService,
    public location: Location
  ) { 
    super()
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.blogId = params['id'];
  });

  this.getBlog()
  }


  afterUpdate(event : boolean){
    this.visible = false; 
    this.selectedComment = null;
    if(event){
      this.getBlog()
    }
  }
  afterUpdateBlog(event : boolean){
    this.blogEditVisible = false; 
    if(event){
      this.getBlog()
    }
  }

  public getBlog(){
    
    this.blogFetch$ = this.blogService.getSingleBlog(this.blogId).subscribe(
      (response ) => {
        
        this.blog = response.data;

        if(this.blog.userProfile){
        this.getAutherPicture$ = this.userService.getUserPicture(this.blog.userId).subscribe((imageBlob: Blob) => {
          this.createImageFromBlobNoPhoto(imageBlob)
           .then((imageData) => {
            this.authorImage = imageData;
            
        })
        .catch((error) => {
            console.log("error when trying to access")
        });
        });
      }

        if(this.blog.imageUrl){
          this.getBlogPicture$ = this.blogService.getBlogPicture(this.blog.id).subscribe((imageBlob: Blob) => {
            this.createImageFromBlobNoPhoto(imageBlob)
             .then((imageData) => {
              this.blogImage = imageData;
              
          })
          .catch((error) => {
              console.log("error when trying to access")
          });
          });

        }

        this.blog.commentDetails.forEach((menu) => {
          if(menu.userProfile){
            this.getUserPicture$ = this.userService.getUserPicture(menu.userId).subscribe((imageBlob: Blob) => {


            this.createImageFromBlobNoPhoto(imageBlob)
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


  postComment(id: number| undefined){
    let payload : CommentPayload = {
      blogId : this.blogId,
      content: this.writtenComment,
      id: id
    }

    this.postComment$ = this.commentService.postComment(payload).subscribe(
      (res) => {
        this.writtenComment = null;
        this.getBlog()
      }
    )
  }

  deleteComment(){
    this.postComment$ = this.commentService.deleteComment(this.selectedComment?.id!).subscribe(
      (res) => {
        this.getBlog()
        this.showPopUp = false;
      },
    )
  }
  deleteBlog(){
    this.postComment$ = this.blogService.deleteBlog(this.blogId).subscribe(
      (res) => {
        this.location.back();
      },
    )
  }

  react(reactionType: boolean){
    const tempLoad = this.blog.hasReacted
    const tempScore = this.blog.score
    const payload : BlogReactionPayload = {
      blogId: this.blog.id,
      reaction: reactionType? 'UPVOTE' : 'DOWNVOTE'
    }
    if(reactionType == this.blog.hasReacted){
      this.blog.hasReacted = null
      if(reactionType){
        this.blog.score -= 2
      }else{
        this.blog.score += 1

      }
    }else{
      console.log(this.blog.hasReacted)
      this.blog.hasReacted = reactionType
      if(tempLoad == null){
      if(reactionType){
        this.blog.score += 2
      }else{
        this.blog.score -= 1
      }
    }else{
      if(reactionType){
        this.blog.score += 3
      }else{
        this.blog.score -= 3
      }

    }
    }
    this.reactBlog$ = this.blogService.reactBlog(payload).subscribe(
      (res) => {

      },
      (onErr) => {
      this.blog.hasReacted = tempLoad
      this.blog.score = tempScore
      }
    )
  }


  reactComment(reactionType: boolean, blogPayload: Comments, index : number){
    const tempLoad = blogPayload.hasReacted
    const tempScore = blogPayload.score
    const payload : CommentReactionPayload = {
      commentId: blogPayload.id,
      reaction: reactionType? 'UPVOTE' : 'DOWNVOTE'
    }
    if(reactionType == blogPayload.hasReacted){
      this.blog.commentDetails[index].hasReacted = null
      if(reactionType){
        this.blog.commentDetails[index].score -= 2
      }else{
        this.blog.commentDetails[index].score += 1

      }
    }else{
      console.log(blogPayload.hasReacted)
      this.blog.commentDetails[index].hasReacted = reactionType
      if(tempLoad == null){
      if(reactionType){
        this.blog.commentDetails[index].score += 2
      }else{
        this.blog.commentDetails[index].score -= 1
      }
    }else{
      if(reactionType){
        this.blog.commentDetails[index].score += 3
      }else{
        this.blog.commentDetails[index].score -= 3
      }

    }
    }
    this.reactBlog$ = this.commentService.reactComment(payload).subscribe(
      (res) => {

      },
      (onErr) => {
      this.blog.commentDetails[index].hasReacted = tempLoad
      this.blog.commentDetails[index].score = tempScore
      }
    )
  }

  

  ngOnDestroy(): void {
      if(this.blogFetch$){
        this.blogFetch$.unsubscribe()
      }
      if(this.getUserPicture$){
        this.getUserPicture$.unsubscribe()
      } 
      if(this.getBlogPicture$){
        this.getBlogPicture$.unsubscribe()
      }
      if(this.getAutherPicture$){
        this.getAutherPicture$.unsubscribe()
      }
      if(this.postComment$){
        this.postComment$.unsubscribe()
      }
  }
}
