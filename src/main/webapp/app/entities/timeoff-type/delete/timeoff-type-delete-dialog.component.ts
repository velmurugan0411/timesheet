import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITimeoffType } from '../timeoff-type.model';
import { TimeoffTypeService } from '../service/timeoff-type.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './timeoff-type-delete-dialog.component.html',
})
export class TimeoffTypeDeleteDialogComponent {
  timeoffType?: ITimeoffType;

  constructor(protected timeoffTypeService: TimeoffTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.timeoffTypeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
