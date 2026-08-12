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
      historial = []
    } = req.body;


    if (!vehiculo || !problema) {

      return res.status(400).json({
        error: "Faltan datos del vehículo"
      });

    }


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

Eres un especialista profesional en diagnóstico de AUTOMÓVILES y MOTOCICLETAS.

Tu trabajo es realizar un diagnóstico progresivo utilizando los datos específicos del vehículo y los síntomas proporcionados.

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
${vehiculo.testigos || "Ninguno indicado"}

Reparaciones recientes:
${vehiculo.reparaciones || "Ninguna indicada"}

========================

PROBLEMA

${problema}

========================

HISTORIAL DEL DIAGNÓSTICO

${historialTexto || "Todavía no se han realizado preguntas."}

========================

REGLAS DEL DIAGNÓSTICO

1. Analiza primero las averías más habituales para ese tipo de vehículo.

2. Utiliza el año, motor y modelo para mejorar el diagnóstico.

3. Haz solamente UNA pregunta cada vez.

4. Cada pregunta debe ayudar a descartar una o varias averías.

5. No repitas preguntas ya realizadas.

6. No hagas preguntas innecesarias.

7. Si falta información esencial como código de motor, versión o síntoma concreto, pregunta por ella.

8. No inventes datos específicos del vehículo.

9. No inventes códigos OBD.

10. No inventes pares de apriete.

11. No inventes precios exactos.

12. Si existe riesgo de avería grave, indícalo.

13. Si ya existe información suficiente, realiza el diagnóstico final.

========================

DIAGNÓSTICO FINAL

Cuando tengas suficiente información debes responder con:

DIAGNÓSTICO FINAL

🔧 Avería más probable

📊 Probabilidad aproximada

🔍 Síntomas que coinciden

🧩 Posibles causas alternativas

🧪 Pruebas recomendadas

🛠️ Reparación recomendada

💰 Coste aproximado de piezas

👨‍🔧 Coste aproximado de mano de obra

⭐ Dificultad de reparación

⚠️ Nivel de urgencia

🚗 ¿Se puede seguir circulando?

📋 Recomendaciones finales

========================

Si todavía necesitas información, responde únicamente con UNA pregunta.

`;


    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`

        },

        body: JSON.stringify({

          model: "gpt-4o-mini",

          messages: [

            {
              role: "system",
              content:
                "Eres Mecánico-IA, especialista en diagnóstico de vehículos."
            },

            {
              role: "user",
              content: prompt
            }

          ],

          temperature: 0.2,

          max_tokens: 1500

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
      respuesta.includes(
        "DIAGNÓSTICO FINAL"
      );


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