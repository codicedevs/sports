//crear un context para el modal que tenga los valores open true o false 
// //este context nos permite modificar este boolean desde cualquier lado 
import { Context, createContext } from "react";

interface ModalContextSet { 
    open: boolean;
    setOpen: ((value:boolean)=>void)
  }; 


 export const ModalContext = createContext<ModalContextSet>({
    open: false, setOpen: ((value)=>{})
 })