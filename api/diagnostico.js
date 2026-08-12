import { buscarVehiculo } from "../data/vehiculos.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {

    const {
      vehiculo,
      problema,
      obd = [],
      historial = []
    } = req.body;

    if (!vehiculo || !problema) {
      return res.status(400).json({
        error: "Faltan datos del vehículo"
      });
    }

    // Buscar información específica del vehículo
    const datosTecnicos = buscarVehiculo(
      vehiculo.marca,
      vehiculo.modelo,
      vehiculo.anio,
      vehiculo.motor
    );

    // Preparar información de la base de datos
    const baseTecnica = datosTecnicos
      ? JSON.stringify(datosTecnicos, null, 2)
      : "No existe información específica registrada para este vehículo.";

    // Limpiar códigos OBD
    const codigosValidos = obd
      .map(codigo =>
        String(codigo)
          .trim()
          .toUpperCase()
      )
      .filter(codigo =>
        /^[PBCU][0-9]{4}$/.test(codigo)
      );

    const obdTexto =
      codigosValidos.length > 0
        ? codigosValidos.join(", ")
        : "No se han proporcionado códigos OBD-II válidos.";

    // Historial de preguntas
    const historialTexto = historial
      .map((item, index) => {

        return `
Pregunta ${index + 1}:
${item.pregunta}

Respuesta:
${item.respuesta}
`;

      })
      .join("\n");

    const prompt = `

Eres MECÁNICO-IA.

Eres un especialista profesional en diagnóstico
de automóviles y motocicletas.

Tu objetivo es encontrar la causa más probable
de una avería utilizando:

- Datos del vehículo
- Síntomas
- Códigos OBD
- Historial de preguntas
- Base técnica de Mecánico-IA

========================

DATOS DEL VEHÍCULO

Tipo:
${vehiculo.tipo}

Marca:
${vehiculo.marca}

Modelo:
${vehiculo.modelo}

Año:
${vehiculo.anio}

Motor:
${vehiculo.motor}

Combustible:
${vehiculo.combustible}

Kilómetros:
${vehiculo.kilometros || "No indicados"}

Testigos:
${vehiculo.testigos || "No indicados"}

Reparaciones recientes:
${vehiculo.reparaciones || "No indicadas"}

========================

CÓDIGOS OBD-II

${obdTexto}

IMPORTANTE:

Un código OBD no significa automáticamente
que una pieza concreta esté averiada.

Utiliza el código como una pista y determina
qué pruebas pueden confirmar la causa.

========================

SÍNTOMAS

${problema}

========================

HISTORIAL DEL DIAGNÓSTICO

${historialTexto || "Todavía no existen respuestas."}

========================

BASE TÉCNICA DE MECÁNICO-IA

${baseTecnica}

========================

REGLAS

1. Analiza primero la información específica
del vehículo cuando exista.

2. Utiliza marca, modelo, año y motor.

3. Relaciona los códigos OBD con los síntomas.

4. No confundas un código de avería con una pieza averiada.

5. Haz UNA SOLA pregunta cada vez.

6. Cada pregunta debe servir para descartar causas.

7. No repitas preguntas.

8. Prioriza las averías conocidas del vehículo
cuando los síntomas coincidan.

9. Si una avería aparece en la base técnica,
trátala como hipótesis, no como diagnóstico confirmado.

10. Si no existe información específica del vehículo,
utiliza conocimientos generales de mecánica.

11. No inventes códigos OBD.

12. No inventes pares de apriete.

13. No inventes especificaciones técnicas.

14. No inventes precios exactos.

15. Si falta información importante, pregunta por ella.

16. Si existe riesgo de seguir circulando,
indícalo claramente.

17. Cuando tengas información suficiente,
realiza el diagnóstico final.

========================

DIAGNÓSTICO FINAL

Cuando tengas suficiente información responde:

DIAGNÓSTICO FINAL

🚗 VEHÍCULO

🔌 CÓDIGOS OBD

🔧 AVERÍA MÁS PROBABLE

📊 PROBABILIDAD APROXIMADA

🔍 CAUSAS ALTERNATIVAS

🧪 PRUEBAS RECOMENDADAS

🛠️ REPARACIÓN RECOMENDADA

💰 COSTE ESTIMADO

⭐ DIFICULTAD

⚠️ NIVEL DE URGENCIA

🚗 ¿SE PUEDE SEGUIR CIRCULANDO?

📋 RECOMENDACIONES FINALES

Si todavía necesitas información,
responde únicamente con UNA pregunta.

`;

    // Llamada a OpenAI
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`
        },

        body: JSON.stringify({

          model: "gpt-4o-mini",

          messages: [
            {
              role: "system",
              content:
                "Eres Mecánico-IA, especialista en diagnóstico de coches y motos."
            },
            {
              role: "user",
              content: prompt
            }
          ],

          temperature: 0.2,

          max_tokens: 1800
        })
      }
    );

    if (!openaiResponse.ok) {

      const error =
        await openaiResponse.text();

      console.error(error);

      return res.status(500).json({
        error: "Error de OpenAI"
      });
    }

    const data =
      await openaiResponse.json();

    const respuesta =
      data.choices?.[0]?.message?.content || "";

    const final =
      respuesta.includes("DIAGNÓSTICO FINAL");

    return res.status(200).json({
      respuesta,
      final
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}