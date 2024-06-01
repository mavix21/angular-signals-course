import {Component, computed, effect, inject, Injector, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import {CoursesServiceWithFetch} from "../services/courses-fetch.service";
import {LoadingService} from "../loading/loading.service";

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly #coursesService = inject(CoursesService);
  readonly #courses = signal<Course[]>([]);
  readonly #messageService = inject(MessagesService);

  public beginnerCourses = computed(() => {
    const courses = this.#courses();

    return courses.filter((course) => course.category === 'BEGINNER');
  })

  public advancedCourses = computed(() => {
    const courses = this.#courses();

    return courses.filter((course) => course.category === 'ADVANCED');
  })

  constructor () {
    this.loadCourses()
      .then((course) => console.log('All courses loaded', this.#courses()))
  }

  public async loadCourses() {
    try {
      const courses = await this.#coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (err) {
      this.#messageService.showMessage(
        'Error loading courses!',
        'error'
      )
      console.error(err);
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourses = courses.map((course) => course.id === updatedCourse.id ? updatedCourse : course);
    this.#courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this.#coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter(course => course.id !== courseId);
      this.#courses.set(newCourses);
    } catch (ex) {
      console.error(ex);
      alert('Error deleting course.');
    }
  }
}
