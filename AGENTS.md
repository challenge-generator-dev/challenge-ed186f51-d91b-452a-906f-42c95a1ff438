# AGENTS.md

Instrucciones para el agente de IA que abra este repositorio (Claude Code, Cursor, Codex, Copilot, Gemini). Se cargan solas: no hay que pegar nada en ningun chat.

## Que es este repositorio

Es el codigo base de un reto de aprendizaje de Pragma: **Implementación de visualización de eventos en tiempo real**.

| | |
|---|---|
| Tema | Consumo de eventos en tiempo real con Kafka |
| Nivel | advanced-l2 |
| Chapter | Frontend |
| Especialidad | Angular |
| Stack | TypeScript / Angular 20 |
| Patron arquitectonico | Componentes standalone con Signals y servicios reactivos |
| Tiempo estimado | 8 horas |

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

## Receta del stack

Esqueleto obligatorio:

- `package.json, angular.json y tsconfig.json en la raiz`
- `src/main.ts con bootstrapApplication`
- `src/app/app.config.ts con los providers`
- `src/app/core con servicios y modelos`
- `src/app/features con componentes contenedores`
- `src/app/shared con componentes presentacionales`

Trampas conocidas:

- No inventes versiones de npm: una version inexistente hace fallar `npm install` con ETARGET y el proyecto no instala. Usa rango con caret sobre una version que exista.
- El `package.json` tiene que ser JSON valido y UNICO: nada despues de la llave de cierre.
- Angular necesita `angular.json` y `tsconfig.json` ademas del `package.json`, o `ng build` no corre.

Dependencias:

- @angular/core 20.0.0
- @angular/common 20.0.0
- @angular/platform-browser 20.0.0
- @angular/platform-browser-dynamic 20.0.0
- @angular/router 20.0.0
- @angular/forms 20.0.0
- @angular/material 17.0.0
- rxjs 7.8.1
- typescript 5.8.0
- zone.js 0.14.0

## Tu tarea

Dejar este proyecto en estado **verificable**: que el comando de verificacion corra sin errores. Escribi los archivos en disco, en este repositorio. No generes ZIPs ni archivos adjuntos.

En orden:

1. Segui el orden de arranque del mapa de componentes (infraestructura local primero) y corre `(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q` desde la raiz: mira que falla.
2. Completa lo que falte de la lista de abajo: manifiesto de dependencias, punto de entrada, capa de interfaz y las capas del patron declarado.
3. Arregla SOLO los errores que impiden compilar o arrancar.
4. Volve a correr `(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q` hasta que pase.
5. Pará ahí.

## Regla dura: las fases son trabajo del humano

**PROHIBIDO implementar los entregables de las fases.** El valor del reto esta en que la persona los resuelva. Tu trabajo es que tenga un proyecto que arranca; el hueco pedagogico se queda como esta.

No resuelvas nada de esto:

- **Fase 1 — Configuración del entorno**: Entorno de desarrollo configurado y conectado al broker de Kafka.
- **Fase 2 — Consumo de eventos**: Lógica implementada para consumir eventos de Kafka y mostrarlos en la interfaz.
- **Fase 3 — Visualización en tiempo real**: Interfaz de usuario que muestra los eventos en tiempo real y maneja posibles errores.

Distincion operativa:

- **Arreglar** (si): import faltante, tipo que no existe, dependencia sin declarar, error de sintaxis, archivo referenciado que no existe.
- **No tocar** (no): logica de negocio incompleta, validaciones ausentes, secretos hardcodeados, APIs deprecadas que funcionan, concurrencia insegura, patrones mejorables. Eso es lo que la persona tiene que encontrar.

## Lo que falta y tenes que completar

### 1. Referencias colgando (13)

Salieron de un analisis estatico del codigo que SI esta en el repo. Cada una rompe la compilacion:

- [ ] `api/src/infrastructure/http/order-events.controller.ts` — `SseEvent.toJSON`
      Se invoca `toJSON` sobre `SseEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/infrastructure/http/order-events.controller.ts` — `OrderEventsService.subscribeToOrderEvents`
      Se invoca `subscribeToOrderEvents` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/infrastructure/http/order-events.controller.ts` — `OrderEventsService.getLatestEventForOrder`
      Se invoca `getLatestEventForOrder` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/test/order-events.service.spec.ts` — `OrderEventsService.getOrderEvents`
      Se invoca `getOrderEvents` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/test/order-events.service.spec.ts` — `OrderEvent.push`
      Se invoca `push` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/test/order-events.service.spec.ts` — `OrderEventsService.getOrderEventsByType`
      Se invoca `getOrderEventsByType` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/test/order-events.service.spec.ts` — `OrderEventsService.getOrderEventsByOrderId`
      Se invoca `getOrderEventsByOrderId` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/test/order-events.service.spec.ts` — `OrderEvent.every`
      Se invoca `every` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/test/order-events.service.spec.ts` — `OrderEventsService.pauseEventConsumption`
      Se invoca `pauseEventConsumption` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/test/order-events.service.spec.ts` — `OrderEventsService.resumeEventConsumption`
      Se invoca `resumeEventConsumption` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/application/order-events.service.ts` — `OrderEvent.shift`
      Se invoca `shift` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/application/order-events.service.ts` — `OrderEvent.push`
      Se invoca `push` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/application/order-events.service.ts` — `OrderEvent.slice`
      Se invoca `slice` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

### Presentes (43)

- `api/package.json`
- `api/tsconfig.json`
- `api/src/main.ts`
- `api/src/domain/order.model.ts`
- `api/src/domain/order-events.port.ts`
- `api/src/app.module.ts`
- `api/src/infrastructure/kafka/kafka.module.ts`
- `api/src/infrastructure/kafka/kafka-order-events.adapter.ts`
- `api/src/infrastructure/http/order-events.controller.ts`
- `api/src/infrastructure/http/sse.service.ts`
- `api/src/config/kafka.config.ts`
- `api/test/order-events.service.spec.ts`
- `api/src/application/order-events.service.ts`
- `client/package.json`
- `client/angular.json`
- `client/tsconfig.json`
- `client/src/app/core/services/order-events.service.ts`
- `client/src/main.ts`
- `client/src/index.html`
- `client/src/app/app.component.ts`
- `client/src/app/app.config.ts`
- `client/src/app/app.routes.ts`
- `client/src/app/features/orders/orders.component.ts`
- `client/src/app/features/orders/orders.component.html`
- `client/src/app/features/orders/orders.component.scss`
- `client/src/app/shared/components/order-card/order-card.component.ts`
- `client/src/app/shared/components/order-card/order-card.component.html`
- `client/src/app/shared/components/order-card/order-card.component.scss`
- `client/src/app/shared/services/api-client.service.ts`
- `client/src/environments/environment.ts`
- `client/src/app/core/animations/router-transition.provider.ts`
- `client/src/app/core/state/store.provider.ts`
- `client/src/app/core/guards/auth.guard.ts`
- `client/src/app/core/guards/loading.guard.ts`
- `client/src/app/features/analytics/analytics.component.ts`
- `client/src/app/features/settings/settings.component.ts`
- `client/src/app/shared/components/not-found/not-found.component.ts`
- `client/src/app/core/services/auth.service.ts`
- `client/src/app/core/services/loading.service.ts`
- `client/tsconfig.app.json`
- `docker-compose.yml`
- `infra-local/README.md`
- `infra-local/kafka/create-topics.sh`

### Capas del patron declarado

Cada una tiene que existir como directorio real con al menos un archivo. Codigo plano en la raiz no satisface el patron.

- `api`
- `api/src/domain`
- `api/src/application`
- `api/src/infrastructure`
- `api/src/infrastructure/kafka`
- `api/src/infrastructure/http`
- `api/src/config`
- `client`
- `client/src/app/core`
- `client/src/app/features/orders`
- `client/src/app/shared/components`
- `client/src/app/shared/services`

## Verificacion

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando pasando es la definicion de "terminado" para vos.

## Convenciones que tenes que respetar

- Un solo ecosistema: no declares librerias de otro lenguaje ni mezcles gestores de paquetes.
- Toda libreria que uses tiene que estar declarada en el manifiesto de dependencias.
- Todo import declarado tiene que usarse; todo tipo usado tiene que existir o venir de una dependencia declarada.
- Cada componente vive en su carpeta: instala y compila dentro de ella, y no muevas archivos entre componentes.
- Respeta los contratos entre componentes (endpoints, topics) tal como estan declarados en el mapa de componentes.
- El patron es **Componentes standalone con Signals y servicios reactivos**: los contratos (interfaces, puertos) los define la capa interna y los implementa la externa, nunca al revés.
- Los archivos que crees llevan implementacion real, no stubs: sin `TODO`, sin cuerpos vacios, sin `// getters y setters`.

## Contexto del candidato

Sirve para calibrar el nivel del codigo, no para resolver las fases.

- Perfil: Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2
- Brecha que el reto ataca: Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261106172943501), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz
- Mision: Mostrar en vivo el estado de las ordenes

---

*Generado por Challenge Generator — Pragma. `README.md` tiene el enunciado completo del reto para la persona. `PROMPT_MEJORA.md` es la variante para pegar en un chat, si se prefiere ese flujo.*
