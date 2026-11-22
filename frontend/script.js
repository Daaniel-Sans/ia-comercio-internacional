
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2';

const direction = document.getElementById('direction');
const inputText = document.getElementById('input-text');
const translateButton = document.getElementById('translate-button');
const status = document.getElementById('status');
const result = document.getElementById('result');

let translator = null;
let currentModel = null;

const models = {
    'en-es': 'Xenova/opus-mt-en-es',
    'es-en': 'Xenova/opus-mt-es-en'
};

const placeholders = {
    'en-es': 'Escribe aquí tu texto en inglés...',
    'es-en': 'Escribe aquí tu texto en español...'
};

const supportsWebGPU = !!navigator.gpu;
const device = supportsWebGPU ? 'webgpu' : 'wasm';

async function loadTranslator() {
    const selectedDirection = direction.value;
    const model = models[selectedDirection];

    if (translator && currentModel === model) {
        return translator;
    }

    translator = null;
    currentModel = null;

    status.textContent = `Cargando modelo de traducción (${device})...`;
    translateButton.disabled = true;

    try {
        translator = await pipeline('translation', model, {
            device,
            progress_callback: (progress) => {
                if (progress.status === 'progress') {
                    status.textContent = `Descargando modelo: ${Math.round(progress.progress)}%`;
                }
            }
        });

        currentModel = model;
        status.textContent = 'Modelo cargado. Preparado para traducir.';

        return translator;
    } catch (error) {
        status.textContent = 'Error al cargar el modelo de traducción.';
        console.error(error);
        throw error;
    } finally {
        translateButton.disabled = false;
    }
}

async function translateText() {
    const text = inputText.value.trim();

    if (!text) {
        status.textContent = 'Escribe un texto antes de traducir.';
        return;
    }

    translateButton.disabled = true;
    result.textContent = '';

    try {
        const translator = await loadTranslator();

        status.textContent = 'Traduciendo...';

        const output = await translator(text);

        result.textContent = output[0].translation_text;
        status.textContent = 'Traducción completada.';
    } catch (error) {
        status.textContent = 'No se ha podido realizar la traducción.';
        console.error(error);
    } finally {
        translateButton.disabled = false;
    }
}

function updatePlaceholder() {
    inputText.placeholder = placeholders[direction.value];
}

direction.addEventListener('change', updatePlaceholder);

translateButton.addEventListener('click', translateText);

updatePlaceholder();
