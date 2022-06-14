import { FormGroup } from "@angular/forms";

//Validador para hacer que coincidan los dos campos con el password
export function MustMatch(controlName:string,matchingControlName:string){
    return (formGroup:FormGroup)=>{
        const control=formGroup.controls[controlName];
        const matchingControl=formGroup.controls[matchingControlName];
        if (matchingControl.errors && ! matchingControl.errors["mustMatch"]){
            //Ejecutamos return si otro validador ha encontrado errores
            //en control de errores matchingControl
            return;
        }

        //Establecemos el conrtol de errores matchingControl
        //en verdadero si la validacion falla
        if(control.value !=matchingControl.value){
            matchingControl.setErrors({mustMatch:true});
        }else{
            matchingControl.setErrors(null);
        }
    }
}