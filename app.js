async function iniciarDiagnostico() {
  const btn = document.getElementById("btnInicio");
  const mensaje = document.getElementById("mensaje");
  const formulario = document.getElementById("formulario");
  const resultado = document.getElementById("resultado");
  const textoResultado = document.getElementById("textoResultado");

  const tipo = document.getElementById("tipo").value;
  const marca = document.getElementById("marca").value;
  const modelo = document.getElementById("modelo").value;
  const anio = document.getElementById("anio").value;
  const motor = document.getElementById("motor").value;
  const combustible = document.getElementById("combustible").value;
  const kilometros = document.getElementById("kilometros").value;
  const codigosOBD = document.getElementById("codigosOBD").value;
  const problema = document.getElementById("problema").value;
  const testigos = document.getElementById("testigos").value;
  const reparaciones = document.getElementById("reparaciones").value;

  if (!problema.trim()) {
    mensaje.style.display = "block";
    mensaje.innerHTML = "⚠️ Describe primero el problema o los síntomas del vehículo.";
    return;
  }

  const vehiculo = `
Tipo: ${tipo}
Marca: ${marca || "No indicado"}
Modelo: ${modelo || "No indicado"}
Año: ${anio || "No indicado"}
Motor: ${motor || "No indicado"}
Combustible: ${combustible || "No indicado"}
Kilómetros: ${kilometros || "No indicados"}
Códigos OBD-II: ${codigosOBD || "Ninguno"}
Testigos: ${testigos || "Ninguno"}
Reparaciones recientes: ${reparaciones || "Ninguna"}
`;

  const consulta = `
Problema y síntomas:
${problema}

Información adicional:
${reparaciones || "Ninguna"}

Testigos:
${testigos || "Ninguno"}

Códigos OBD:
${codigosOBD || "Ninguno"}
`;

  btn.disabled = true;
  btn.innerHTML = "🔧 Analizando...";

  mensaje.style.display = "block";
  mensaje.innerHTML = "🔧 Mecánico-IA está analizando el vehículo...";

  try {
    const response = await fetch("/api/diagnostico", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        consulta: consulta,
        vehiculo: vehiculo
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al conectar con OpenAI");
    }

    formulario.style.display = "none";
    mensaje.style.display = "none";
    resultado.style.display = "block";

    textoResultado.innerHTML = formatearRespuesta(
      data.respuesta || "No se recibió ningún diagnóstico."
    );

  } catch (error) {
    console.error(error);

    mensaje.style.display = "block";
    mensaje.innerHTML = `
      ❌ <strong>No se ha podido conectar con Mecánico-IA.</strong><br><br>
      ${error.message}
    `;

  } finally {
    btn.disabled = false;
    btn.innerHTML = "🔍 Iniciar diagnóstico";
  }
}


function responderPregunta() {
  iniciarDiagnostico();
}


function nuevoDiagnostico() {
  document.getElementById("formulario").style.display = "block";
  document.getElementById("resultado").style.display = "none";
  document.getElementById("mensaje").style.display = "none";

  document.getElementById("problema").value = "";
  document.getElementById("testigos").value = "";
  document.getElementById("reparaciones").value = "";
  document.getElementById("codigosOBD").value = "";
}


function formatearRespuesta(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}