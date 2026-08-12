async function diagnosticar() {
  const consulta = document.getElementById("consulta").value;
  const vehiculo = document.getElementById("vehiculo").value;
  const resultado = document.getElementById("resultado");

  if (!consulta.trim()) {
    resultado.innerHTML = "⚠️ Escribe el problema de tu coche o moto.";
    return;
  }

  resultado.innerHTML = "🔧 Analizando el problema...";

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
      throw new Error(data.error || "Error al conectar con Mecánico-IA");
    }

    resultado.innerHTML = `
      <h3>🔧 Diagnóstico</h3>
      <div>${formatearRespuesta(data.respuesta)}</div>
    `;

  } catch (error) {
    console.error(error);

    resultado.innerHTML = `
      <p>❌ No se ha podido conectar con Mecánico-IA.</p>
      <p>${error.message}</p>
    `;
  }
}

function formatearRespuesta(texto) {
  return texto
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}