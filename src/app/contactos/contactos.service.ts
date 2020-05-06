import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pluck } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';


const URI = 'https://app-contactos.herokuapp.com';


@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  existeContactoNuevo: BehaviorSubject<boolean> = new BehaviorSubject(false);
  buscarPorGrupo: BehaviorSubject<string> = new BehaviorSubject('Todos');
  search: BehaviorSubject<string> = new BehaviorSubject('');
  abrirPanel: BehaviorSubject<boolean> = new BehaviorSubject(false);
  disenoMovil = false;
  disenoMovilMediano = false;

  constructor(private http: HttpClient,
              private breakpointObserver: BreakpointObserver) {
                this.observerLayout()
              }

   observerLayout(){
     this.breakpointObserver.observe([
       Breakpoints.Large,
       Breakpoints.Medium,
       Breakpoints.Small,
       Breakpoints.XSmall,
       Breakpoints.XLarge,
     ]).subscribe(resp => {
       this.verificarDiseno(resp);
     });
   }
   verificarDiseno(diseno){
     // Desde aqui Valido si el dispositipo donde observan la web es en movil o PC;
    if (diseno.breakpoints[Breakpoints.XSmall]) {
      this.disenoMovil = true;
    }
    if (diseno.breakpoints[Breakpoints.Large]) {
    }
    if (diseno.breakpoints[Breakpoints.XLarge]) {
    }
    if (diseno.breakpoints[Breakpoints.Small]) {
      this.disenoMovilMediano = true;
    }
    if (diseno.breakpoints[Breakpoints.Medium]) {
    }
   }

   listarContacto(){
    const uri = `${URI}/api/contacto`;
    return this.http.get(uri).pipe(
      pluck('Agenda') // solo extraigo de la respuesta del back, el array agenda que me interesa
    );
   }

   crearContacto(contacto){
     const uri = `${URI}/api/contacto`;
     return this.http.post(uri, contacto);
   }

   eliminarContacto(id){
    const uri = `${URI}/api/contacto/${id}`;
    return this.http.delete(uri);
  }

  eliminarSeleccionados(seleccion){
    const uri = `${URI}/api/contacto/eliminarSeleccionados`;
    return this.http.post(uri, seleccion);
  }


  actualizarContacto(id, contacto){
    const uri = `${URI}/api/contacto/${id}`;
    return this.http.put(uri, contacto);
  }

  listarGrupo(){
    const uri = `${URI}/api/grupo`;
    return this.http.get(uri).pipe(
      pluck('grupo') // solo extraigo de la respuesta del back, el array grupo que me interesa
    );
  }

  crearGrupo(grupo){
    const uri = `${URI}/api/grupo`;
    return this.http.post(uri, grupo);
  }

  eliminarGrupo(id){
    const uri = `${URI}/api/grupo/${id}`;
    return this.http.delete(uri);
  }


}
