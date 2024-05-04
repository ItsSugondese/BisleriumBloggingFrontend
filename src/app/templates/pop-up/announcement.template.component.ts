import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AnnouncementService } from '@shared/service/announcement-service/announcement.service';
import { AnnouncementPayload } from '@shared/service/announcement-service/model/announcement-payload.model';
import { Subscription } from 'rxjs';
import { CommentService } from 'src/app/features/blog-inspect/comment-service/comment.service';
import { CommentPayload, Comments } from 'src/app/features/blog-inspect/comment-service/model/comment.model';


@Component({
    selector: 'announcement-pop-up-template',
    template: `
 <p-dialog header="Header" [(visible)]="visible" [closable]="true" [style]="{'width': '500px'}" 
[modal]="true" (onHide)="afterHide()">
    <!-- Header Row -->
    <ng-template pTemplate="header">
      <div class="d-flex  justify-content-between align-items-center">
        <div class="h4">Make Announcement</div>
      </div>
    </ng-template>
    <div *ngIf="commentService.loading">
                                <mat-progress-bar mode="indeterminate"></mat-progress-bar>
                            </div>
<!--   
    <ng-container *ngIf="announcementService.loading; else loaded"> 
        <mat-spinner></mat-spinner>
    </ng-container> -->
    <!-- Content Row -->
    <!-- <ng-template #loaded> -->
    <ng-template pTemplate="content">
      <div class="form-group">
        <label for="message">Comment</label>
        <textarea id="message" class="form-control" [(ngModel)]="message" placeholder="Enter your message"
        [disabled]="commentService.loading"></textarea>
      </div>
    </ng-template>
  
    <!-- Footer Row -->
    <ng-template pTemplate="footer">
      <div class="d-flex justify-content-end align-items-center">
        <div class="mr-2" (click)="visible = false">
          <default-button-template [text]="'Cancel'" [background]="'white'"
          [color]="'customPrimary'" [hasBorder]="true" [isDisabled]="commentService.loading" ></default-button-template>
        </div>
        
        <div  (click)="postComment()">
        <default-button-template [text]="'Post'" [hasBorder]="true" [border]="'transparent'"
        [isDisabled]="message == null || message.trim() == '' || commentService.loading"></default-button-template>
      </div>
    </div>
    </ng-template>
<!-- </ng-template> -->
  </p-dialog>
  `,
    styles: [
    ],
})
export class AnnouncementPopUpComponent implements OnInit,OnDestroy {

    message: string | null = null
    @Input() visible: boolean = false;
    @Input() commentPayload !: Comments
    @Input() blogId !: number

    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

    postAnnouncementSubscription$ !: Subscription
    isYes : boolean  = false

    constructor(public commentService: CommentService) { }

    ngOnInit(): void {
      console.log("This is getting hit")
      console.log(this.commentPayload.content)
      this.message = this.commentPayload.content;
    }

  

    postComment(){
      let payload : CommentPayload = {
        blogId : this.blogId,
        content: this.message,
        id: this.commentPayload.id
      }
  
      this.postAnnouncementSubscription$ = this.commentService.postComment(payload).subscribe({
        next: res => {
          this.isYes = true;
          this.visible = false
        }
      })

    }

    afterHide() {
        this.message = null
        this.visibleChange.emit(this.isYes);
        this.isYes = false
    }

    ngOnDestroy(): void {
        if (this.postAnnouncementSubscription$) {
            this.postAnnouncementSubscription$.unsubscribe()
        }

        this.isYes = false
    }

}
