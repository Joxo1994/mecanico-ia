export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {
    const { mensaje, vehiculo } = req.body || {};

    if (!mensaje) {
      return res.status(400).json({
        error: "Falta el mensaje"
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY no está configurada en Vercel"
      });
    }

    const prompt = `
Eres MECÁNICO-IA, un experto en diagnóstico y reparación de coches y motocicletas.

Analiza el problema del vehículo y responde en español de forma clara y práctica.

Vehículo:
${vehiculo || "No especificado"}

Problema descrito:
${mensaje}

Debes:
1. Indicar las causas más probables.
2. Ordenarlas de más probable a menos probable.
3. Explicar cómo comprobar cada causa.
4. Indicar qué herramientas pueden ser necesarias.
5. Indicar una posible reparación.
6. Avisar si existe algún riesgo de seguridad.

No inventes datos. Si falta información importante, pregunta por ella.
`;

    const respuesta = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          input: prompt
        })
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      console.error("Error OpenAI:", datos);

      return res.status(respuesta.status).json({
        error: datos?.error?.message || "Error al conectar con OpenAI"
      });
    }

    const texto =
      datos.output_text ||
      datos.output
        ?.flatMap(item => item.content || [])
        ?.map(item => item.text || "")
        ?.join("") ||
      "No se recibió una respuesta de la IA.";

    return res.status(200).json({
      respuesta: texto
    });

  } catch (error) {
    console.error("Error del servidor:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}