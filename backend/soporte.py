
import json
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("No se ha encontrado la API Key de Gemini.")

client = genai.Client(
    api_key=API_KEY,
    http_options=types.HttpOptions(
        retry_options=types.HttpRetryOptions(
            attempts=4,
            initial_delay=1,
            exp_base=2,
            max_delay=10,
            jitter=1,
            http_status_codes=[408, 429, 500, 502, 503, 504]
        )
    )
)


TICKET_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "categoria": {
            "type": "STRING",
            "enum": [
                "incidencia_envio",
                "devolucion",
                "consulta_producto",
                "otro"
            ]
        },
        "prioridad": {
            "type": "STRING",
            "enum": [
                "alta",
                "media",
                "baja"
            ]
        },
        "respuesta_sugerida": {
            "type": "STRING"
        }
    },
    "required": [
        "categoria",
        "prioridad",
        "respuesta_sugerida"
    ]
}


def clasificar_consulta(mensaje):
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=f"""
        Analiza la siguiente consulta de un cliente de una empresa de comercio internacional.

        Clasifica el mensaje según su categoría y prioridad.
        Genera una respuesta sugerida cordial y profesional en español.

        Consulta del cliente:
        {mensaje}
        """,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=TICKET_SCHEMA
        )
    )

    return json.loads(response.text)
