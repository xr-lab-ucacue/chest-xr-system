export class ServidorMsg {
    // cliente: Cliente;
    mensaje?: string;
}

export class Usuario {
    id:                  number=0;
    cedula:              string ="111";
    nombre:              string ="aaaa";
    apellido:            string ="aaaa";
    email:               string ="aaaa";
    emailEncripted:      string="";
    password:            string ="123456";
    telefono:            string ="1111";
    direccion:           string ="aaaa";
    estado:              boolean=true;
    estadoTokenRegistro: boolean=true;
    roles:               string[]=[];
    fechaCreacion:       Date=new Date();
    longitud:            number=0;
    latitud:             number=0;
}
