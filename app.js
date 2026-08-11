function analizarAveria(vehiculo, problema) {
  const texto = problema.toLowerCase();

  let causas = [];
  let comprobaciones = [];

  if (
    texto.includes("tirón") ||
    texto.includes("tirones") ||
    texto.includes("ratea") ||
    texto.includes("falla")
  ) {
    causas = [
      "Bujías o sistema de encendido",
      "Bobinas de encendido",
      "Inyección de combustible",
      "Sensor TPS o MAP",
      "Conectores o masas eléctricas"
    ];

    comprobaciones = [
      "Comprobar bujías y estado de los electrodos",
      "Revisar conectores de bobinas e inyectores",
      "Comprobar batería y tensión de carga",
      "Realizar diagnosis OBD si el vehículo dispone de ella",
      "Comprobar sensores relacionados con la admisión"
    ];

  } else if (
    texto.includes("no arranca") ||
    texto.includes("no arranca") ||
    texto.includes("arranque")
  ) {
    causas = [
      "Batería descargada o deteriorada",
      "Relé o motor de arranque",
      "Falta de combustible",
      "Bomba de combustible",
      "Sistema de encendido"
    ];

    comprobaciones = [
      "Medir la tensión de la batería",
      "Comprobar si funciona el motor de arranque",
      "Comprobar fusibles y relés",
      "Comprobar alimentación de combustible",
      "Comprobar chispa"
    ];

  } else if (
    texto.includes("calienta") ||
    texto.includes("temperatura") ||
    texto.includes("recalienta")
  ) {
    causas = [
      "Nivel bajo de refrigerante",
      "Termostato defectuoso",
      "Electroventilador",
      "Radiador obstruido",
      "Bomba de agua"
    ];

    comprobaciones = [
      "Comprobar nivel y posibles fugas de refrigerante",
      "Comprobar funcionamiento del electroventilador",
      "Revisar termostato",
      "Revisar estado del radiador",
      "Comprobar circulación del refrigerante"
    ];

  } else if (
    texto.includes("aceite") ||
    texto.includes("humo azul") ||
    texto.includes("consume aceite")
  ) {
    causas = [
      "Fuga externa de aceite",
      "Segmentos del motor",
      "Retenes de válvula",
      "Problema de ventilación del cárter",
      "Consumo interno de aceite"
    ];

    comprobaciones = [
      "Comprobar nivel de aceite",
      "Buscar fugas externas",
      "Observar el color del humo",
      "Comprobar sistema de ventilación del cárter",
      "Realizar prueba de compresión si procede"
    ];

  } else {
    causas = [
      "Problema eléctrico",
      "Sistema de combustible",
      "Sistema de encendido",
      "Sensor del motor",
      "Problema mecánico"
    ];

    comprobaciones = [
      "Comprobar batería y masas",
      "Revisar fusibles y conectores",
      "Realizar diagnosis OBD",
      "Comprobar combustible",
      "Revisar síntomas concretos del motor"
    ];
  }

  return {
    vehiculo: vehiculo || "Vehículo no especificado",
    causas: causas,
    comprobaciones: comprobaciones
  };
}