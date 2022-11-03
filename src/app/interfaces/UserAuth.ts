export interface Usuario2 {
    cliente: Cliente2;
    mensaje?: string;
}

export interface Cliente2 {
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
