import { IUsuario } from "./usuario.interface";


export interface ILoginResponse {
  token: string;
  usuario: IUsuario;
}