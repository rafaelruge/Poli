import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutasRecoleccionComponent } from './rutas-recoleccion.component';

describe('RutasRecoleccionComponent', () => {
  let component: RutasRecoleccionComponent;
  let fixture: ComponentFixture<RutasRecoleccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RutasRecoleccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutasRecoleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
