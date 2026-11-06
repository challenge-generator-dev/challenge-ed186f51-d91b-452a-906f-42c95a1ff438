# Implementación de visualización de eventos en tiempo real

El sistema debe permitir a los usuarios visualizar en tiempo real el estado de las órdenes a través de eventos publicados en un topic de Kafka. Los eventos deben ser consumidos y mostrados en la interfaz de usuario.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Consumo de eventos en tiempo real con Kafka |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración del entorno

**Objetivo:** Configurar el entorno de desarrollo para consumir eventos de Kafka.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configura el entorno de desarrollo para consumir eventos de Kafka.
- Verifica que el sistema puede conectarse al broker de Kafka y suscribirse a un topic.

**Entregable:** Entorno de desarrollo configurado y conectado al broker de Kafka.

<details>
<summary>Pistas de conocimiento</summary>

- Configuración de Kafka en entorno de desarrollo
- Suscripción a un topic de Kafka

</details>

### Fase 2: Consumo de eventos

**Objetivo:** Implementar la lógica para consumir eventos de Kafka y mostrarlos en la interfaz.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Implementa la lógica para consumir eventos de Kafka.
- Muestra los eventos consumidos en la interfaz de usuario.

**Entregable:** Lógica implementada para consumir eventos de Kafka y mostrarlos en la interfaz.

<details>
<summary>Pistas de conocimiento</summary>

- Consumo de eventos de Kafka
- Actualización de la interfaz de usuario con los eventos consumidos

</details>

### Fase 3: Visualización en tiempo real

**Objetivo:** Asegurar que los eventos se muestren en tiempo real en la interfaz.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Verifica que los eventos se muestren en tiempo real en la interfaz.
- Implementa mecanismos para manejar posibles errores en la conexión a Kafka o en el consumo de eventos.

**Entregable:** Interfaz de usuario que muestra los eventos en tiempo real y maneja posibles errores.

<details>
<summary>Pistas de conocimiento</summary>

- Manejo de errores en la conexión a Kafka
- Actualización en tiempo real de la interfaz de usuario

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es Kafka y cómo se utiliza para el consumo de eventos en tiempo real?
- **paraQueSirve**: ¿Para qué sirve consumir eventos de Kafka en una aplicación?
- **comoSeUsa**: ¿Cómo se consumen eventos de Kafka y se muestran en una interfaz de usuario?
- **erroresComunes**: ¿Cuáles son los errores comunes al consumir eventos de Kafka y cómo se manejan?

## Criterios de Evaluacion

- Configuración correcta del entorno de desarrollo para conectarse a Kafka.
- Implementación de la lógica para consumir eventos de Kafka.
- Visualización de los eventos en tiempo real en la interfaz de usuario.
- Manejo adecuado de posibles errores en la conexión a Kafka o en el consumo de eventos.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `GET /orders/events`
- `client` expone http:
  - `GET /orders/events`

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
