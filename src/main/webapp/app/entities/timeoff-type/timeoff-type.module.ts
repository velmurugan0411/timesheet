import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TimeoffTypeComponent } from './list/timeoff-type.component';
import { TimeoffTypeDetailComponent } from './detail/timeoff-type-detail.component';
import { TimeoffTypeUpdateComponent } from './update/timeoff-type-update.component';
import { TimeoffTypeDeleteDialogComponent } from './delete/timeoff-type-delete-dialog.component';
import { TimeoffTypeRoutingModule } from './route/timeoff-type-routing.module';

@NgModule({
  imports: [SharedModule, TimeoffTypeRoutingModule],
  declarations: [TimeoffTypeComponent, TimeoffTypeDetailComponent, TimeoffTypeUpdateComponent, TimeoffTypeDeleteDialogComponent],
})
export class TimeoffTypeModule {}
