import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITimesheet } from '../timesheet.model';
import { TimesheetService } from '../service/timesheet.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './timesheet-delete-dialog.component.html',
})
export class TimesheetDeleteDialogComponent {
  timesheet?: ITimesheet;

  constructor(protected timesheetService: TimesheetService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.timesheetService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
