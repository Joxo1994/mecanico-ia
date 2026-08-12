import { buscarVehiculo } from "../data/vehiculos.js";

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

Eres un especialista en diagnóstico de automóviles
y motocicletas.

Debes realizar un diagnóstico progresivo y técnico.

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

Los códigos OBD son códigos de diagnóstico,
NO son automáticamente piezas averiadas.

Por ejemplo:

P0301 significa fallo de combustión/encendido
detectado en el cilindro 1.

No debes afirmar automáticamente que la bobina,
bujía, inyector o cilindro está averiado.

Debes utilizar pruebas para determinar la causa.

========================

SÍNTOMAS

${problema}

========================

HISTORIAL

${historialTexto || "Todavía no hay respuestas."}

========================

REGLAS

1. Analiza el vehículo concreto.

2. Ten en cuenta marca, modelo, año y motor.

3. Analiza los códigos OBD junto con los síntomas.

4. No confundas código de avería con pieza averiada.

5. Haz UNA sola pregunta cada vez.

6. Cada pregunta debe ayudar a descartar causas.

7. No repitas preguntas.

8. Si el código puede tener varias causas, explica qué pruebas
permiten diferenciarlas.

9. No inventes especificaciones técnicas.

10. No inventes pares de apriete.

11. No inventes códigos OBD.

12. No inventes precios exactos.

13. Si falta una información fundamental, pregunta por ella.

14. Si existe riesgo de continuar circulando, indícalo.

15. Cuando tengas suficiente información, realiza el diagnóstico.

========================

DIAGNÓSTICO FINAL

Cuando tengas suficiente información responde exactamente
con esta estructura:

DIAGNÓSTICO FINAL

🚗 VEHÍCULO
Indica el vehículo analizado.

🔌 CÓDIGOS OBD
Explica el significado de cada código recibido.

🔧 AVERÍA MÁS PROBABLE
Indica la causa más probable.

📊 PROBABILIDAD
Da una estimación aproximada y explica por qué.

🔍 CAUSAS ALTERNATIVAS
Enumera otras causas posibles.

🧪 PRUEBAS RECOMENDADAS
Explica las comprobaciones en orden lógico.

🛠️ REPARACIÓN
Indica qué debería repararse si las pruebas lo confirman.

💰 COSTE ESTIMADO
Indica un rango aproximado de piezas y mano de obra.
Aclara que puede variar según país y taller.

⭐ DIFICULTAD
Fácil / Media / Difícil / Profesional.

⚠️ URGENCIA
Baja / Media / Alta / No circular.

🚗 ¿SE PUEDE SEGUIR CIRCULANDO?
Explica claramente el riesgo.

📋 RECOMENDACIONES
Indica los siguientes pasos.

========================

Si todavía necesitas información,
responde únicamente con UNA pregunta.

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