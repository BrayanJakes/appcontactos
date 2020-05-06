import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactosService } from '../contactos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contacto-modal',
  templateUrl: './contacto-modal.component.html',
  styleUrls: ['./contacto-modal.component.scss']
})
export class ContactoModalComponent implements OnInit {

  form: FormGroup;
  nombreGrupo = '';
  grupos = [];

  constructor(public modalRef: MatDialogRef<ContactoModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private contactoService: ContactosService,
              private toat: MatSnackBar) { this.formulario(); }

  ngOnInit(): void {
    this.listarGrupo();
    if (this.data.contacto) {
      this.editarContacto();
    }
  }

  formulario(){
    this.form = new FormGroup({
      nombre: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      email: new FormControl('Sin Email'),
      grupo: new FormControl('Sin Grupo'),
    });
  }

  editarContacto(){
    const contacto = this.data.contacto;
    this.form.controls.nombre.setValue(contacto.nombre);
    this.form.controls.email.setValue(contacto.email || 'Sin email carajo');
    this.form.controls.telefono.setValue(contacto.telefono);
    this.form.controls.grupo.setValue(contacto.grupo || 'Sin grupo');
  }

  nuevoContacto(){
    const contacto = {
      nombre: this.form.controls.nombre.value,
      telefono: this.form.controls.telefono.value,
      grupo: this.form.controls.grupo.value || 'Sin Grupo',
      email: 'Sin Email'
    };
    this.contactoService.crearContacto(contacto)
          .subscribe(resp => this.modalRef.close('Creado'), err => {
            if (err.name === 'HttpErrorResponse') {
              return this.alert('Ya existe un contacto con ese numero');
            }
          } );
  }

  actualizarContacto(){
    const contacto = {
      nombre: this.form.controls.nombre.value,
      telefono: this.form.controls.telefono.value,
      grupo: this.form.controls.grupo.value || 'Sin Grupo',
      email: this.form.controls.email.value || 'Sin Email'
    };

    this.contactoService.actualizarContacto(this.data.contacto._id, contacto)
      .subscribe(resp => this.modalRef.close('Actualizado'));
  }

  listarGrupo(){
    this.grupos = [
      {
        id: Math.random(),
        nombre: 'Sin Grupo',
        active: true
      }
    ];
    this.contactoService.listarGrupo()

      .subscribe((resp: any[]) => {
        resp.forEach(g => this.grupos.push({id: g._id, nombre: g.nombre, active: false}));
      });
  }

  nuevoGrupo(){
    const grupo = {
      nombre: this.nombreGrupo
    };
    this.contactoService.crearGrupo(grupo)
        .subscribe(resp => this.modalRef.close('Correcto'), err => {
          if (err.name === 'HttpErrorResponse') {
            return this.alert('Ya existe ese grupo');
          }
        });
  }

  alert(mensaje){
    this.toat.open(mensaje, '', {duration: 4000, horizontalPosition: 'left'});
  }

}
