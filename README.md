
# IA para Comercio Internacional

Proyecto de integración de inteligencia artificial para una empresa de comercio internacional. Incluye un traductor bidireccional offline y un sistema de clasificación automática de consultas de clientes.

## Funcionalidades

### 1. Traductor offline

Aplicación web que permite traducir textos entre inglés y español directamente desde el navegador.

Características:
- Traducción inglés → español y español → inglés.
- Modelos de traducción de Hugging Face mediante Transformers.js.
- Ejecución mediante WebGPU, con alternativa WASM.
- Descarga y almacenamiento en caché de los modelos en el navegador.
- Indicador de estado y progreso de descarga.

Modelos utilizados:
- `Xenova/opus-mt-en-es`
- `Xenova/opus-mt-es-en`

### 2. Clasificación de consultas de clientes

Backend desarrollado en Python que utiliza la API de Gemini para analizar mensajes de clientes y generar una respuesta sugerida.

El sistema devuelve un resultado estructurado en JSON con:
- `categoria`: tipo de consulta (`incidencia_envio`, `devolucion`, `consulta_producto` u `otro`).
- `prioridad`: nivel de prioridad (`alta`, `media` o `baja`).
- `respuesta_sugerida`: propuesta de respuesta cordial y profesional en español.

También incorpora reintentos automáticos ante determinados errores temporales de la API, con backoff exponencial y jitter.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Transformers.js
- Hugging Face
- Python
- Google Gemini API
- Google GenAI SDK
- python-dotenv
- Git y GitHub

## Estructura del proyecto

```text
ia-comercio-internacional/
├── backend/
│   └── soporte.py
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
```

## Requisitos previos

- Python 3.
- Un navegador web moderno.
- Conexión a Internet para descargar los modelos de traducción y utilizar la API de Gemini.
- Una API Key de Google Gemini.

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Daaniel-Sans/ia-comercio-internacional.git
cd ia-comercio-internacional
```

### 2. Crear y activar un entorno virtual

```bash
python -m venv .venv
source .venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar la API Key

Crear un archivo `.env` en la raíz del proyecto a partir de `.env.example`:

```bash
cp .env.example .env
```

Editar `.env` e introducir la API Key:

```dotenv
GEMINI_API_KEY=tu_clave_api_aqui
```

No compartir ni subir el archivo `.env` a GitHub.

## Ejecución

### Traductor offline

Desde la raíz del proyecto, iniciar un servidor local:

```bash
python -m http.server 8000
```

Abrir en el navegador:

```text
http://localhost:8000/frontend/
```

La primera vez que se utilice cada dirección de traducción, el navegador descargará el modelo correspondiente. Las traducciones posteriores podrán reutilizar los archivos almacenados en caché.


### Backend de clasificación

Desde la raíz del proyecto y con el entorno virtual activado, ejecutar:

```bash
python -m backend.soporte
```

El programa solicitará una consulta de un cliente y mostrará su categoría, prioridad y respuesta sugerida generada por Gemini.

También se puede importar la función `clasificar_consulta` desde el módulo `backend.soporte` para utilizarla en otros programas.


## Seguridad

- La API Key se almacena en un archivo `.env`.
- El archivo `.env` está excluido del control de versiones mediante `.gitignore`.
- Se proporciona `.env.example` como plantilla de configuración.
- El entorno virtual y los archivos generados por Python también están excluidos de Git.
