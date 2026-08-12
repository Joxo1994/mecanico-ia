let diagnostico = {
  vehiculo: "",
  tipo: "",
  problema: "",
  historial: []
};

let numeroPregunta = 0;

async function iniciarDiagnostico() {

  const vehiculo = document.getElementById("vehiculo").value.trim();
  const tipo = document.getElementById("tipo").value;
  const problema = document.getElementById("problema").value.trim();

  if (!vehiculo || !problema) {
    mostrarMensaje("⚠️ Introduce el vehículo y describe el problema.");
    return;
  }

  diagnostico = {
    vehiculo,
    tipo,
    problema,
    historial: []
  };

  numeroPregunta = 1;

  document.getElementById("btnDiagnostico").disabled = true;

  document.getElementById("zonaDiagnostico").style.display = "block";

  await enviarDiagnostico();
}


async function responderPregunta() {

  const respuesta = document
    .getElementById("respuestaUsuario")
    .value
    .trim();

  if (!respuesta) {
    mostrarMensaje("⚠️ Escribe una respuesta.");
    return;
  }

  diagnostico.historial.push({
    pregunta: document.getElementById("pregunta").innerText,
    respuesta: respuesta
  });

  document.getElementById("respuestaUsuario").value = "";

  numeroPregunta++;

  await enviarDiagnostico();
}


async function enviarDiagnostico() {

  mostrarMensaje("🤖 Mecánico-IA está analizando...");

  try {

    const response = await fetch("/api/diagnostico", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(diagnostico)

    });

    if (!response.ok) {
      throw new Error("Error en el servidor");
    }

    const data = await response.json();

    ocultarMensaje();

    if (data.final) {

      document.getElementById("zonaDiagnostico").style.display = "none";

      document.getElementById("resultado").style.display = "block";

      document.getElementById("textoResultado").innerText =
        data.respuesta;

      return;
    }

    document.getElementById("progreso").innerText =
      "Pregunta " + numeroPregunta;

    document.getElementById("pregunta").innerText =
      data.respuesta;

  } catch (error) {

    console.error(error);

    mostrarMensaje(
      "❌ No se ha podido conectar con Mecánico-IA."
    );
  }
}


function nuevoDiagnostico() {

  diagnostico = {
    vehiculo: "",
    tipo: "",
    problema: "",
    historial: []
  };

  numeroPregunta = 0;

  document.getElementById("vehiculo").value = "";
  document.getElementById("problema").value = "";

  document.getElementById("resultado").style.display = "none";

  document.getElementById("zonaDiagnostico").style.display = "none";

  document.getElementById("btnDiagnostico").disabled = false;
}


function mostrarMensaje(texto) {

  const mensaje = document.getElementById("mensaje");

  mensaje.innerText = texto;

  mensaje.style.display = "block";
}


function ocultarMensaje() {

  document.getElementById("mensaje").style.display = "none";
}