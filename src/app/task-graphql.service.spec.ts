import { TestBed } from '@angular/core/testing';

import { TaskGraphqlService } from './task-graphql.service';

describe('TaskGraphqlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskGraphqlService = TestBed.get(TaskGraphqlService);
    expect(service).toBeTruthy();
  });
});
