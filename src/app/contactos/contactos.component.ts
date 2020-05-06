import { Component, OnInit } from '@angular/core';
import { ContactoModalComponent } from './contacto-modal/contacto-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ContactosService } from './contactos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss']
})
export class ContactosComponent implements OnInit {

  ocultarSidebar: boolean;

  constructor(private modal: MatDialog,
              private contactoService: ContactosService,
              private toat: MatSnackBar) {
                if (this.contactoService.disenoMovil || this.contactoService.disenoMovilMediano){
                  this.ocultarSidebar = true;
                }
               }

  ngOnInit(): void {
  }

  nuevoContacto(){
    const modal = this.modal.open(ContactoModalComponent, {
      data: {option: 'contacto'}
    });
    modal.afterClosed().subscribe(resp => {
      if (resp === 'Creado'){
        this.contactoService.existeContactoNuevo.next(true);
        return this.alert('Contacto Creado');
      }
    });
  }


  alert(mensaje){
    this.toat.open(mensaje, 'Cerrar', {duration: 4000});
  }

  buscarContacto(buscador){
    this.contactoService.search.next(buscador);
  }

  abrirPanel(){
    this.contactoService.abrirPanel.next(true);
  }

}
