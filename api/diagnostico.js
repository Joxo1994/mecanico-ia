export default async function handler(req, res) {
  // Permitir que nuestra página de GitHub pueda llamar a esta función
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://joxo1994.github.io"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {
    const { vehiculo, problema } = req.body;

    if (!vehiculo || !problema) {
      return res.status(400).json({
        error: "Faltan datos del vehículo o del problema"
      });
    }

    const respuesta = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          input: `
Eres Mecánico IA, un asistente especializado en diagnóstico
de coches y motocicletas.

Vehículo:
${vehiculo}

Problema descrito:
${problema}

Analiza la avería de forma profesional.

Responde en español y estructura la respuesta así:

1. DIAGNÓSTICO PROBABLE
2. POSIBLES CAUSAS
3. COMPROBACIONES QUE DEBE HACER EL USUARIO
4. ORDEN RECOMENDADO DE COMPROBACIÓN
5. POSIBLE SOLUCIÓN
6. NIVEL DE CONFIANZA

No inventes datos específicos del vehículo.
Si falta información importante, indica qué dato necesitas.
No recomiendes sustituir piezas sin realizar comprobaciones.
`
        })
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      return res.status(respuesta.status).json({
        error: datos.error?.message || "Error de OpenAI"
      });
    }

    return res.status(200).json({
      respuesta: datos.output_text
    });

  } catch (error) {

    return res.status(500).json({
      error: "Error interno del servidor"
    });

  }
}