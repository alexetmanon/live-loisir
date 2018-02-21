/**
 * @see https://github.com/ionic-team/ionic/issues/6923#issuecomment-302863343
 */
import {ContentChildren, Directive, QueryList, Self} from '@angular/core';
import {Segment, SegmentButton} from 'ionic-angular';
import {Subscription} from 'rxjs';

// TODO: Hotfix for dynamic ion-segment-buttons issue (https://github.com/driftyco/ionic/issues/6923).
@Directive({
    selector: 'ion-segment'
})
export class IonSegmentHotfix {
    private subscriptions: Subscription;

    @ContentChildren(SegmentButton)
    buttons: QueryList<SegmentButton>;

    constructor(@Self() private segment: Segment) {
    }

    ngAfterContentInit() {
        this.subscriptions = this.buttons.changes.subscribe(() => this.onChildrenChanged());
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
            this.subscriptions = null;
        }
    }

    private onChildrenChanged() {
        setTimeout(() => {
            this.segment.ngAfterContentInit();
            this.segment._inputUpdated();
        });
    }
}