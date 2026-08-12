const vehiculos = [
  {
    marca: "Audi",
    modelo: "A3",
    anio: 2011,
    motor: "1.8 TFSI",

    averias: [
      {
        nombre: "Fallos de encendido",
        sintomas: [
          "tirones",
          "motor irregular",
          "pérdida de potencia",
          "ralentí inestable",
          "dificultad de arranque"
        ],
        obd: [
          "P0300",
          "P0301",
          "P0302",
          "P0303",
          "P0304"
        ],
        posiblesCausas: [
          "bujías",
          "bobinas de encendido",
          "inyectores",
          "entrada de aire",
          "problemas de combustible",
          "baja compresión"
        ],
        pruebas: [
          "comprobar bujías",
          "intercambiar bobinas entre cilindros",
          "comprobar alimentación de combustible",
          "comprobar posibles entradas de aire",
          "realizar prueba de compresión si procede"
        ],
        gravedad: "Media/Alta"
      },

      {
        nombre: "Problemas de mezcla pobre",
        sintomas: [
          "ralentí irregular",
          "tirones",
          "pérdida de potencia",
          "respuesta irregular del acelerador"
        ],
        obd: [
          "P0171"
        ],
        posiblesCausas: [
          "entrada de aire no medida",
          "fuga de admisión",
          "sensor de masa de aire",
          "presión de combustible insuficiente",
          "inyectores"
        ],
        pruebas: [
          "comprobar fugas de admisión",
          "comprobar valores de combustible",
          "comprobar sistema de admisión",
          "comprobar sensor de masa de aire"
        ],
        gravedad: "Media"
      },

      {
        nombre: "Problemas relacionados con el catalizador",
        sintomas: [
          "pérdida de potencia",
          "testigo de motor",
          "consumo elevado",
          "funcionamiento irregular"
        ],
        obd: [
          "P0420"
        ],
        posiblesCausas: [
          "catalizador degradado",
          "sonda lambda",
          "fugas de escape",
          "problemas de combustión previos"
        ],
        pruebas: [
          "comprobar fugas de escape",
          "analizar datos de las sondas lambda",
          "comprobar historial de fallos de encendido"
        ],
        gravedad: "Media"
      }
    ]
  },

  {
    marca: "Triumph",
    modelo: "Street Triple",
    anio: 2011,
    motor: "675",

    averias: [
      {
        nombre: "Problemas de encendido",
        sintomas: [
          "tirones",
          "fallos de combustión",
          "motor que se apaga",
          "pérdida de potencia",
          "funcionamiento irregular"
        ],
        obd: [
          "P0300",
          "P0301",
          "P0302",
          "P0303"
        ],
        posiblesCausas: [
          "bujías",
          "bobinas",
          "conectores eléctricos",
          "alimentación de combustible",
          "inyectores",
          "sensorización del motor"
        ],
        pruebas: [
          "comprobar bujías",
          "comprobar bobinas",
          "revisar conectores",
          "comprobar alimentación eléctrica",
          "comprobar combustible"
        ],
        gravedad: "Media/Alta"
      },

      {
        nombre: "Problemas del sistema de carga",
        sintomas: [
          "batería descargada",
          "fallos eléctricos",
          "motor que se apaga",
          "problemas de arranque",
          "iluminación irregular"
        ],
        obd: [],
        posiblesCausas: [
          "alternador",
          "estator",
          "regulador/rectificador",
          "conectores",
          "batería"
        ],
        pruebas: [
          "medir tensión de batería",
          "comprobar tensión de carga",
          "revisar conectores",
          "comprobar estator",
          "comprobar regulador/rectificador"
        ],
        gravedad: "Alta"
      },

      {
        nombre: "Problemas de alimentación de combustible",
        sintomas: [
          "tirones",
          "pérdida de potencia",
          "dificultad de arranque",
          "motor que se apaga"
        ],
        obd: [],
        posiblesCausas: [
          "bomba de combustible",
          "inyectores",
          "filtro",
          "alimentación eléctrica de la bomba"
        ],
        pruebas: [
          "comprobar funcionamiento de la bomba",
          "comprobar presión de combustible",
          "revisar alimentación eléctrica",
          "comprobar inyectores"
        ],
        gravedad: "Media/Alta"
      }
    ]
  }
];

export function buscarVehiculo(marca, modelo, anio, motor) {

  const m = String(marca || "").toLowerCase().trim();
  const mo = String(modelo || "").toLowerCase().trim();
  const a = Number(anio);
  const mot = String(motor || "").toLowerCase().trim();

  return vehiculos.find(v => {

    const marcaOK =
      v.marca.toLowerCase() === m;

    const modeloOK =
      v.modelo.toLowerCase() === mo;

    const anioOK =
      v.anio === a;

    const motorOK =
      mot.includes(v.motor.toLowerCase()) ||
      v.motor.toLowerCase().includes(mot);

    return marcaOK && modeloOK && anioOK && motorOK;

  }) || null;
}