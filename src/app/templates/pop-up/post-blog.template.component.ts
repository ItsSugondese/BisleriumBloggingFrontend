import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonVariable } from '@shared/helper/inherit/common-variable';
import { Subscription } from 'rxjs';
import { BlogService } from 'src/app/features/blog-inspect/blog-service/blog.service';
import { Blog } from 'src/app/features/blog-inspect/blog-service/model/blog.model';


@Component({
  selector: 'post-blog-popUp',
  template: `
  <p-dialog header="Header" [(visible)]="visible" [closable]="true" [style]="{'width': '500px'}" 
    [modal]="true" (onHide)="afterHide()">
        <!-- Header Row -->
        <ng-template pTemplate="header">
          <div class="d-flex  justify-content-between align-items-center">
            <div class="h4">{{header}}</div>
          </div>
        </ng-template>
        <div *ngIf="blogService.loading">
                                    <mat-progress-bar mode="indeterminate"></mat-progress-bar>
                                </div>
  
        <ng-template pTemplate="content">
          <div class="w-full max-w-lg mx-auto">
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" [formGroup]="form" (ngSubmit)="onSubmit()">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
        Title
      </label>
      <input class="form-control" id="title" type="text" placeholder="Enter title"
      formControlName="title">
      <div class="pl-8">
        <mat-error *ngIf="formValue('email')?.touched && formValue('email')?.invalid">
          Title is must
        </mat-error>
      </div>
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="content">
        Content
      </label>
      <textarea class="form-control" id="content" placeholder="Enter content"
      formControlName="content"></textarea>
      <div class="pl-8">
        <mat-error *ngIf="formValue('email')?.touched && formValue('email')?.invalid">
          Writing content is must
        </mat-error>
    </div>
    </div>
    <div class="mb-4 form-group h-fit">
            <label for="exampleFormControlFile1">Image upload<span class="text-red-600 text-xl">*</span></label>
            <div class="mt-1">
              <file-upload-template [originalImage]="imageUrl" (imageIdEvent)="imageId = $event"></file-upload-template>
            </div>
    </div>
  </form>
</div>

        </ng-template>
      
        <!-- Footer Row -->
        <ng-template pTemplate="footer">
          <div class="d-flex justify-content-end align-items-center">
            <div class="mr-2" (click)="visible = false">
              <default-button-template [text]="'Cancel'" [background]="'white'"
              [color]="'customPrimary'" [hasBorder]="true" [isDisabled]="blogService.loading" ></default-button-template>
            </div>
            
            <div>
            <default-button-template [text]="'Post'" [hasBorder]="true" [border]="'transparent'"
            [isDisabled]=" blogService.loading || form.invalid" (clicked)="onSubmit()"></default-button-template>
          </div>
        </div>
        </ng-template>
      </p-dialog>
  `,
  styles: [
],
})
export class PostBlogComponent extends CommonVariable implements OnInit, OnDestroy{
    message: string | null = null

    header : string = "Post Blog"
    @Input() visible: boolean = false;
    @Input() blogPayload : Blog | null = null;

    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

     imageId !: number | null
     @Input() imageUrl !: string | null
  postBlog$ !: Subscription
  blogImage$ !: Subscription

  form = this.fb.group({

    title: ['', Validators.required],
    content: ['', [Validators.required]],
    fileId: new FormControl(),
    id: new FormControl(),
  });
  isYes : boolean  = false

    constructor(private fb: FormBuilder, public blogService: BlogService) { 
        super()
    }
  
    ngOnInit(): void {
        console.log("I'm here")
        if(this.blogPayload != null){
            this.header = "Update Blog"

            this.form.setValue({
                id: this.blogPayload.id,
                content: this.blogPayload.content,
                title: this.blogPayload.title,
                fileId: null
            })
            if(this.blogPayload.imageUrl != null){
                this.blogImage$ = this.blogService.getBlogPicture(this.blogPayload.id).subscribe(
                    (response) => {
                        this.createImageFromBlobNoPhoto(response)
                        .then((imageData) => {
                          if (imageData.startsWith("data:image") || imageData.startsWith("data:text/xml")) {
                            this.imageUrl = imageData;
                          }
                        })
                    }
                )
            }
        }


    }

    onSubmit() {
        //this.formSubmitAttempt = false;
        if (this.form.valid) {
          if (this.imageId) {
            const photoIdControl = this.form.get('fileId');
            photoIdControl?.setValue(this.imageId);
          }
          
        
      
          this.postBlog$ = this.blogService.postBlog(this.form.value).subscribe(
            (results: any) => {
                this.isYes = true;
          this.visible = false
            }
          );
    
          
        } 
      }

      formValue(name: string) {
        return this.form.get(name);
      }

    afterHide() {
        this.message = null
        this.visibleChange.emit(this.isYes);
        this.isYes = false
    }

    ngOnDestroy(): void {
        if (this.postBlog$) {
            this.postBlog$.unsubscribe()
        }

        this.isYes = false
    }
    
}
