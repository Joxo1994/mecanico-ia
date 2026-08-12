export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {
    const { consulta, vehiculo } = req.body || {};

    if (!consulta) {
      return res.status(400).json({
        error: "Escribe una consulta sobre el problema del vehículo"
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Falta configurar OPENAI_API_KEY en Vercel"
      });
    }

    const prompt = `
Eres Mecánico-IA, un asistente experto en diagnóstico de coches y motos.

Analiza el problema descrito por el usuario y responde en español.

Vehículo:
${vehiculo || "No especificado"}

Problema:
${consulta}

Da una respuesta práctica y ordenada:

1. Posibles causas, de más probable a menos probable.
2. Comprobaciones que puede hacer el usuario.
3. Herramientas necesarias.
4. Qué reparación podría solucionar el problema.
5. Nivel de dificultad: fácil, medio o difícil.
6. Si existe riesgo de seguir circulando, indícalo claramente.

No inventes datos técnicos específicos del vehículo si no están disponibles.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.4-mini",
        input: prompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error OpenAI:", data);

      return res.status(response.status).json({
        error: data?.error?.message || "Error al conectar con OpenAI"
      });
    }

    const respuesta = data.output_text || "No se recibió respuesta de la IA.";

    return res.status(200).json({
      respuesta
    });

  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}