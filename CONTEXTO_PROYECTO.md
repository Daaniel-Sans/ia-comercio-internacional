# Contexto del proyecto

Un cliente tiene una empresa de comercio internacional. Tiene miles de valoraciones y consultas de clientes que hablan español e inglés. Necesitan optimizar los costes de su plataforma web y automatizar la atención al cliente.

Para ello, solicitan el desarrollo de una prueba de concepto que resuelva dos necesidades en su panel de administración:

- **Traducción rápida y gratuita en el cliente:** quiere que el personal de atención al cliente traduzca borradores de descripciones y tickets internamente desde el propio navegador, sin que cada traducción genere costes de API externa ni sobrecargue los servidores de la empresa.

- **Generación automática de respuestas y clasificación (JSON) en el backend:** cuando entra una consulta de un cliente, el backend debe analizar el mensaje, devolver una clasificación estructurada (categoría y prioridad) y redactar un borrador de respuesta oficial utilizando la API de Gemini.

## Componentes de la solución

La solución debe dividirse en dos componentes:

### 1. Frontend: Traductor offline

- **Biblioteca:** integración de `@huggingface/transformers` vía CDN.
- **Inferencia local:** carga y ejecución de los modelos:
  - `Xenova/opus-mt-en-es` (para traducir de inglés a español).
  - `Xenova/opus-mt-es-en` (de español a inglés).

  Ambos modelos deben utilizar el patrón `pipeline` en JavaScript.
- **Rendimiento:** detección de aceleración por hardware (usar WebGPU con fallback a WASM).
- **Interfaz básica:** un botón para cambiar entre inglés-español y español-inglés, un campo de texto, botón de traducción, indicador de estado («Cargando modelo...», «Traduciendo...») y caja de resultado.

El estilo de la interfaz, así como cualquier otro elemento adicional, queda a libre elección del desarrollador.

### 2. Backend: Servicio de soporte técnico

- **Tecnologías:** Python y Gemini.
- **API key segura:** la clave debe leerse obligatoriamente desde un archivo `.env` local gestionado con `python-dotenv`. Queda prohibida la exposición de la clave en el cliente.
- **Consumo de API:** uso de la librería oficial `google-genai` configurando un modelo ligero (como `gemini-3.1-flash-lite`).
- **Salida estructurada (JSON Schema):** la API debe devolver la respuesta obligatoriamente en JSON estricto, conteniendo:
  - `categoria`: (`incidencia_envio`, `devolucion`, `consulta_producto`, `otro`).
  - `prioridad`: (`alta`, `media`, `baja`).
  - `respuesta_sugerida`: borrador de respuesta cordial en español para el cliente.
- **Control de errores:** implementar gestión de errores temporales (como 429 ó 500) usando un mecanismo básico de retroceso exponencial con jitter.