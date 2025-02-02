import {Component, inject, Signal} from "@angular/core";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {LoadingService} from "./loading.service";
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";

@Component({
  selector: "loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
  imports: [MatProgressSpinner],
  standalone: true,
})
export class LoadingIndicatorComponent {

  loading: Signal<boolean>;

  loadingService = inject(LoadingService);

  constructor() {
    this.loading = this.loadingService.loading;
  }

}
