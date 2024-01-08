import {Injectable} from '@angular/core';

@Injectable()
export class GridService {
    public selectedRowIndex: number | null = null;
    public selectedColIndex: number | null = null;

    public hasSelectedValue(): boolean {
        return this.selectedRowIndex !== null && this.selectedColIndex !== null;
    }
}

