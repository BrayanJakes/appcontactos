import { Component, OnInit } from '@angular/core';
import { ContactoModalComponent } from '../contacto-modal/contacto-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ContactosService } from '../contactos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contactos-sidebar',
  templateUrl: './contactos-sidebar.component.html',
  styleUrls: ['./contactos-sidebar.component.scss']
})
export class ContactosSidebarComponent implements OnInit {

  public grupos: {id: any; nombre: string; active: boolean; }[] = [];



  constructor(private modal: MatDialog,
              public contactoService: ContactosService,
              private toat: MatSnackBar) { }

  ngOnInit(): void {
    this.listarGrupo();
  }

  seleccionarGrupo(id, nombre){
    this.grupos.forEach(g => {
      g.active = false;
      if (g.id === id){ g.active = !g.active; }
    });
    this.contactoService.buscarPorGrupo.next(nombre);
  }

  nuevoGrupo(){
    const modal = this.modal.open(ContactoModalComponent, {
      data: {option: 'grupo'}
    });

    modal.afterClosed().subscribe(resp => {
      if (resp === 'Correcto'){
        this.alert('Grupo Creado');
        return this.listarGrupo();
      }
    });
  }

  listarGrupo(){
    this.grupos = [
      {
        id: Math.random(),
        nombre: 'Todos',
        active: true
      }
    ];
    this.contactoService.listarGrupo()

      .subscribe((resp: any[]) => {
        resp.forEach(g => this.grupos.push({id: g._id, nombre: g.nombre, active: false}));
      });
  }

  eliminarGrupo(id){
    this.contactoService.eliminarGrupo(id)
      .subscribe(resp => {
        this.listarGrupo();
        return this.alert('Grupo Eliminado');
      });
  }



  alert(mensaje){
    this.toat.open(mensaje, 'Cerrar', {duration: 4000});
  }




}

