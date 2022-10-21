import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserTaskComponent } from './list/user-task.component';
import { UserTaskDetailComponent } from './detail/user-task-detail.component';
import { UserTaskUpdateComponent } from './update/user-task-update.component';
import { UserTaskDeleteDialogComponent } from './delete/user-task-delete-dialog.component';
import { UserTaskRoutingModule } from './route/user-task-routing.module';

@NgModule({
  imports: [SharedModule, UserTaskRoutingModule],
  declarations: [UserTaskComponent, UserTaskDetailComponent, UserTaskUpdateComponent, UserTaskDeleteDialogComponent],
})
export class UserTaskModule {}
