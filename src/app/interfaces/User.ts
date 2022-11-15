export class ServidorMsg {
    // cliente: Cliente;
    mensaje?: string;
}

export class Usuario {
    id?:                  number;
    cedula?:              string ="111";
    nombre?:              string ="aaaa";
    apellido?:            string ="aaaa";
    email:               string ="aaaa";
    emailEncripted?:      string;
    password:            string ="123456";
    telefono?:            string ="1111";
    direccion?:           string ="aaaa";
    estado?:              boolean;
    estadoTokenRegistro?: boolean;
    roles?:               string[]=[];
    fechaCreacion?:       Date;
    longitud?:            null;
    latitud?:             null;
}
