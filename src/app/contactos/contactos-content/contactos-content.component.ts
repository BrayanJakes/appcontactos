import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContactoModalComponent } from '../contacto-modal/contacto-modal.component';
import { ContactosService } from '../contactos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/operators';

interface Contacto{id: string; nombre: string; email: string; telefono: string; grupo: string; }


@Component({
  selector: 'app-contactos-content',
  templateUrl: './contactos-content.component.html',
  styleUrls: ['./contactos-content.component.scss']
})
export class ContactosContentComponent implements OnInit {

  displayedColumns: string[] = !this.contactoService.disenoMovil ? ['position', 'nombre', 'telefono', 'email', 'operacion'] : ['position', 'nombre', 'telefono', 'operacion'];
  dataSource = [];
  respaldo: Contacto[];

  seleccionVariosContactos = [];

  constructor( private modal: MatDialog,
               public contactoService: ContactosService,
               private toat: MatSnackBar ) {
               }

  ngOnInit(): void {
    this.listarContacto();
    this.contactoService.existeContactoNuevo.subscribe(resp => {
       if (resp){
        this.listarContacto();
        this.contactoService.existeContactoNuevo.next(false);
       }
    });

    setTimeout(() => this.buscarContacto(), 1000);

  }

  verContacto(contacto){
    const modal = this.modal.open(ContactoModalComponent, {
      data: {option: 'ver', contacto}
    });
    modal.afterClosed().subscribe(resp => {
      if (resp === 'Actualizado'){
        this.listarContacto();
        return this.alert('Contacto Actualizado');
      }
    });
  }

  listarContacto(){
    this.contactoService.listarContacto().subscribe((resp: any) => {
      this.dataSource = resp;
      this.dataSource.forEach(c => c.check = false);

      this.respaldo = this.dataSource;
      this.respaldo.sort((a, b) => {
        if (a.nombre > b.nombre) {
          return 1;
        }
        if (a.nombre < b.nombre) {
          return -1;
        }
        // a must be equal to b
        return 0;
       });

      this.contactoService.buscarPorGrupo.subscribe(resp2 => {
        if (resp2 === 'Todos'){
          return this.dataSource = this.respaldo;
        }

        this.dataSource = this.respaldo.filter(c => c.grupo === resp2);
      });
    });
  }

  buscarContacto(){
    this.contactoService.search.pipe(
      debounceTime(500)
    ).subscribe(buscador => {
      this.dataSource = this.respaldo.filter( c => {
          if (!c.nombre.search(new RegExp(buscador, 'i')) || c.telefono.includes(buscador) || !c.email.search(new RegExp(buscador, 'i'))){
            return c;
          }
      });
    });
  }

  eliminarContacto(id){
    const modal = this.modal.open(ContactoModalComponent, {
      data: {option: 'eliminarContacto'}
    });
    modal.afterClosed().subscribe(resp => {if (resp === 'Eliminar') {
      this.contactoService.eliminarContacto(id)
      .subscribe(resp2 => {
        this.listarContacto();
        return this.alert('Contacto Eliminado');
      });
    }});

  }

  seleccionarVariosContactos(event, id){
    if (!event.checked){
     return this.seleccionVariosContactos = this.seleccionVariosContactos.filter(s => s !== id);
    }
    this.seleccionVariosContactos.push(id);
  }

  marcarTodos(){
    this.seleccionVariosContactos = [];
    this.dataSource.forEach(c => {
      c.check = true;
      this.seleccionVariosContactos.push(c._id);
    });
  }

  desmarcarTodos(){
    this.seleccionVariosContactos = [];
    this.dataSource.forEach(c => c.check = false);
  }

  EliminarSeleccion(){
    const modal = this.modal.open(ContactoModalComponent, {
      data: {option: 'eliminarVariosContacto'}
    });
    modal.afterClosed().subscribe(resp => {
      if (resp === 'Eliminar'){
        this.contactoService.eliminarSeleccionados(this.seleccionVariosContactos)
        .subscribe((resp2) => {
          this.listarContacto();
          return this.alert('Contactos Eliminados');
        }
        );
      }
    });
  }



  alert(mensaje){
    this.toat.open(mensaje, 'Cerrar', {duration: 4000});
  }






}
