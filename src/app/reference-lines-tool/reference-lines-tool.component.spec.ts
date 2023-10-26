import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceLinesToolComponent } from './reference-lines-tool.component';

describe('ReferenceLinesToolComponent', () => {
  let component: ReferenceLinesToolComponent;
  let fixture: ComponentFixture<ReferenceLinesToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceLinesToolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceLinesToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
