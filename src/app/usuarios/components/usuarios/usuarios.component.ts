import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { Router, RouterEvent } from '@angular/router'
import { UsuariosService } from '../../services/usuarios.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

import { MustMatch } from '../../helpers/must-match.validator';
import { UsuariosI } from '../../models/usuarios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  closeResult: string = '';
  public usuarios: any = [];
  public registerForm: FormGroup | any;
  public updateForm: FormGroup|any;
  public submited = false;
  public user: UsuariosI | any;
  // public usuarios = [];
  constructor(private usuariosService: UsuariosService, 
    private router: Router, public modal: NgbModal, 
    public modalDelete: NgbModal, private formBuilder: FormBuilder, 
    public formBuilderUpdate: FormBuilder, public modalUpdate: NgbModal) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      _id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordconfirm: ['', Validators.required],
      tipo: ['', Validators.required]

    },
      {
        validator: MustMatch('password', 'passwordconfirm')
      }
    );

    this.updateForm = this.formBuilder.group({
      _id: [''],
      name: [null, [Validators.required, Validators.min(1)]],
      email: [null, [Validators.required, Validators.email, Validators.min(2)]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.min(2)]],
      tipo: [null, [Validators.required, Validators.min(1)]]
    },
    );

    this.updateForm = this.formBuilderUpdate.group({
      _id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      tipo: ['', Validators.required],
    });

    this.getUsuarios();
  }

  get fields() { return this.registerForm?.controls; }

  getUsuarios() {
    this.usuariosService.getUsers().subscribe(res => {
      console.log(res);
      this.usuarios = res as UsuariosI[];
    })
  }

  mostrarUsuario(_id: string) {
    this.router.navigate(['usuarios/' + _id])
  }

  open(content: any) {
    this.registerForm.reset();
    this.modal.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // onSubmit() {
  //   this.submited = true;
  //   if (this.registerForm.controls["name"].status == "INVALID" ||
  //     this.registerForm.controls["email"].status == "INVALID" ||
  //     this.registerForm.controls["password"].status == "INVALID" ||
  //     this.registerForm.controls["passwordconfirm"].status == "INVALID") {
  //     return;
  //   }
  //   console.log(this.registerForm.value);

  //   let usuario: UsuariosI = {
  //     _id: 0,
  //     name: this.registerForm.value.name,
  //     email: this.registerForm.value.email,
  //     password: this.registerForm.value.passowrd,
  //     tipo: this.registerForm.value.tipo
  //   }

  //   this.usuariosService.addUser(usuario).subscribe(res => {
  //     if (res.hasOwnProperty('message')) {
  //       let error: any = res;
  //       if (error.message == 'Error user exists') {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: 'Error, el email ya está en uso, por favor utilice otro',
  //           confirmButtonColor: '#A1260C'
  //         });
  //         return;
  //       } //Usuario existe
  //     } else {
  //       this.getUsuarios();
  //       this.registerForm.reset();
  //       this.modal.dismissAll();
  //     }
  //   })
  // } // Fin del onSubmit

  onSubmit() {
    this.submited = true;
    if (this.registerForm.invalid) {
      return;
    }
    //console.log(this.registerForm.value);
    let usuario = {
      _id: 0,
      name: '',
      email: '',
      password: '',
      tipo: 1
    }
    usuario.name = this.registerForm.value.name;
    usuario.email = this.registerForm.value.email;
    usuario.password = this.registerForm.value.password;
    usuario.tipo = this.registerForm.value.tipo;

    this.usuariosService.addUser(usuario)
      .subscribe(response => {
        this.getUsuarios;
        this.registerForm.reset();
        this.modal.dismissAll();
      })
  }

  abrirModalEliminar(id: string, modalname: any) {
    this.usuariosService.getUser(id).subscribe(res => {
      this.user = res as UsuariosI;
    })
    this.modalDelete.open(modalname, { size: 'sm' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteUser(id:string) {
    // console.log(id);
    this.usuariosService.removeUser(id).subscribe(res => {
      Swal.fire({
        icon: 'error',
        title: 'Usuario eliminado correctamente',
        confirmButtonColor: '#A1260C',
      })
      this.getUsuarios();
      this.modalDelete.dismissAll();
    })
  }

  modificarUsuario(usuario: UsuariosI, modal: any) {
    // console.log(usuario);
    this.updateForm = this.formBuilderUpdate.group({
      _id: [usuario._id],
      name: [usuario.name, Validators.required],
      email: [usuario.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      tipo: [usuario.tipo, Validators.required]
    });
    this.modal.open(modal, { size: 'sm' }).result.then((result) => {
      this.closeResult = `Close with: ${result}`
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }//Fin de modificarUsuario

  updateSubmit() {
    if (
      this.updateForm.controls["name"].status == "INVALID" ||
      this.updateForm.controls["email"].status == "INVALID" ||
      this.updateForm.controls["password"].status == "INVALID"
    ) {
      return;
    }
    //console.log(this.updateForm.value);
    let usuario: UsuariosI = {
      _id: this.updateForm.value._id,
      name: this.updateForm.value.name,
      email: this.updateForm.value.email,
      password: this.updateForm.value.password,
      tipo: this.updateForm.value.tipo
    }

    this.usuariosService.updateUser(usuario).subscribe(res => {
      console.log(res);
      if (res.hasOwnProperty('message')) {
        let error: any = res;
        if (error.message == 'Error al actualizar el usuario') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error, al actualizar el usuario',
            confirmButtonColor: '#A1260C'
          });
          return;
        }//Fin error al actualizar
      } //Fin res.hasOwnProperty
      Swal.fire({
        icon: 'success',
        title: 'Actualización exitosa',
        text: 'Usuario actualizado de manera exitosa',
        confirmButtonColor: '#3FEE0A'
      });
      this.getUsuarios();
      this.registerForm();
      this.modal.dismissAll();
    });
  }

  cancelUpdate() {
    this.modalUpdate.dismissAll();
  }
}
