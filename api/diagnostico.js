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


    // ==========================================
    // BASE TÉCNICA
    // ==========================================

    const baseTecnica = `

TRIUMPH STREET TRIPLE 675 - 2011

Averías conocidas:

1. Problemas de encendido
Síntomas:
- Tirones
- Fallos de combustión
- Pérdida de potencia
- Motor que se apaga
- Funcionamiento irregular

Códigos relacionados:
P0300
P0301
P0302
P0303

Posibles causas:
- Bujías
- Bobinas
- Conectores eléctricos
- Alimentación de combustible
- Inyectores
- Sensores del motor

Pruebas:
- Comprobar bujías
- Comprobar bobinas
- Revisar conectores
- Comprobar alimentación eléctrica
- Comprobar combustible


2. Problemas del sistema de carga

Síntomas:
- Batería descargada
- Fallos eléctricos
- Motor que se apaga
- Problemas de arranque
- Iluminación irregular

Posibles causas:
- Estator
- Regulador/rectificador
- Batería
- Conectores

Pruebas:
- Medir tensión de batería
- Comprobar tensión de carga
- Revisar conectores
- Comprobar estator
- Comprobar regulador/rectificador


AUDI A3 1.8 TFSI - 2011

Averías conocidas:

1. Fallos de encendido

Síntomas:
- Tirones
- Pérdida de potencia
- Ralentí irregular
- Dificultad de arranque

Códigos:
P0300
P0301
P0302
P0303
P0304

Posibles causas:
- Bujías
- Bobinas
- Inyectores
- Entrada de aire
- Combustible
- Compresión


2. Mezcla pobre

Código:
P0171

Posibles causas:
- Fugas de admisión
- Entrada de aire no medida
- Sensor de masa de aire
- Presión de combustible
- Inyectores


3. Eficiencia del catalizador

Código:
P0420

Posibles causas:
- Catalizador
- Sonda lambda
- Fugas de escape
- Problemas de combustión

`;


    // ==========================================
    // CÓDIGOS OBD
    // ==========================================

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
      codigosValidos.length
        ? codigosValidos.join(", ")
        : "No se han introducido códigos OBD válidos.";


    // ==========================================
    // HISTORIAL
    // ==========================================

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


    // ==========================================
    // PROMPT
    // ==========================================

    const prompt = `

Eres MECÁNICO-IA.

Eres un especialista en diagnóstico de coches
y motocicletas.

Debes realizar un diagnóstico progresivo.

========================

VEHÍCULO

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

CÓDIGOS OBD

${obdTexto}

========================

SÍNTOMAS

${problema}

========================

HISTORIAL

${historialTexto || "No existen preguntas anteriores."}

========================

BASE TÉCNICA

${baseTecnica}

========================

REGLAS

1. Analiza marca, modelo, año y motor.

2. Utiliza los códigos OBD como pistas.

3. Un código OBD NO significa automáticamente que una pieza esté averiada.

4. Utiliza los síntomas para confirmar o descartar causas.

5. Haz UNA SOLA pregunta cada vez.

6. No repitas preguntas.

7. Prioriza las causas más compatibles con los síntomas.

8. Si necesitas información importante, pregunta por ella.

9. No inventes datos técnicos.

10. No inventes pares de apriete.

11. No inventes precios exactos.

12. Si existe riesgo para circular, adviértelo.

13. Cuando tengas suficiente información, realiza el diagnóstico final.

========================

SI TODAVÍA NECESITAS INFORMACIÓN

Responde únicamente con UNA pregunta.

========================

SI YA TIENES INFORMACIÓN SUFICIENTE

Empieza exactamente con:

DIAGNÓSTICO FINAL

Y utiliza:

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

`;


    // ==========================================
    // OPENAI
    // ==========================================

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

      console.error(
        "OPENAI ERROR:",
        error
      );

      return res.status(500).json({
        error: "Error de OpenAI"
      });
    }


    const data =
      await openaiResponse.json();


    const respuesta =
      data.choices?.[0]?.message?.content || "";


    if (!respuesta) {

      return res.status(500).json({
        error: "OpenAI no devolvió respuesta"
      });

    }


    const final =
      respuesta.includes(
        "DIAGNÓSTICO FINAL"
      );


    return res.status(200).json({
      respuesta,
      final
    });


  } catch (error) {

    console.error(
      "ERROR DIAGNOSTICO:",
      error
    );

    return res.status(500).json({
      error: "Error interno del servidor"
    });

  }
}