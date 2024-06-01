import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  #loading = signal(false);
  loading = this.#loading.asReadonly();

  public loadingOn() {
    this.#loading.set(true);
  }

  public loadingOff() {
    this.#loading.set(false);
  }
}
