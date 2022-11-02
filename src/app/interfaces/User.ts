export class ServidorMsg {
    // cliente: Cliente;
    mensaje?: string;
}

export class Usuario {
    id?:                  number;
    cedula?:              string;
    nombre?:              string;
    apellido?:            string;
    email?:               string;
    emailEncripted?:      string;
    password?:            string;
    telefono?:            string;
    direccion?:           string;
    estado?:              boolean;
    estadoTokenRegistro?: boolean;
    roles?:               null[];
    fechaCreacion?:       Date;
    longitud?:            null;
    latitud?:             null;
}
