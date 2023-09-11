import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StateService {
    
    selectedId: WritableSignal<string> = signal('');

    selectTask(id: string) {
        this.selectedId.set(id);
    }
}
