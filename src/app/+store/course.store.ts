import {signalStore, withMethods, withComputed, patchState} from "@ngrx/signals";
import {addEntities, setAllEntities, withEntities} from '@ngrx/signals/entities';

import { Course } from "../models/course.model";
import {setLoaded, setLoading, withCallState, withDataService, withDevtools} from "@angular-architects/ngrx-toolkit";
import {computed, inject} from "@angular/core";
import {CoursesService} from "../services/courses.service";

interface CourseState {
  courses: Course[]
}

const initialState: CourseState = {
  courses: []
}

export const CourseStore = signalStore(
  withDevtools('courses'),
  withCallState(),
  withEntities<Course>(),
  withComputed(({ entities }) => ({
    advancedCourses: computed(() =>
      entities().filter((course) => course.category === 'ADVANCED')
    ),
    beginnerCourses: computed(() =>
      entities().filter((course) => course.category === 'BEGINNER')
    )
  })),
  withMethods((store, coursesService = inject(CoursesService)) => ({
    async loadCourses(): Promise<void> {
      patchState(store, setLoading());

      const courses = await coursesService.loadAllCourses();
      patchState(store, addEntities(courses));

      patchState(store, setLoaded());
    }
  }))
)
