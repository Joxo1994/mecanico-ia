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

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OPENAI_API_KEY no está configurada");

      return res.status(500).json({
        error: "OPENAI_API_KEY no está configurada en Vercel"
      });
    }

    const prompt = `
Eres Mecánico-IA, un experto en diagnóstico de coches y motos.

Vehículo:
${vehiculo || "No especificado"}

Problema:
${consulta}

Responde en español y de forma práctica:

1. Posibles causas, de más probable a menos probable.
2. Comprobaciones que puede hacer el usuario.
3. Herramientas necesarias.
4. Posible reparación.
5. Dificultad: fácil, media o difícil.
6. Indica claramente si existe riesgo de seguir circulando.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-5.4-mini",
        input: prompt
      })
    });

    const data = await response.json();

    console.log("OpenAI status:", response.status);
    console.log("OpenAI response:", JSON.stringify(data));

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI rechazó la petición",
        status: response.status
      });
    }

    return res.status(200).json({
      respuesta: data.output_text || "No se recibió respuesta de OpenAI."
    });

  } catch (error) {
    console.error("Error interno:", error);

    return res.status(500).json({
      error: error.message || "Error interno del servidor"
    });
  }
}