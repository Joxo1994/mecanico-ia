let diagnostico = {
  vehiculo: {},
  problema: "",
  obd: [],
  historial: []
};

let numeroPregunta = 0;


// ==========================================
// INICIAR DIAGNÓSTICO
// ==========================================

async function iniciarDiagnostico() {

  const tipo =
    document.getElementById("tipo").value;

  const marca =
    document.getElementById("marca").value.trim();

  const modelo =
    document.getElementById("modelo").value.trim();

  const anio =
    document.getElementById("anio").value.trim();

  const motor =
    document.getElementById("motor").value.trim();

  const combustible =
    document.getElementById("combustible").value;

  const kilometros =
    document.getElementById("kilometros").value.trim();

  const problema =
    document.getElementById("problema").value.trim();

  const testigos =
    document.getElementById("testigos").value.trim();

  const reparaciones =
    document.getElementById("reparaciones").value.trim();

  const obdTexto =
    document.getElementById("codigosOBD").value.trim();


  // Comprobar datos obligatorios

  if (
    !marca ||
    !modelo ||
    !anio ||
    !motor ||
    !problema
  ) {

    mostrarMensaje(
      "⚠️ Completa marca, modelo, año, motor y describe el problema."
    );

    return;
  }


  // ==========================================
  // PROCESAR CÓDIGOS OBD
  // ==========================================

  const obd = obdTexto
    ? obdTexto
        .toUpperCase()
        .split(/[,\s]+/)
        .map(codigo => codigo.trim())
        .filter(codigo =>
          /^[PBCU][0-9]{4}$/.test(codigo)
        )
    : [];


  // ==========================================
  // CREAR DIAGNÓSTICO
  // ==========================================

  diagnostico = {

    vehiculo: {

      tipo,
      marca,
      modelo,
      anio,
      motor,
      combustible,
      kilometros,
      testigos,
      reparaciones

    },

    problema,

    obd,

    historial: []

  };


  numeroPregunta = 1;


  // Desactivar botón

  document.getElementById(
    "btnInicio"
  ).disabled = true;


  // Ocultar formulario

  document.getElementById(
    "formulario"
  ).style.display = "none";


  // Mostrar diagnóstico

  document.getElementById(
    "zonaDiagnostico"
  ).style.display = "block";


  await enviarDiagnostico();
}



// ==========================================
// RESPONDER PREGUNTA
// ==========================================

async function responderPregunta() {

  const respuesta =
    document
      .getElementById("respuestaUsuario")
      .value
      .trim();


  if (!respuesta) {

    mostrarMensaje(
      "⚠️ Escribe una respuesta antes de continuar."
    );

    return;
  }


  // Guardar pregunta + respuesta

  diagnostico.historial.push({

    pregunta:
      document
        .getElementById("pregunta")
        .innerText,

    respuesta

  });


  // Limpiar campo

  document.getElementById(
    "respuestaUsuario"
  ).value = "";


  numeroPregunta++;


  await enviarDiagnostico();
}



// ==========================================
// ENVIAR DATOS A LA IA
// ==========================================

async function enviarDiagnostico() {

  mostrarMensaje(
    "🤖 Mecánico-IA está analizando..."
  );


  try {

    const response = await fetch(
      "/api/diagnostico",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body:
          JSON.stringify(diagnostico)

      }
    );


    if (!response.ok) {

      throw new Error(
        "Error del servidor"
      );

    }


    const data =
      await response.json();


    ocultarMensaje();


    // ======================================
    // DIAGNÓSTICO FINAL
    // ======================================

    if (data.final) {

      document.getElementById(
        "zonaDiagnostico"
      ).style.display = "none";


      document.getElementById(
        "resultado"
      ).style.display = "block";


      document.getElementById(
        "textoResultado"
      ).innerText =
        data.respuesta;


      return;
    }


    // ======================================
    // SIGUIENTE PREGUNTA
    // ======================================

    document.getElementById(
      "progreso"
    ).innerText =
      "Pregunta " +
      numeroPregunta;


    document.getElementById(
      "pregunta"
    ).innerText =
      data.respuesta;


  } catch (error) {

    console.error(error);


    mostrarMensaje(
      "❌ No se ha podido conectar con Mecánico-IA."
    );

  }

}



// ==========================================
// NUEVO DIAGNÓSTICO
// ==========================================

function nuevoDiagnostico() {

  diagnostico = {

    vehiculo: {},

    problema: "",

    obd: [],

    historial: []

  };


  numeroPregunta = 0;


  // Mostrar formulario

  document.getElementById(
    "formulario"
  ).style.display = "block";


  // Ocultar resultado

  document.getElementById(
    "resultado"
  ).style.display = "none";


  // Ocultar zona de preguntas

  document.getElementById(
    "zonaDiagnostico"
  ).style.display = "none";


  // Reactivar botón

  document.getElementById(
    "btnInicio"
  ).disabled = false;


  // Limpiar campos

  document
    .querySelectorAll(
      "input, textarea"
    )
    .forEach(element => {

      element.value = "";

    });

}



// ==========================================
// MENSAJES
// ==========================================

function mostrarMensaje(texto) {

  const mensaje =
    document.getElementById(
      "mensaje"
    );


  mensaje.innerText = texto;


  mensaje.style.display =
    "block";

}


function ocultarMensaje() {

  document.getElementById(
    "mensaje"
  ).style.display =
    "none";

}