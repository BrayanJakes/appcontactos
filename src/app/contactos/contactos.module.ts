import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactosComponent } from './contactos.component';
import { ContactosContentComponent } from './contactos-content/contactos-content.component';
import { ContactosSidebarComponent } from './contactos-sidebar/contactos-sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoModalComponent } from './contacto-modal/contacto-modal.component';

const routes: Routes = [
  { path: '', component: ContactosComponent},
  { path: '**', redirectTo: ''},
];

@NgModule({
  declarations: [ContactosComponent, ContactosContentComponent, ContactosSidebarComponent, ContactoModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class ContantosModule { }
