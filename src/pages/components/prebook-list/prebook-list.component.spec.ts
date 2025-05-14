import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebookListComponent } from './prebook-list.component';

describe('PrebookListComponent', () => {
  let component: PrebookListComponent;
  let fixture: ComponentFixture<PrebookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrebookListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrebookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
