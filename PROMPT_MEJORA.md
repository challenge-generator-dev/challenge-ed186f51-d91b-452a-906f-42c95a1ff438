# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

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

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/infrastructure/http/order-events.controller.ts` — `SseEvent.toJSON`: Se invoca `toJSON` sobre `SseEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/http/order-events.controller.ts` — `OrderEventsService.subscribeToOrderEvents`: Se invoca `subscribeToOrderEvents` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/http/order-events.controller.ts` — `OrderEventsService.getLatestEventForOrder`: Se invoca `getLatestEventForOrder` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/test/order-events.service.spec.ts` — `OrderEventsService.getOrderEvents`: Se invoca `getOrderEvents` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/test/order-events.service.spec.ts` — `OrderEvent.push`: Se invoca `push` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/test/order-events.service.spec.ts` — `OrderEventsService.getOrderEventsByType`: Se invoca `getOrderEventsByType` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/test/order-events.service.spec.ts` — `OrderEventsService.getOrderEventsByOrderId`: Se invoca `getOrderEventsByOrderId` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/test/order-events.service.spec.ts` — `OrderEvent.every`: Se invoca `every` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/test/order-events.service.spec.ts` — `OrderEventsService.pauseEventConsumption`: Se invoca `pauseEventConsumption` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/test/order-events.service.spec.ts` — `OrderEventsService.resumeEventConsumption`: Se invoca `resumeEventConsumption` sobre `OrderEventsService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/application/order-events.service.ts` — `OrderEvent.shift`: Se invoca `shift` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/application/order-events.service.ts` — `OrderEvent.push`: Se invoca `push` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/application/order-events.service.ts` — `OrderEvent.slice`: Se invoca `slice` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2

### Brecha de conocimiento
Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261106172943501), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz

### Misión / candidato
Mostrar en vivo el estado de las ordenes

### Reto
- Tema: Consumo de eventos en tiempo real con Kafka
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de visualización de eventos en tiempo real
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración del entorno — objetivo: Configurar el entorno de desarrollo para consumir eventos de Kafka. — entregable (NO resolver): Entorno de desarrollo configurado y conectado al broker de Kafka.
- Fase 2: Consumo de eventos — objetivo: Implementar la lógica para consumir eventos de Kafka y mostrarlos en la interfaz. — entregable (NO resolver): Lógica implementada para consumir eventos de Kafka y mostrarlos en la interfaz.
- Fase 3: Visualización en tiempo real — objetivo: Asegurar que los eventos se muestren en tiempo real en la interfaz. — entregable (NO resolver): Interfaz de usuario que muestra los eventos en tiempo real y maneja posibles errores.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-events-service",
  "version": "1.0.0",
  "description": "Servicio backend para consumir y emitir eventos de órdenes en tiempo real",
  "main": "dist/main.js",
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "kafkajs": "^2.2.4",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/node": "^20.11.0",
    "jest": "^29.7.0",
    "prettier": "^3.0.0",
    "rimraf": "^5.0.0",
    "ts-jest": "^29.1.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.7.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}


// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2019",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  },
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';
  
  await app.listen(port, host);
  
  logger.log(`Aplicación escuchando en http://${host}:${port}`);
  logger.log(`Endpoint de eventos SSE: GET /orders/events`);
  logger.log(`Estado de conexiones SSE disponible en: GET /orders/events/count`);
}

bootstrap();

// === ARCHIVO: api/src/domain/order.model.ts ===
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export enum OrderEventType {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_FAILED = 'ORDER_FAILED',
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderEvent {
  orderId: string;
  eventType: OrderEventType;
  timestamp: Date;
  order?: Order;
  previousStatus?: OrderStatus;
  newStatus?: OrderStatus;
  metadata?: Record<string, unknown>;
}

export function createOrderEvent(
  orderId: string,
  eventType: OrderEventType,
  order?: Order,
  previousStatus?: OrderStatus,
  newStatus?: OrderStatus,
  metadata?: Record<string, unknown>,
): OrderEvent {
  return {
    orderId,
    eventType,
    timestamp: new Date(),
    order,
    previousStatus,
    newStatus,
    metadata,
  };
}

export function isValidOrderStatus(status: string): status is OrderStatus {
  return Object.values(OrderStatus).includes(status as OrderStatus);
}

export function isValidOrderEventType(type: string): type is OrderEventType {
  return Object.values(OrderEventType).includes(type as OrderEventType);
}

// === ARCHIVO: api/src/domain/order-events.port.ts ===
import { Observable } from 'rxjs';
import { Order } from './order.model';

/**
 * Puerto de salida que define cómo el dominio interactúa con eventos de órdenes.
 * La implementación concreta será proporcionada por la infraestructura.
 */
export interface OrderEventsPort {
    /**
     * Suscribe al flujo de eventos de órdenes desde Kafka.
     * @returns Observable que emite eventos de órdenes según se reciben.
     */
    subscribeToOrderEvents(): Observable<OrderEvent>;
}

/**
 * Representa un evento de cambio de estado en una orden.
 */
export class OrderEvent {
    constructor(
        public readonly orderId: string,
        public readonly status: string,
        public readonly timestamp: Date,
        public readonly metadata?: Record<string, unknown>
    ) {}

    /**
     * Convierte el evento a un formato seguro para serialización.
     */
    public toJSON(): Record<string, unknown> {
        return {
            orderId: this.orderId,
            status: this.status,
            timestamp: this.timestamp.toISOString(),
            metadata: this.metadata
        };
    }
}

// === ARCHIVO: api/src/app.module.ts ===
import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { OrderEventsController } from './infrastructure/http/order-events.controller';
import { SseService } from './infrastructure/http/sse.service';
import { KafkaConfigService } from './config/kafka.config';
import { KafkaOrderEventsAdapter } from './infrastructure/kafka/kafka-order-events.adapter';
import { OrderEventsPort } from './domain/order-events.port';
import { OrderStatus, OrderEventType } from './domain/order.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    KafkaModule,
  ],
  controllers: [OrderEventsController],
  providers: [
    SseService,
    KafkaConfigService,
    {
      provide: OrderEventsPort,
      useClass: KafkaOrderEventsAdapter,
    },
  ],
  exports: [OrderEventsPort, SseService],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    this.logger.log('AppModule inicializado');
    this.logger.debug(`OrderStatus disponible: ${Object.values(OrderStatus).join(', ')}`);
    this.logger.debug(`OrderEventType disponible: ${Object.values(OrderEventType).join(', ')}`);
  }
}

// === ARCHIVO: api/src/infrastructure/kafka/kafka.module.ts ===
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Kafka, KafkaConfig, Producer, Consumer, logLevel } from 'kafkajs';
import { KafkaOrderEventsAdapter } from './kafka-order-events.adapter';

const KAFKA_CLIENT_ID = 'order-events-service';
const KAFKA_GROUP_ID = 'order-events-consumer-group';
const KAFKA_TOPIC = 'orders-events';

function createKafkaConfig(configService: ConfigService): KafkaConfig {
  const brokers = configService.get<string[]>('KAFKA_BROKERS', ['localhost:9092']);
  const clientId = configService.get<string>('KAFKA_CLIENT_ID', KAFKA_CLIENT_ID);
  const ssl = configService.get<boolean>('KAFKA_SSL', false);
  const sasl = configService.get<boolean>('KAFKA_SASL_ENABLED', false) ? {
    mechanism: configService.get<string>('KAFKA_SASL_MECHANISM', 'plain'),
    username: configService.get<string>('KAFKA_SASL_USERNAME', ''),
    password: configService.get<string>('KAFKA_SASL_PASSWORD', ''),
  } : undefined;

  return {
    clientId,
    brokers,
    ssl,
    sasl,
    logLevel: logLevel.WARN,
    retry: {
      initialRetryTime: 100,
      retries: 8,
    },
  };
}

function createKafkaClient(configService: ConfigService): Kafka {
  const config = createKafkaConfig(configService);
  return new Kafka(config);
}

function createKafkaProducer(kafka: Kafka): Promise<Producer> {
  return kafka.producer();
}

async function createKafkaConsumer(kafka: Kafka): Promise<Consumer> {
  const groupId = process.env.KAFKA_GROUP_ID || KAFKA_GROUP_ID;
  return kafka.consumer({ groupId });
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KAFKA_CONFIG',
      useFactory: (configService: ConfigService) => createKafkaConfig(configService),
      inject: [ConfigService],
    },
    {
      provide: Kafka,
      useFactory: (configService: ConfigService) => createKafkaClient(configService),
      inject: [ConfigService],
    },
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async (kafka: Kafka) => {
        const producer = await createKafkaProducer(kafka);
        await producer.connect();
        return producer;
      },
      inject: [Kafka],
    },
    {
      provide: 'KAFKA_CONSUMER',
      useFactory: async (kafka: Kafka) => {
        const consumer = await createKafkaConsumer(kafka);
        await consumer.connect();
        await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: false });
        return consumer;
      },
      inject: [Kafka],
    },
    {
      provide: 'KAFKA_TOPIC_NAME',
      useValue: KAFKA_TOPIC,
    },
    KafkaOrderEventsAdapter,
  ],
  exports: [Kafka, 'KAFKA_PRODUCER', 'KAFKA_CONSUMER', 'KAFKA_TOPIC_NAME', KafkaOrderEventsAdapter],
})
export class KafkaModule {}

// === ARCHIVO: api/src/infrastructure/kafka/kafka-order-events.adapter.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { Observable, Subject, catchError, finalize, takeUntil } from 'rxjs';
import { OrderEventsPort } from '../../domain/order-events.port';
import { OrderEvent } from '../../domain/order-events.port';

@Injectable()
export class KafkaOrderEventsAdapter implements OrderEventsPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaOrderEventsAdapter.name);
  private readonly eventsSubject = new Subject<OrderEvent>();
  private readonly destroy$ = new Subject<void>();
  private consumer: Consumer;
  private isConsuming = false;

  constructor(
    @Inject('KAFKA_CONSUMER') private readonly kafkaConsumer: Consumer,
    @Inject('KAFKA_TOPIC_NAME') private readonly topicName: string,
    private readonly configService: ConfigService,
  ) {
    this.consumer = this.kafkaConsumer;
  }

  async onModuleInit(): Promise<void> {
    this.logger.log(`Inicializando adaptador de eventos de órdenes para topic: ${this.topicName}`);
    await this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Deteniendo adaptador de eventos de órdenes');
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.isConsuming) {
      await this.consumer.disconnect();
      this.logger.log('Consumer de Kafka desconectado');
    }
  }

  async startConsuming(): Promise<void> {
    if (this.isConsuming) {
      this.logger.warn('El consumidor ya está activo');
      return;
    }

    try {
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });
      this.isConsuming = true;
      this.logger.log('Consumo de eventos de Kafka iniciado');
    } catch (error) {
      this.logger.error('Error al iniciar el consumo de Kafka', error);
      throw error;
    }
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    
    if (!message.value) {
      this.logger.warn(`Mensaje sin valor recibido en ${topic}[${partition}]`);
      return;
    }

    try {
      const eventData = JSON.parse(message.value.toString());
      const orderEvent = this.mapToOrderEvent(eventData, message.offset);
      
      this.logger.debug(`Evento procesado: ${orderEvent.eventType} para orden ${orderEvent.orderId}`);
      this.eventsSubject.next(orderEvent);
    } catch (error) {
      this.logger.error(`Error al procesar mensaje: ${error.message}`, error.stack);
    }
  }

  private mapToOrderEvent(data: Record<string, unknown>, offset: string): OrderEvent {
    return new OrderEvent(
      data.orderId as string,
      data.eventType as string,
      data.status as string,
      data.timestamp as string,
      data.customerId as string,
      data.items as Array<{ productId: string; quantity: number; price: number }>,
      data.totalAmount as number,
      offset,
    );
  }

  subscribeToOrderEvents(): Observable<OrderEvent> {
    this.logger.debug('Nueva suscripción a eventos de órdenes');
    return this.eventsSubject.asObservable().pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        this.logger.error('Error en el stream de eventos', error);
        throw error;
      }),
      finalize(() => {
        this.logger.debug('Stream de eventos cerrado');
      }),
    );
  }

  async pauseConsuming(): Promise<void> {
    if (this.isConsuming) {
      await this.consumer.pause([{ topic: this.topicName }]);
      this.logger.log('Consumo de eventos pausado');
    }
  }

  async resumeConsuming(): Promise<void> {
    if (this.isConsuming) {
      await this.consumer.resume([{ topic: this.topicName }]);
      this.logger.log('Consumo de eventos reanudado');
    }
  }

  isConsumerRunning(): boolean {
    return this.isConsuming;
  }
}

// === ARCHIVO: api/src/infrastructure/http/order-events.controller.ts ===
import { Controller, Get, Res, Sse, HttpCode, HttpStatus, Logger, Param, Query, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { Observable, interval, map, takeUntil, Subject } from 'rxjs';
import { OrderEventsService } from '../../application/order-events.service';
import { OrderEvent } from '../../domain/order-events.port';

interface SseEvent {
  event: string;
  data: string;
  id?: string;
}

@Controller('orders')
export class OrderEventsController {
  private readonly logger = new Logger(OrderEventsController.name);
  private readonly activeConnections = new Map<string, Subject<void>>();

  constructor(private readonly orderEventsService: OrderEventsService) {}

  @Get('events')
  @HttpCode(HttpStatus.OK)
  async streamOrderEvents(
    @Res() res: Response,
    @Query('customerId') customerId?: string,
  ): Promise<void> {
    const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.logger.log(`Nueva conexión SSE para eventos de órdenes: ${connectionId}, customerId: ${customerId || 'todos'}`);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const disconnect$ = new Subject<void>();
    this.activeConnections.set(connectionId, disconnect$);

    let eventCount = 0;
    const sendEvent = (event: OrderEvent): void => {
      const sseEvent: SseEvent = {
        event: 'order-update',
        data: JSON.stringify(event.toJSON()),
        id: String(++eventCount),
      };
      
      const message = this.formatSseMessage(sseEvent);
      res.write(message);
      this.logger.debug(`Evento enviado a ${connectionId}: ${event.eventType} para orden ${event.orderId}`);
    };

    const sendError = (error: string): void => {
      const sseEvent: SseEvent = {
        event: 'error',
        data: JSON.stringify({ message: error }),
      };
      res.write(this.formatSseMessage(sseEvent));
    };

    const sendHeartbeat = (): void => {
      const sseEvent: SseEvent = {
        event: 'heartbeat',
        data: JSON.stringify({ timestamp: new Date().toISOString() }),
      };
      res.write(this.formatSseMessage(sseEvent));
    };

    try {
      const subscription = this.orderEventsService.subscribeToOrderEvents().pipe(
        takeUntil(disconnect$),
      ).subscribe({
        next: (event: OrderEvent) => {
          if (customerId && event.customerId !== customerId) {
            return;
          }
          sendEvent(event);
        },
        error: (error: Error) => {
          this.logger.error(`Error en stream de eventos: ${error.message}`, error.stack);
          sendError(error.message);
          disconnect$.next();
        },
        complete: () => {
          this.logger.log(`Stream completado para ${connectionId}`);
          sendError('Stream de eventos cerrado por el servidor');
        },
      });

      const heartbeatInterval = interval(15000).pipe(
        takeUntil(disconnect$),
      ).subscribe(() => {
        sendHeartbeat();
      });

      res.on('close', () => {
        this.logger.log(`Conexión cerrada: ${connectionId}`);
        disconnect$.next();
        disconnect$.complete();
        subscription.unsubscribe();
        heartbeatInterval.unsubscribe();
        this.activeConnections.delete(connectionId);
        this.logger.debug(`Conexiones activas: ${this.activeConnections.size}`);
      });

    } catch (error) {
      this.logger.error(`Error al iniciar stream: ${error.message}`, error.stack);
      sendError('Error al conectar con el servicio de eventos');
      res.end();
    }
  }

  @Get('events/:orderId')
  @HttpCode(HttpStatus.OK)
  async getOrderEventById(
    @Param('orderId') orderId: string,
  ): Promise<OrderEvent> {
    this.logger.debug(`Buscando evento para orden: ${orderId}`);
    const event = await this.orderEventsService.getLatestEventForOrder(orderId);
    
    if (!event) {
      throw new NotFoundException(`No se encontró evento para la orden: ${orderId}`);
    }
    
    return event;
  }

  private formatSseMessage(event: SseEvent): string {
    let message = '';
    if (event.id) {
      message += `id: ${event.id}\n`;
    }
    message += `event: ${event.event}\n`;
    message += `data: ${event.data}\n`;
    message += '\n';
    return message;
  }

  getActiveConnectionsCount(): number {
    return this.activeConnections.size;
  }
}

// === ARCHIVO: api/src/infrastructure/http/sse.service.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Observable, Subject, filter, map, takeUntil } from 'rxjs';
import { OrderEventsPort } from '../../domain/order-events.port';
import { OrderEvent } from '../../domain/order-events.port';

@Injectable()
export class SseService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(SseService.name);
    private readonly clients: Map<string, Response> = new Map();
    private readonly destroy$ = new Subject<void>();
    private orderEvents$: Observable<OrderEvent> | null = null;

    constructor(private readonly orderEventsPort: OrderEventsPort) {}

    onModuleInit(): void {
        this.logger.log('Inicializando SseService');
        this.initializeEventStream();
    }

    onModuleDestroy(): void {
        this.logger.log('Destruyendo SseService, cerrando todas las conexiones SSE');
        this.destroy$.next();
        this.destroy$.complete();
        this.clients.forEach((response, clientId) => {
            this.closeConnection(clientId);
        });
        this.clients.clear();
    }

    private initializeEventStream(): void {
        try {
            this.orderEvents$ = this.orderEventsPort.subscribeToOrderEvents().pipe(
                takeUntil(this.destroy$),
                filter((event): event is OrderEvent => event !== null && event !== undefined),
                map(event => {
                    this.logger.debug(`Evento recibido: ${event.eventType} - ID: ${event.orderId}`);
                    return event;
                })
            );
            this.logger.log('Stream de eventos de órdenes inicializado correctamente');
        } catch (error) {
            this.logger.error('Error al inicializar el stream de eventos', error);
        }
    }

    subscribeToOrderEvents(response: Response): string {
        const clientId = this.generateClientId();
        this.clients.set(clientId, response);
        this.logger.log(`Nuevo cliente SSE conectado: ${clientId}`);

        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        });

        this.sendEvent(response, {
            event: 'connected',
            data: JSON.stringify({
                clientId,
                message: 'Conectado al stream de eventos de órdenes',
                timestamp: new Date().toISOString()
            })
        });

        if (this.orderEvents$) {
            const subscription = this.orderEvents$.subscribe({
                next: (event) => {
                    this.sendEvent(response, {
                        event: event.eventType,
                        data: event.toJSON()
                    });
                },
                error: (error) => {
                    this.logger.error(`Error en stream para cliente ${clientId}`, error);
                    this.sendEvent(response, {
                        event: 'error',
                        data: JSON.stringify({
                            message: 'Error en la conexión del stream',
                            error: error.message
                        })
                    });
                },
                complete: () => {
                    this.logger.warn(`Stream completado para cliente ${clientId}`);
                    this.closeConnection(clientId);
                }
            });

            response.on('close', () => {
                this.logger.log(`Cliente SSE desconectado: ${clientId}`);
                subscription.unsubscribe();
                this.clients.delete(clientId);
            });
        } else {
            this.logger.warn(`Stream de eventos no disponible para cliente ${clientId}`);
            this.sendEvent(response, {
                event: 'error',
                data: JSON.stringify({
                    message: 'Stream de eventos no disponible'
                })
            });
        }

        return clientId;
    }

    private sendEvent(response: Response, event: { event: string; data: string }): void {
        if (!response.writableEnded) {
            try {
                response.write(`event: ${event.event}\n`);
                response.write(`data: ${event.data}\n\n`);
            } catch (error) {
                this.logger.error('Error al enviar evento SSE', error);
            }
        }
    }

    private closeConnection(clientId: string): void {
        const response = this.clients.get(clientId);
        if (response && !response.writableEnded) {
            try {
                response.end();
            } catch (error) {
                this.logger.error(`Error al cerrar conexión para cliente ${clientId}`, error);
            }
        }
        this.clients.delete(clientId);
    }

    private generateClientId(): string {
        return `sse_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    getConnectedClientsCount(): number {
        return this.clients.size;
    }

    broadcastToAll(eventType: string, data: unknown): void {
        this.clients.forEach((response, clientId) => {
            this.sendEvent(response, {
                event: eventType,
                data: JSON.stringify(data)
            });
            this.logger.debug(`Evento broadcast enviado a cliente ${clientId}`);
        });
    }
}

// === ARCHIVO: api/src/config/kafka.config.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, KafkaConfig, Consumer, EachMessagePayload, Producer, logLevel } from 'kafkajs';
import { Observable, Subject, filter, map, takeUntil } from 'rxjs';

export interface KafkaConfigOptions {
    clientId: string;
    brokers: string[];
    groupId: string;
    topic: string;
    sessionTimeout: number;
    heartbeatInterval: number;
}

export interface KafkaConnectionConfig {
    host: string;
    port: number;
    username?: string;
    password?: string;
    topic: string;
    groupId: string;
}

@Injectable()
export class KafkaConfigService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(KafkaConfigService.name);
    private kafka: Kafka | null = null;
    private consumer: Consumer | null = null;
    private producer: Producer | null = null;
    private readonly destroy$ = new Subject<void>();
    private messages$: Subject<Record<string, unknown>> | null = null;
    private isConnected = false;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit(): void {
        this.logger.log('Inicializando configuración de Kafka');
        this.initializeKafka();
    }

    onModuleDestroy(): void {
        this.logger.log('Cerrando conexiones de Kafka');
        this.destroy$.next();
        this.destroy$.complete();
        this.disconnect();
    }

    private initializeKafka(): void {
        const connectionConfig = this.getConnectionConfig();
        this.logger.log(`Conectando a Kafka en ${connectionConfig.host}:${connectionConfig.port}`);
        this.logger.debug(`Topic configurado: ${connectionConfig.topic}, GroupId: ${connectionConfig.groupId}`);

        const kafkaConfig: KafkaConfig = {
            clientId: 'order-events-service',
            brokers: [`${connectionConfig.host}:${connectionConfig.port}`],
            logLevel: logLevel.WARN,
            retry: {
                initialRetryTime: 100,
                retries: 8
            },
            connectionTimeout: 3000,
            authenticationTimeout: 3000
        };

        if (connectionConfig.username && connectionConfig.password) {
            kafkaConfig.sasl = {
                mechanism: 'plain',
                username: connectionConfig.username,
                password: connectionConfig.password
            };
            this.logger.log('Configuración de autenticación SASL habilitada');
        }

        this.kafka = new Kafka(kafkaConfig);
        this.messages$ = new Subject<Record<string, unknown>>();
    }

    private getConnectionConfig(): KafkaConnectionConfig {
        const host = this.configService.get<string>('KAFKA_HOST', 'localhost');
        const port = this.configService.get<number>('KAFKA_PORT', 9092);
        const username = this.configService.get<string>('KAFKA_USERNAME');
        const password = this.configService.get<string>('KAFKA_PASSWORD');
        const topic = this.configService.get<string>('KAFKA_TOPIC', 'order-events');
        const groupId = this.configService.get<string>('KAFKA_GROUP_ID', 'order-events-consumer-group');

        return { host, port, username, password, topic, groupId };
    }

    async connect(): Promise<void> {
        if (this.isConnected) {
            this.logger.warn('Kafka ya está conectado');
            return;
        }

        if (!this.kafka) {
            throw new Error('Kafka no ha sido inicializado');
        }

        try {
            const connectionConfig = this.getConnectionConfig();
            this.consumer = this.kafka.consumer({
                groupId: connectionConfig.groupId,
                sessionTimeout: 30000,
                heartbeatInterval: 3000
            });

            this.producer = this.kafka.producer();

            await this.consumer.connect();
            await this.producer.connect();

            await this.consumer.subscribe({
                topic: connectionConfig.topic,
                fromBeginning: true
            });

            this.isConnected = true;
            this.logger.log('Conexión a Kafka establecida correctamente');
        } catch (error) {
            this.logger.error('Error al conectar con Kafka', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            if (this.consumer) {
                await this.consumer.disconnect();
                this.consumer = null;
            }
            if (this.producer) {
                await this.producer.disconnect();
                this.producer = null;
            }
            this.isConnected = false;
            this.logger.log('Desconexión de Kafka completada');
        } catch (error) {
            this.logger.error('Error al desconectar de Kafka', error);
        }
    }

    async consumeMessages(): Promise<Observable<Record<string, unknown>>> {
        if (!this.isConnected || !this.consumer) {
            await this.connect();
        }

        const connectionConfig = this.getConnectionConfig();

        await this.consumer!.run({
            eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                const value = message.value?.toString();
                if (value) {
                    try {
                        const parsed = JSON.parse(value);
                        this.logger.debug(`Mensaje recibido de ${topic}[${partition}]: ${message.offset}`);
                        this.messages$?.next(parsed);
                    } catch (error) {
                        this.logger.error('Error al parsear mensaje de Kafka', error);
                    }
                }
            }
        });

        return this.messages$!.asObservable().pipe(
            takeUntil(this.destroy$),
            filter((message): message is Record<string, unknown> => message !== null && message !== undefined)
        );
    }

    async sendMessage(topic: string, key: string, value: Record<string, unknown>): Promise<void> {
        if (!this.producer || !this.isConnected) {
            throw new Error('Productor de Kafka no conectado');
        }

        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        key,
                        value: JSON.stringify(value)
                    }
                ]
            });
            this.logger.debug(`Mensaje enviado a ${topic} con key ${key}`);
        } catch (error) {
            this.logger.error('Error al enviar mensaje a Kafka', error);
            throw error;
        }
    }

    getConnectionStatus(): { connected: boolean; broker: string; topic: string } {
        const connectionConfig = this.getConnectionConfig();
        return {
            connected: this.isConnected,
            broker: `${connectionConfig.host}:${connectionConfig.port}`,
            topic: connectionConfig.topic
        };
    }

    isKafkaConnected(): boolean {
        return this.isConnected;
    }
}

// === ARCHIVO: api/test/order-events.service.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { OrderEventsService } from '../src/application/order-events.service';
import { OrderEventsPort, OrderEvent, OrderEventType } from '../domain/order-events.port';
import { Observable, Subject, take } from 'rxjs';

describe('OrderEventsService', () => {
  let service: OrderEventsService;
  let mockPort: jest.Mocked<OrderEventsPort>;
  let eventsSubject: Subject<OrderEvent>;

  const mockOrderEvent: OrderEvent = new OrderEvent({
    id: 'evt-001',
    orderId: 'order-123',
    eventType: OrderEventType.ORDER_CREATED,
    timestamp: new Date('2024-01-15T10:30:00Z'),
    data: { amount: 100, currency: 'USD' },
  });

  beforeEach(async () => {
    eventsSubject = new Subject<OrderEvent>();
    
    mockPort = {
      subscribeToOrderEvents: jest.fn().mockReturnValue(eventsSubject.asObservable()),
      pauseConsuming: jest.fn().mockResolvedValue(undefined),
      resumeConsuming: jest.fn().mockResolvedValue(undefined),
      isConsumerRunning: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderEventsService,
        {
          provide: OrderEventsPort,
          useValue: mockPort,
        },
      ],
    }).compile();

    service = module.get<OrderEventsService>(OrderEventsService);
  });

  afterEach(() => {
    eventsSubject.complete();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('suscribirse a eventos de Kafka', () => {
    it('debería llamar a subscribeToOrderEvents del puerto al inicializar', () => {
      expect(mockPort.subscribeToOrderEvents).toHaveBeenCalled();
    });

    it('debería emitir eventos recibidos del adaptador de Kafka', async () => {
      const events: OrderEvent[] = [];
      
      service.getOrderEvents()
        .pipe(take(2))
        .subscribe(event => events.push(event));

      eventsSubject.next(mockOrderEvent);
      eventsSubject.next({
        ...mockOrderEvent,
        id: 'evt-002',
        eventType: OrderEventType.ORDER_UPDATED,
      });

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(events).toHaveLength(2);
      expect(events[0].orderId).toBe('order-123');
    });

    it('debería filtrar eventos válidos', async () => {
      const events: OrderEvent[] = [];
      
      service.getOrderEvents()
        .pipe(take(1))
        .subscribe(event => events.push(event));

      const invalidEvent = new OrderEvent({
        id: 'evt-invalid',
        orderId: '',
        eventType: OrderEventType.ORDER_CREATED,
        timestamp: new Date(),
        data: {},
      });

      eventsSubject.next(invalidEvent);
      eventsSubject.next(mockOrderEvent);

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(events).toHaveLength(1);
      expect(events[0].id).toBe('evt-001');
    });
  });

  describe('filtrado por tipo de evento', () => {
    it('debería filtrar eventos por tipo ORDER_CREATED', async () => {
      const events: OrderEvent[] = [];
      
      service.getOrderEventsByType(OrderEventType.ORDER_CREATED)
        .pipe(take(1))
        .subscribe(event => events.push(event));

      eventsSubject.next(new OrderEvent({
        id: 'evt-001',
        orderId: 'order-1',
        eventType: OrderEventType.ORDER_CREATED,
        timestamp: new Date(),
        data: {},
      }));

      eventsSubject.next(new OrderEvent({
        id: 'evt-002',
        orderId: 'order-2',
        eventType: OrderEventType.ORDER_CANCELLED,
        timestamp: new Date(),
        data: {},
      }));

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe(OrderEventType.ORDER_CREATED);
    });
  });

  describe('filtrado por ID de orden', () => {
    it('debería filtrar eventos por orderId', async () => {
      const events: OrderEvent[] = [];
      
      service.getOrderEventsByOrderId('order-123')
        .pipe(take(2))
        .subscribe(event => events.push(event));

      eventsSubject.next(new OrderEvent({
        id: 'evt-001',
        orderId: 'order-123',
        eventType: OrderEventType.ORDER_CREATED,
        timestamp: new Date(),
        data: {},
      }));

      eventsSubject.next(new OrderEvent({
        id: 'evt-002',
        orderId: 'order-456',
        eventType: OrderEventType.ORDER_UPDATED,
        timestamp: new Date(),
        data: {},
      }));

      eventsSubject.next(new OrderEvent({
        id: 'evt-003',
        orderId: 'order-123',
        eventType: OrderEventType.ORDER_COMPLETED,
        timestamp: new Date(),
        data: {},
      }));

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(events).toHaveLength(2);
      expect(events.every(e => e.orderId === 'order-123')).toBe(true);
    });
  });

  describe('control de consumo', () => {
    it('debería pausar el consumo de eventos', async () => {
      await service.pauseEventConsumption();
      
      expect(mockPort.pauseConsuming).toHaveBeenCalled();
    });

    it('debería reanudar el consumo de eventos', async () => {
      await service.resumeEventConsumption();
      
      expect(mockPort.resumeConsuming).toHaveBeenCalled();
    });

    it('debería retornar el estado del consumidor', () => {
      const isRunning = service.isConsumerRunning();
      
      expect(isRunning).toBe(true);
      expect(mockPort.isConsumerRunning).toHaveBeenCalled();
    });
  });

  describe('enriquecimiento de eventos', () => {
    it('debería enriquecer eventos con metadata de procesamiento', async () => {
      const events: OrderEvent[] = [];
      
      service.getOrderEvents()
        .pipe(take(1))
        .subscribe(event => events.push(event));

      eventsSubject.next(mockOrderEvent);

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(events).toHaveLength(1);
      expect(events[0].data).toHaveProperty('processedAt');
      expect(events[0].data).toHaveProperty('serviceName', 'order-events-service');
    });
  });

  describe('manejo de errores', () => {
    it('debería manejar errores en la suscripción de eventos', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockPort.subscribeToOrderEvents = jest.fn().mockReturnValue(
        new Observable(subscriber => {
          subscriber.error(new Error('Error de conexión con Kafka'));
        })
      );
      
      const testModule: TestingModule = await Test.createTestingModule({
        providers: [
          OrderEventsService,
          {
            provide: OrderEventsPort,
            useValue: mockPort,
          },
        ],
      }).compile();

      const testService = testModule.get<OrderEventsService>(OrderEventsService);
      
      expect(() => testService.onModuleInit()).not.toThrow();
      
      consoleSpy.mockRestore();
    });
  });
});

// === ARCHIVO: api/src/application/order-events.service.ts ===
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject, filter, map } from 'rxjs';
import { OrderEventsPort } from '../../domain/order-events.port';
import { OrderEvent, Order, OrderStatus, OrderEventType } from '../../domain/order.model';

@Injectable()
export class OrderEventsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventsService.name);
  private eventsSubject = new Subject<OrderEvent>();
  private subscription: { unsubscribe: () => void } | null = null;
  private isConsuming = false;
  private readonly ordersCache = new Map<string, Order>();
  private readonly eventsBuffer: OrderEvent[] = [];
  private readonly maxBufferSize = 1000;

  constructor(private readonly orderEventsPort: OrderEventsPort) {}

  public onModuleInit(): void {
    this.logger.log('Inicializando OrderEventsService');
    this.startConsuming();
  }

  public onModuleDestroy(): void {
    this.logger.log('Deteniendo OrderEventsService');
    this.stopConsuming();
  }

  public startConsuming(): void {
    if (this.isConsuming) {
      this.logger.warn('El consumidor ya está activo');
      return;
    }

    this.logger.log('Iniciando consumo de eventos de órdenes');
    const events$ = this.orderEventsPort.subscribeToOrderEvents();
    
    this.subscription = events$.subscribe({
      next: (event) => this.handleEvent(event),
      error: (error) => {
        this.logger.error(`Error en el flujo de eventos: ${error.message}`, error.stack);
        this.isConsuming = false;
      },
      complete: () => {
        this.logger.warn('El flujo de eventos se ha completado');
        this.isConsuming = false;
      },
    });

    this.isConsuming = true;
  }

  public stopConsuming(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.isConsuming = false;
    this.logger.log('Consumo de eventos detenido');
  }

  private handleEvent(event: OrderEvent): void {
    this.logger.debug(`Evento recibido: ${event.eventType} para orden ${event.orderId}`);
    
    if (event.order) {
      this.ordersCache.set(event.order.id, event.order);
      
      if (this.eventsBuffer.length >= this.maxBufferSize) {
        this.eventsBuffer.shift();
      }
      this.eventsBuffer.push(event);
    }
    
    this.eventsSubject.next(event);
  }

  public getEventsStream(): Observable<OrderEvent> {
    return this.eventsSubject.asObservable();
  }

  public getOrderById(orderId: string): Order | null {
    return this.ordersCache.get(orderId) || null;
  }

  public filterEventsByStatus(status: string): Observable<OrderEvent> {
    return this.eventsSubject.asObservable().pipe(
      filter((event) => event.newStatus === status)
    );
  }

  public filterEventsByOrderId(orderId: string): Observable<OrderEvent> {
    return this.eventsSubject.asObservable().pipe(
      filter((event) => event.orderId === orderId)
    );
  }

  public isConsumerRunning(): boolean {
    return this.isConsuming;
  }

  public restartConsumer(): void {
    this.logger.log('Reiniciando consumidor de eventos');
    this.stopConsuming();
    this.startConsuming();
  }

  public getRecentEvents(limit: number = 50): OrderEvent[] {
    return this.eventsBuffer.slice(-limit);
  }

  public getEventsCount(): number {
    return this.eventsBuffer.length;
  }

  public getCachedOrdersCount(): number {
    return this.ordersCache.size;
  }

  public clearCache(): void {
    this.ordersCache.clear();
    this.eventsBuffer.length = 0;
    this.logger.log('Caché de eventos limpiado');
  }
}

// === ARCHIVO: client/package.json ===
{
  "name": "client",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~20.0.0",
    "@angular/common": "~20.0.0",
    "@angular/compiler": "~20.0.0",
    "@angular/core": "~20.0.0",
    "@angular/forms": "~20.0.0",
    "@angular/platform-browser": "~20.0.0",
    "@angular/platform-browser-dynamic": "~20.0.0",
    "@angular/router": "~20.0.0",
    "@angular/material": "^17.0.0",
    "rxjs": "~7.8.1",
    "tslib": "^2.6.2",
    "zone.js": "~0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~20.0.0",
    "@angular/cli": "~20.0.0",
    "@angular/compiler-cli": "~20.0.0",
    "@types/jasmine": "~5.1.0",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.8.0"
  }
}

// === ARCHIVO: client/angular.json ===
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "standalone": true,
          "style": "scss"
        },
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/client",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "node_modules/@angular/material/prebuilt-themes/indigo-pink.css"
            ],
            "scripts": []
          },
          "configurations": {
            "development": {
              "optimization": false,
              "outputHashing": "all",
              "sourceMap": true,
              "namedChunks": true,
              "extractLicenses": false,
              "vendorChunk": true,
              "buildOptimizer": false
            },
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ]
            }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "development": {
              "browserTarget": "client:build:development"
            },
            "production": {
              "browserTarget": "client:build:production"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "client:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "tsconfig.spec.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [],
            "scripts": []
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": [
              "tsconfig.app.json",
              "tsconfig.spec.json"
            ],
            "exclude": [
              "**/node_modules/**"
            ]
          }
        }
      }
    }
  },
  "defaultProject": "client"
}

// === ARCHIVO: client/tsconfig.json ===
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom",
      "dom.iterable"
    ],
    "types": [
      "jasmine"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}

// === ARCHIVO: client/src/app/core/services/order-events.service.ts ===
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderEventsService {
  private readonly apiUrl = environment.apiUrl;
  private eventsSignal = signal<OrderEvent[]>([]);
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient) {}

  get orderEvents() {
    return this.eventsSignal.asReadonly();
  }

  connectToOrderEvents(): Observable<OrderEvent> {
    return new Observable<OrderEvent>(observer => {
      const eventSourceUrl = `${this.apiUrl}/orders/events`;

      this.eventSource = new EventSource(eventSourceUrl, {
        withCredentials: false
      });

      this.eventSource.onmessage = (event) => {
        try {
          const orderEvent: OrderEvent = JSON.parse(event.data);
          const currentEvents = this.eventsSignal();
          this.eventsSignal.set([...currentEvents, orderEvent]);
          observer.next(orderEvent);
        } catch (error) {
          observer.error('Error parsing event data');
        }
      };

      this.eventSource.onerror = (error) => {
        observer.error('EventSource failed: ' + error);
        this.disconnectFromOrderEvents();
      };

      return () => {
        this.disconnectFromOrderEvents();
      };
    });
  }

  disconnectFromOrderEvents(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  clearEvents(): void {
    this.eventsSignal.set([]);
  }
}

// === ARCHIVO: client/src/main.ts ===
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Error al iniciar la aplicación Angular:', err));

// === ARCHIVO: client/src/index.html ===
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Cliente de Órdenes en Tiempo Real</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Visualización de eventos de órdenes en tiempo real">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
  <noscript>
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1>JavaScript requerido</h1>
      <p>Por favor, habilite JavaScript en su navegador para usar esta aplicación.</p>
    </div>
  </noscript>
</body>
</html>

// === ARCHIVO: client/src/app/app.component.ts ===
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { OrderEventsService } from './core/services/order-events.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly orderEventsService = inject(OrderEventsService);
  
  readonly orderCount = this.orderEventsService.orderEvents;
  
  isMobileMenuOpen = false;
  isDesktopSidebarExpanded = true;

  ngOnInit(): void {
    this.orderEventsService.connectToOrderEvents();
  }

  ngOnDestroy(): void {
    this.orderEventsService.disconnectFromOrderEvents();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDesktopSidebar(): void {
    this.isDesktopSidebarExpanded = !this.isDesktopSidebarExpanded;
  }

  getUnreadCount(): number {
    return this.orderCount().length;
  }
}

// === ARCHIVO: client/src/app/app.config.ts ===
import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { routerTransitionProvider } from './core/animations/router-transition.provider';
import { storeProvider } from './core/state/store.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
      }),
      routerTransitionProvider
    ),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    storeProvider,
  ],
};

// === ARCHIVO: client/src/app/app.routes.ts ===
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loadingGuard } from './core/guards/loading.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [loadingGuard]
  },
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [authGuard, loadingGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

// === ARCHIVO: client/src/app/features/orders/orders.component.ts ===
import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderEventsService, OrderEvent } from '../../core/services/order-events.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy {
  private readonly orderEventsService = inject(OrderEventsService);
  
  readonly isConnected = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  
  readonly orderEvents = this.orderEventsService.orderEvents;
  
  readonly eventsCount = computed(() => this.orderEvents().length);
  
  readonly recentEvents = computed(() => {
    const events = this.orderEvents();
    return events.length > 10 ? events.slice(-10) : events;
  });

  ngOnInit(): void {
    this.connectToEvents();
  }

  ngOnDestroy(): void {
    this.disconnectFromEvents();
  }

  connectToEvents(): void {
    if (this.isConnected()) {
      return;
    }
    
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.orderEventsService.connectToOrderEvents().subscribe({
      next: () => {
        this.isConnected.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isConnected.set(false);
        this.isLoading.set(false);
        this.errorMessage.set('Error al conectar con el servidor de eventos');
        console.error('Error en la conexión SSE:', err);
      }
    });
  }

  disconnectFromEvents(): void {
    this.orderEventsService.disconnectFromOrderEvents();
    this.isConnected.set(false);
  }

  clearEvents(): void {
    this.orderEventsService.clearEvents();
  }

  reconnect(): void {
    this.disconnectFromEvents();
    setTimeout(() => this.connectToEvents(), 500);
  }

  getEventTypeIcon(eventType: string): string {
    const iconMap: Record<string, string> = {
      'ORDER_CREATED': 'add_shopping_cart',
      'ORDER_UPDATED': 'update',
      'ORDER_CANCELLED': 'cancel',
      'ORDER_COMPLETED': 'check_circle',
      'ORDER_PENDING': 'hourglass_empty'
    };
    return iconMap[eventType] || 'info';
  }

  getEventTypeClass(eventType: string): string {
    const classMap: Record<string, string> = {
      'ORDER_CREATED': 'event-created',
      'ORDER_UPDATED': 'event-updated',
      'ORDER_CANCELLED': 'event-cancelled',
      'ORDER_COMPLETED': 'event-completed',
      'ORDER_PENDING': 'event-pending'
    };
    return classMap[eventType] || 'event-default';
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

// === ARCHIVO: client/src/app/features/orders/orders.component.html ===
<div class="orders-container">
  <header class="orders-header">
    <h1>Pedidos en Tiempo Real</h1>
    <div class="header-actions">
      <span class="connection-status" [class.connected]="isConnected()">
        <span class="status-dot"></span>
        {{ isConnected() ? 'Conectado' : 'Desconectado' }}
      </span>
      <span class="events-count">
        <mat-icon>event</mat-icon>
        {{ eventsCount() }} eventos
      </span>
    </div>
  </header>

  <div class="controls-bar">
    <button 
      mat-raised-button 
      color="primary"
      (click)="connectToEvents()"
      [disabled]="isConnected() || isLoading()">
      <mat-icon>play_arrow</mat-icon>
      Conectar
    </button>
    
    <button 
      mat-raised-button 
      color="warn"
      (click)="disconnectFromEvents()"
      [disabled]="!isConnected()">
      <mat-icon>stop</mat-icon>
      Desconectar
    </button>
    
    <button 
      mat-stroked-button
      (click)="reconnect()"
      [disabled]="isLoading()">
      <mat-icon>refresh</mat-icon>
      Reconectar
    </button>
    
    <button 
      mat-stroked-button
      (click)="clearEvents()">
      <mat-icon>delete_sweep</mat-icon>
      Limpiar
    </button>
  </div>

  @if (isLoading()) {
    <div class="loading-overlay">
      <mat-spinner diameter="48"></mat-spinner>
      <p>Conectando al servidor de eventos...</p>
    </div>
  }

  @if (errorMessage()) {
    <div class="error-banner">
      <mat-icon>error_outline</mat-icon>
      <span>{{ errorMessage() }}</span>
      <button mat-icon-button (click)="reconnect()">
        <mat-icon>retry</mat-icon>
      </button>
    </div>
  }

  <div class="events-list" role="log" aria-live="polite">
    @if (recentEvents().length === 0) {
      <div class="empty-state">
        <mat-icon>inbox</mat-icon>
        <p>No hay eventos de pedidos</p>
        <span>Conecta al servidor para recibir eventos en tiempo real</span>
      </div>
    } @else {
      @for (event of recentEvents(); track event.id) {
        <mat-card class="event-card" [ngClass]="getEventTypeClass(event.eventType)">
          <mat-card-header>
            <mat-icon mat-card-avatar>{{ getEventTypeIcon(event.eventType) }}</mat-icon>
            <mat-card-title>Pedido #{{ event.orderId }}</mat-card-title>
            <mat-card-subtitle>
              <span class="event-type-badge">{{ event.eventType }}</span>
              <span class="event-timestamp">{{ formatTimestamp(event.timestamp) }}</span>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="event-details">
              <div class="detail-row">
                <span class="label">Cliente:</span>
                <span class="value">{{ event.customerName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Monto:</span>
                <span class="value">{{ event.amount | currency }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Estado:</span>
                <span class="value status-badge" [attr.data-status]="event.status">
                  {{ event.status }}
                </span>
              </div>
              @if (event.items && event.items.length > 0) {
                <div class="items-summary">
                  <span class="label">Productos:</span>
                  <span class="value">{{ event.items.length }} elemento(s)</span>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      }
    }
  </div>
</div>

// === ARCHIVO: client/src/app/features/orders/orders.component.scss ===
.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0e0e0;

  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 500;
    color: #333;
  }

  .header-actions {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    background-color: #ffebee;
    color: #c62828;
    font-weight: 500;
    font-size: 14px;

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #c62828;
      animation: pulse 2s infinite;
    }

    &.connected {
      background-color: #e8f5e9;
      color: #2e7d32;

      .status-dot {
        background-color: #2e7d32;
      }
    }
  }

  .events-count {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #666;
    font-size: 14px;

    mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.controls-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  button {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  p {
    margin-top: 16px;
    color: #666;
  }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #ffebee;
  border-left: 4px solid #c62828;
  border-radius: 4px;
  margin-bottom: 24px;
  color: #c62828;

  mat-icon {
    color: #c62828;
  }

  span {
    flex: 1;
  }
}

.events-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;

  mat-icon {
    font-size: 64px;
    width: 64px;
    height: 64px;
    color: #bdbdbd;
    margin-bottom: 16px;
  }

  p {
    margin: 0;
    font-size: 18px;
    color: #666;
  }

  span {
    margin-top: 8px;
    color: #999;
  }
}

.event-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  mat-card-header {
    margin-bottom: 12px;
  }

  .event-type-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    margin-right: 8px;
  }

  .event-timestamp {
    color: #999;
    font-size: 12px;
  }

  .event-details {
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .label {
        color: #666;
        font-weight: 500;
      }

      .value {
        color: #333;
      }
    }

    .items-summary {
      display: flex;
      justify-content: space-between;
      padding-top: 8px;

      .label {
        color: #666;
        font-weight: 500;
      }

      .value {
        color: #333;
      }
    }

    .status-badge {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;

      &[data-status="PENDING"] {
        background-color: #fff3e0;
        color: #e65100;
      }

      &[data-status="PROCESSING"] {
        background-color: #e3f2fd;
        color: #1565c0;
      }

      &[data-status="COMPLETED"] {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      &[data-status="CANCELLED"] {
        background-color: #ffebee;
        color: #c62828;
      }
    }
  }

  &.event-created {
    border-left: 4px solid #2196f3;
    .event-type-badge {
      background-color: #e3f2fd;
      color: #1565c0;
    }
  }

  &.event-updated {
    border-left: 4px solid #ff9800;
    .event-type-badge {
      background-color: #fff3e0;
      color: #e65100;
    }
  }

  &.event-cancelled {
    border-left: 4px solid #f44336;
    .event-type-badge {
      background-color: #ffebee;
      color: #c62828;
    }
  }

  &.event-completed {
    border-left: 4px solid #4caf50;
    .event-type-badge {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
  }

  &.event-pending {
    border-left: 4px solid #9e9e9e;
    .event-type-badge {
      background-color: #f5f5f5;
      color: #616161;
    }
  }
}

@media (max-width: 768px) {
  .orders-container {
    padding: 16px;
  }

  .orders-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    h1 {
      font-size: 22px;
    }
  }

  .controls-bar {
    flex-wrap: wrap;

    button {
      flex: 1;
      min-width: 120px;
    }
  }

  .events-list {
    grid-template-columns: 1fr;
  }
}

// === ARCHIVO: client/src/app/shared/components/order-card/order-card.component.ts ===
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderEvent } from '../../../core/services/order-events.service';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatTooltipModule],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderCardComponent {
  @Input({ required: true }) event!: OrderEvent;
  @Input() showTimestamp = true;
  @Input() compact = false;

  private readonly matTooltip = inject(MatTooltipModule);

  get eventTypeLabel(): string {
    const labels: Record<string, string> = {
      'ORDER_CREATED': 'Orden Creada',
      'ORDER_UPDATED': 'Orden Actualizada',
      'ORDER_CANCELLED': 'Orden Cancelada',
      'ORDER_COMPLETED': 'Orden Completada',
      'ORDER_PAYMENT_PENDING': 'Pago Pendiente',
      'ORDER_PAYMENT_RECEIVED': 'Pago Recibido'
    };
    return labels[this.event?.eventType] || this.event?.eventType || 'Desconocido';
  }

  get eventTypeClass(): string {
    const type = this.event?.eventType?.toLowerCase() || '';
    if (type.includes('created')) return 'event-created';
    if (type.includes('updated')) return 'event-updated';
    if (type.includes('cancelled')) return 'event-cancelled';
    if (type.includes('completed')) return 'event-completed';
    if (type.includes('payment')) return 'event-payment';
    return 'event-default';
  }

  get formattedTimestamp(): string {
    if (!this.event?.timestamp) return '';
    const date = new Date(this.event.timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  get customerName(): string {
    return this.event?.payload?.customer?.name || this.event?.payload?.customerName || 'Cliente no disponible';
  }

  get orderId(): string {
    return this.event?.payload?.orderId || this.event?.orderId || this.event?.id || 'N/A';
  }

  get orderStatus(): string {
    return this.event?.payload?.status || this.event?.status || 'Desconocido';
  }

  get totalAmount(): string {
    const amount = this.event?.payload?.totalAmount || this.event?.payload?.total || this.event?.amount;
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
  }

  get itemsCount(): number {
    const items = this.event?.payload?.items;
    if (!items || !Array.isArray(items)) return 0;
    return items.length;
  }

  trackByEventId(index: number, event: OrderEvent): string {
    return event?.id || `${index}`;
  }
}

// === ARCHIVO: client/src/app/shared/components/order-card/order-card.component.html ===
<mat-card class="order-card" [class.compact]="compact" [ngClass]="eventTypeClass">
  <mat-card-header>
    <mat-card-title class="order-title">
      <mat-icon class="event-icon">{{ event?.eventType?.includes('CREATED') ? 'add_circle' : event?.eventType?.includes('CANCELLED') ? 'cancel' : event?.eventType?.includes('COMPLETED') ? 'check_circle' : 'update' }}</mat-icon>
      <span class="event-type-label">{{ eventTypeLabel }}</span>
    </mat-card-title>
    <mat-card-subtitle *ngIf="!compact" class="order-subtitle">
      Orden #{{ orderId }}
    </mat-card-subtitle>
  </mat-card-header>

  <mat-card-content>
    <div class="order-details">
      <div class="detail-row">
        <span class="detail-label">Cliente:</span>
        <span class="detail-value">{{ customerName }}</span>
      </div>

      <div class="detail-row" *ngIf="!compact">
        <span class="detail-label">Estado:</span>
        <mat-chip class="status-chip" [ngClass]="'status-' + orderStatus.toLowerCase()">
          {{ orderStatus }}
        </mat-chip>
      </div>

      <div class="detail-row">
        <span class="detail-label">Monto:</span>
        <span class="detail-value amount">{{ totalAmount }}</span>
      </div>

      <div class="detail-row" *ngIf="!compact && itemsCount > 0">
        <span class="detail-label">Artículos:</span>
        <span class="detail-value">{{ itemsCount }} elemento(s)</span>
      </div>

      <div class="detail-row timestamp-row" *ngIf="showTimestamp">
        <mat-icon class="timestamp-icon">schedule</mat-icon>
        <span class="timestamp">{{ formattedTimestamp }}</span>
      </div>
    </div>
  </mat-card-content>

  <mat-card-actions *ngIf="!compact">
    <button mat-button color="primary" [matTooltip]="'Ver detalles de la orden '">
      <mat-icon>visibility</mat-icon>
      Ver Detalles
    </button>
  </mat-card-actions>
</mat-card>

// === ARCHIVO: client/src/app/shared/components/order-card/order-card.component.scss ===
.order-card {
  margin: 12px 0;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  &.compact {
    margin: 8px 0;
    padding: 8px;
  }

  mat-card-header {
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    margin-bottom: 12px;
  }

  .order-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
  }

  .event-icon {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  .event-type-label {
    font-weight: 600;
  }

  .order-subtitle {
    font-size: 0.9rem;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 4px;
  }

  .order-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
  }

  .detail-label {
    font-size: 0.85rem;
    color: rgba(0, 0, 0, 0.54);
    font-weight: 500;
  }

  .detail-value {
    font-size: 0.9rem;
    color: rgba(0, 0, 0, 0.87);
    font-weight: 400;

    &.amount {
      font-weight: 600;
      color: #2e7d32;
      font-size: 1rem;
    }
  }

  .timestamp-row {
    display: flex;
    align-items: center;
    gap: 4px;
    color: rgba(0, 0, 0, 0.54);
    font-size: 0.8rem;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed rgba(0, 0, 0, 0.12);
  }

  .timestamp-icon {
    font-size: 14px;
    width: 14px;
    height: 14px;
  }

  .timestamp {
    font-size: 0.75rem;
  }

  .status-chip {
    font-size: 0.75rem;
    min-height: 24px;
    padding: 0 8px;
  }

  mat-card-actions {
    padding: 8px 16px 16px;
    margin: 0;

    button {
      color: #1976d2;
    }
  }
}

.event-created {
  border-left: 4px solid #4caf50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, transparent 100%);
}

.event-updated {
  border-left: 4px solid #2196f3;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, transparent 100%);
}

.event-cancelled {
  border-left: 4px solid #f44336;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.08) 0%, transparent 100%);
}

.event-completed {
  border-left: 4px solid #9c27b0;
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.08) 0%, transparent 100%);
}

.event-payment {
  border-left: 4px solid #ff9800;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.08) 0%, transparent 100%);
}

.event-default {
  border-left: 4px solid #607d8b;
  background: linear-gradient(135deg, rgba(96, 125, 139, 0.08) 0%, transparent 100%);
}

.status-created { background-color: #e8f5e9; color: #2e7d32; }
.status-updated { background-color: #e3f2fd; color: #1565c0; }
.status-cancelled { background-color: #ffebee; color: #c62828; }
.status-completed { background-color: #f3e5f5; color: #7b1fa2; }
.status-pending { background-color: #fff3e0; color: #ef6c00; }

// === ARCHIVO: client/src/app/shared/services/api-client.service.ts ===
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { catchError, map, retry, shareReplay, finalize, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiRequestConfig {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  body?: unknown;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  observe?: 'body' | 'response' | 'events';
  reportProgress?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: HttpHeaders;
}

export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  error?: unknown;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new Subject<ApiError>();
  private readonly cancelSubject = new Subject<void>();

  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  get<T>(endpoint: string, config?: ApiRequestConfig): Observable<T> {
    const url = this.buildUrl(endpoint);
    const params = this.buildParams(config?.params);
    const headers = this.buildHeaders(config?.headers);

    this.loadingSubject.next(true);

    return this.http.get<T>(url, {
      params,
      headers,
      responseType: config?.responseType || 'json',
      observe: config?.observe || 'body',
      reportProgress: config?.reportProgress || false
    }).pipe(
      retry({ count: 2, delay: 1000 }),
      map(response => this.extractData<T>(response, config?.observe)),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false)),
      takeUntil(this.cancelSubject),
      shareReplay(1)
    );
  }

  post<T>(endpoint: string, body: unknown, config?: ApiRequestConfig): Observable<T> {
    const url = this.buildUrl(endpoint);
    const params = this.buildParams(config?.params);
    const headers = this.buildHeaders(config?.headers);

    this.loadingSubject.next(true);

    return this.http.post<T>(url, body, {
      params,
      headers,
      responseType: config?.responseType || 'json',
      observe: config?.observe || 'body',
      reportProgress: config?.reportProgress || false
    }).pipe(
      map(response => this.extractData<T>(response, config?.observe)),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false)),
      takeUntil(this.cancelSubject),
      shareReplay(1)
    );
  }

  put<T>(endpoint: string, body: unknown, config?: ApiRequestConfig): Observable<T> {
    const url = this.buildUrl(endpoint);
    const params = this.buildParams(config?.params);
    const headers = this.buildHeaders(config?.headers);

    this.loadingSubject.next(true);

    return this.http.put<T>(url, body, {
      params,
      headers,
      responseType: config?.responseType || 'json',
      observe: config?.observe || 'body'
    }).pipe(
      map(response => this.extractData<T>(response, config?.observe)),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false)),
      takeUntil(this.cancelSubject)
    );
  }

  patch<T>(endpoint: string, body: unknown, config?: ApiRequestConfig): Observable<T> {
    const url = this.buildUrl(endpoint);
    const params = this.buildParams(config?.params);
    const headers = this.buildHeaders(config?.headers);

    this.loadingSubject.next(true);

    return this.http.patch<T>(url, body, {
      params,
      headers,
      responseType: config?.responseType || 'json',
      observe: config?.observe || 'body'
    }).pipe(
      map(response => this.extractData<T>(response, config?.observe)),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false)),
      takeUntil(this.cancelSubject)
    );
  }

  delete<T>(endpoint: string, config?: ApiRequestConfig): Observable<T> {
    const url = this.buildUrl(endpoint);
    const params = this.buildParams(config?.params);
    const headers = this.buildHeaders(config?.headers);

    this.loadingSubject.next(true);

    return this.http.delete<T>(url, {
      params,
      headers,
      responseType: config?.responseType || 'json',
      observe: config?.observe || 'body'
    }).pipe(
      map(response => this.extractData<T>(response, config?.observe)),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false)),
      takeUntil(this.cancelSubject)
    );
  }

  getEventStream<T>(endpoint: string, headers?: Record<string, string>): Observable<T> {
    const url = this.buildUrl(endpoint);
    const eventHeaders = this.buildHeaders({
      ...headers,
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache'
    });

    return new Observable<T>(observer => {
      const eventSource = new EventSource(url, { headers: this.headersToPlainObject(eventHeaders) });

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as T;
          observer.next(data);
        } catch (parseError) {
          console.warn('Error al parsear evento SSE:', parseError);
        }
      };

      eventSource.onerror = (error) => {
        observer.error(error);
        eventSource.close();
      };

      eventSource.onopen = () => {
        console.log('Conexión SSE establecida con:', endpoint);
      };

      return () => {
        eventSource.close();
        console.log('Conexión SSE cerrada para:', endpoint);
      };
    });
  }

  cancelPendingRequests(): void {
    this.cancelSubject.next();
    this.cancelSubject.complete();
  }

  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  private buildParams(params?: Record<string, string | number | boolean>): HttpParams {
    if (!params) return new HttpParams();
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  private buildHeaders(headers?: Record<string, string>): HttpHeaders {
    let resultHeaders = this.defaultHeaders;
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        resultHeaders = resultHeaders.set(key, value);
      });
    }
    return resultHeaders;
  }

  private extractData<T>(response: unknown, observe?: string): T {
    if (observe === 'response') {
      const apiResponse = response as { body: T };
      return apiResponse.body;
    }
    return response as T;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    let errorDetails: unknown;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de red: ${error.error.message}`;
      errorDetails = error.error;
    } else {
      errorMessage = error.error?.message || error.message || `Error HTTP ${error.status}: ${error.statusText}`;
      errorDetails = error.error;
    }

    const apiError: ApiError = {
      message: errorMessage,
      status: error.status,
      statusText: error.statusText,
      error: errorDetails,
      timestamp: new Date().toISOString()
    };

    console.error('Error en API:', apiError);
    this.errorSubject.next(apiError);

    return throwError(() => apiError);
  }

  private headersToPlainObject(headers: HttpHeaders): Record<string, string> {
    const headersObj: Record<string, string> = {};
    headers.keys().forEach(key => {
      const value = headers.get(key);
      if (value) headersObj[key] = value;
    });
    return headersObj;
  }
}

// === ARCHIVO: client/src/environments/environment.ts ===
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  apiEndpoints: {
    orders: '/orders',
    orderEvents: '/orders/events',
    customers: '/customers',
    products: '/products',
    payments: '/payments'
  },
  sseConfig: {
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000,
    connectionTimeout: 10000
  },
  httpConfig: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    withCredentials: false,
    cacheEnabled: true,
    cacheMaxAge: 300000
  },
  features: {
    enableRealTimeUpdates: true,
    enableNotifications: true,
    enableAnalytics: true,
    enableDebugMode: true,
    enableLogging: true
  },
  ui: {
    defaultPageSize: 10,
    maxPageSize: 100,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm:ss',
    currency: 'USD',
    locale: 'es-ES',
    theme: 'indigo-pink',
    animationsEnabled: true,
    compactMode: false
  },
  pagination: {
    defaultPage: 1,
    pageSizeOptions: [5, 10, 25, 50],
    showFirstLastButtons: true
  },
  cache: {
    localStoragePrefix: 'app_',
    sessionStoragePrefix: 'session_',
    enablePersistence: true,
    maxCacheSize: 50
  },
  logging: {
    level: 'debug',
    enableConsole: true,
    enableRemote: false,
    remoteEndpoint: '',
    logLevels: {
      error: true,
      warn: true,
      info: true,
      debug: true,
      trace: false
    }
  },
  security: {
    enableCsrf: true,
    enableXssProtection: true,
    enableContentSecurityPolicy: true,
    allowedDomains: ['localhost:3000', 'localhost:4200']
  },
  websocket: {
    enabled: false,
    url: '',
    reconnectInterval: 5000
  }
};

export type Environment = typeof environment;

// === ARCHIVO: client/src/app/core/animations/router-transition.provider.ts ===
import { Provider } from '@angular/core';
import {
  withInMemoryScrolling,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';

const routeAnimationTrigger = trigger('routeAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 1,
      }),
    ], { optional: true }),
    group([
      query(':leave', [
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 0, transform: 'translateX(-20px)' })
        ),
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate(
          '300ms 100ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ], { optional: true }),
    ]),
  ]),
]);

const pageSlideAnimation = trigger('pageSlide', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate(
      '250ms ease-out',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms ease-in',
      style({ opacity: 0, transform: 'translateY(-10px)' })
    ),
  ]),
]);

const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('200ms ease-in-out', style({ opacity: 1 })),
  ]),
]);

export const ROUTE_ANIMATION = routeAnimationTrigger;
export const PAGE_SLIDE_ANIMATION = pageSlideAnimation;
export const FADE_ANIMATION = fadeAnimation;

export function routerTransitionProvider(): typeof withInMemoryScrolling {
  return withInMemoryScrolling({
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  });
}

export const ROUTE_TRANSITION_PROVIDER: Provider = {
  provide: 'ROUTER_TRANSITION_OPTIONS',
  useValue: {
    anchorScrolling: true,
    scrollPositionRestoration: 'enabled',
    animations: [routeAnimationTrigger, pageSlideAnimation, fadeAnimation],
  },
};

// === ARCHIVO: client/src/app/core/state/store.provider.ts ===
import { Provider, APP_INITIALIZER, inject } from '@angular/core';
import {
  signal,
  computed,
  Signal,
  WritableSignal,
  ReadonlySignal,
} from '@angular/core';

export interface AppState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  sidebarExpanded: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatarUrl?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  read: boolean;
}

const initialState: AppState = {
  isAuthenticated: false,
  currentUser: null,
  sidebarExpanded: true,
  theme: 'light',
  notifications: [],
};

export class AppStore {
  private readonly state: WritableSignal<AppState> = signal<AppState>(initialState);

  readonly isAuthenticated: ReadonlySignal<boolean> = computed(
    () => this.state().isAuthenticated
  );

  readonly currentUser: ReadonlySignal<UserProfile | null> = computed(
    () => this.state().currentUser
  );

  readonly sidebarExpanded: ReadonlySignal<boolean> = computed(
    () => this.state().sidebarExpanded
  );

  readonly theme: ReadonlySignal<'light' | 'dark'> = computed(
    () => this.state().theme
  );

  readonly notifications: ReadonlySignal<Notification[]> = computed(
    () => this.state().notifications
  );

  readonly unreadNotifications: ReadonlySignal<number> = computed(
    () => this.state().notifications.filter((n) => !n.read).length
  );

  getState(): AppState {
    return this.state();
  }

  setAuthenticated(user: UserProfile): void {
    this.state.update((s) => ({
      ...s,
      isAuthenticated: true,
      currentUser: user,
    }));
  }

  logout(): void {
    this.state.update((s) => ({
      ...s,
      isAuthenticated: false,
      currentUser: null,
    }));
  }

  toggleSidebar(): void {
    this.state.update((s) => ({
      ...s,
      sidebarExpanded: !s.sidebarExpanded,
    }));
  }

  setSidebarExpanded(expanded: boolean): void {
    this.state.update((s) => ({
      ...s,
      sidebarExpanded: expanded,
    }));
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.state.update((s) => ({ ...s, theme }));
    if (typeof document !== 'undefined') {
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(`${theme}-theme`);
    }
  }

  toggleTheme(): void {
    const current = this.state().theme;
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };
    this.state.update((s) => ({
      ...s,
      notifications: [newNotification, ...s.notifications].slice(0, 50),
    }));
  }

  markNotificationRead(id: string): void {
    this.state.update((s) => ({
      ...s,
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  }

  markAllNotificationsRead(): void {
    this.state.update((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  }

  clearNotifications(): void {
    this.state.update((s) => ({
      ...s,
      notifications: [],
    }));
  }

  reset(): void {
    this.state.set(initialState);
  }
}

const appStore = new AppStore();

export function storeProvider(): Provider {
  return {
    provide: APP_INITIALIZER,
    useFactory: () => {
      return () => {
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          appStore.setTheme(savedTheme);
        }
        const savedSidebar = localStorage.getItem('sidebar-expanded');
        if (savedSidebar !== null) {
          appStore.setSidebarExpanded(savedSidebar === 'true');
        }
      };
    },
    multi: true,
  };
}

export function useAppStore(): AppStore {
  return appStore;
}

export { appStore };

// === ARCHIVO: client/src/app/core/guards/auth.guard.ts ===
import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, map, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuth(state.url, route.data['requiredPermissions'], route.data['requiredRole']);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuth(state.url, childRoute.data['requiredPermissions'], childRoute.data['requiredRole']);
  }

  private checkAuth(
    url: string,
    requiredPermissions?: string | string[],
    requiredRole?: string
  ): Observable<boolean | UrlTree> {
    if (this.authService.isAuthenticated()) {
      if (requiredRole && !this.authService.hasRole(requiredRole)) {
        return of(this.createForbiddenTree(url));
      }

      if (requiredPermissions) {
        const permissions = Array.isArray(requiredPermissions) 
          ? requiredPermissions 
          : [requiredPermissions];
        
        const hasAllPermissions = permissions.every(
          permission => this.authService.hasPermission(permission)
        );

        if (!hasAllPermissions) {
          return of(this.createForbiddenTree(url));
        }
      }

      return of(true);
    }

    return of(this.createLoginTree(url));
  }

  private createLoginTree(returnUrl: string): UrlTree {
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl }
    });
  }

  private createForbiddenTree(returnUrl: string): UrlTree {
    return this.router.createUrlTree(['/forbidden'], {
      queryParams: { returnUrl }
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    if (!this.authService.isAdmin()) {
      return this.router.createUrlTree(['/forbidden'], {
        queryParams: { returnUrl: state.url }
      });
    }

    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/dashboard']);
    }
    return true;
  }
}

// === ARCHIVO: client/src/app/core/guards/loading.guard.ts ===
import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable, of, BehaviorSubject, combineLatest, map, takeUntil, Subject, timer } from 'rxjs';
import { ApiClientService } from '../../shared/services/api-client.service';

interface LoadingState {
  isLoading: boolean;
  pendingRequests: number;
  loadingMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingGuard implements CanActivate, CanActivateChild, OnDestroy {
  private readonly router = inject(Router);
  private readonly apiClient = inject(ApiClientService);
  
  private readonly loadingState = signal<LoadingState>({
    isLoading: false,
    pendingRequests: 0,
    loadingMessage: undefined
  });
  
  private readonly minimumLoadingTime = 300;
  private readonly destroy$ = new Subject<void>();
  private loadingStartTime = 0;
  private pendingGuards: Map<string, Observable<boolean | UrlTree>> = new Map();

  readonly isLoading = computed(() => this.loadingState().isLoading);
  readonly pendingRequests = computed(() => this.loadingState().pendingRequests);
  readonly loadingMessage = computed(() => this.loadingState().loadingMessage);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const guardId = `canActivate_${state.url}`;
    return this.executeWithLoading(guardId, of(true));
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const guardId = `canActivateChild_${state.url}`;
    return this.executeWithLoading(guardId, of(true));
  }

  private executeWithLoading<T>(guardId: string, guardResult: Observable<T>): Observable<T> {
    this.startLoading(`Verifying access to ${guardId}`);
    
    const resultWithMinTime = guardResult.pipe(
      takeUntil(this.destroy$)
    );

    const elapsedTime = timer(this.minimumLoadingTime).pipe(
      takeUntil(this.destroy$)
    );

    return combineLatest([resultWithMinTime, elapsedTime]).pipe(
      map(([result]) => {
        this.stopLoading();
        return result;
      }),
      takeUntil(this.destroy$)
    );
  }

  private startLoading(message: string): void {
    this.loadingStartTime = Date.now();
    this.loadingState.update(state => ({
      ...state,
      isLoading: true,
      pendingRequests: state.pendingRequests + 1,
      loadingMessage: message
    }));
  }

  private stopLoading(): void {
    const elapsed = Date.now() - this.loadingStartTime;
    const remainingTime = Math.max(0, this.minimumLoadingTime - elapsed);
    
    setTimeout(() => {
      this.loadingState.update(state => {
        const newPendingRequests = Math.max(0, state.pendingRequests - 1);
        return {
          ...state,
          isLoading: newPendingRequests > 0,
          pendingRequests: newPendingRequests,
          loadingMessage: newPendingRequests > 0 ? state.loadingMessage : undefined
        };
      });
    }, remainingTime);
  }

  forceCompleteLoading(): void {
    this.loadingState.set({
      isLoading: false,
      pendingRequests: 0,
      loadingMessage: undefined
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pendingGuards.clear();
  }
}

@Injectable({
  providedIn: 'root'
})
export class RouteLoadingState implements OnDestroy {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly messageSubject = new BehaviorSubject<string>('');
  private readonly destroy$ = new Subject<void>();

  readonly isLoading$ = this.loadingSubject.asObservable();
  readonly loadingMessage$ = this.messageSubject.asObservable();

  setLoading(isLoading: boolean, message: string = ''): void {
    this.loadingSubject.next(isLoading);
    this.messageSubject.next(message);
  }

  showLoading(message: string = 'Loading...'): void {
    this.setLoading(true, message);
  }

  hideLoading(): void {
    this.setLoading(false, '');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loadingSubject.complete();
    this.messageSubject.complete();
  }
}

@Injectable({
  providedIn: 'root'
})
export class PreventMultipleNavigationGuard implements CanActivate {
  private readonly router = inject(Router);
  private isNavigating = false;
  private navigationQueue: Array<() => void> = [];

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isNavigating) {
      this.navigationQueue.push(() => {
        this.router.navigate([state.url]);
      });
      return false;
    }

    this.isNavigating = true;
    
    const result = true;
    
    setTimeout(() => {
      this.isNavigating = false;
      const next = this.navigationQueue.shift();
      if (next) next();
    }, 100);

    return result;
  }
}

// === ARCHIVO: client/src/app/features/analytics/analytics.component.ts ===
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrderEventsService } from '../../core/services/order-events.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="analytics-container">
      <h1>Analytics</h1>
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Total Events</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ totalEvents() }}</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Orders Created</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ ordersCreated() }}</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Orders Updated</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ ordersUpdated() }}</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Orders Cancelled</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ ordersCancelled() }}</div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 24px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    .stat-card {
      padding: 16px;
    }
    .stat-value {
      font-size: 36px;
      font-weight: bold;
      text-align: center;
      margin-top: 16px;
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  private readonly orderEventsService = inject(OrderEventsService);
  
  readonly totalEvents = computed(() => this.orderEventsService.orderEvents().length);
  readonly ordersCreated = computed(() => 
    this.orderEventsService.orderEvents().filter(e => e.eventType === 'ORDER_CREATED').length
  );
  readonly ordersUpdated = computed(() => 
    this.orderEventsService.orderEvents().filter(e => e.eventType === 'ORDER_UPDATED').length
  );
  readonly ordersCancelled = computed(() => 
    this.orderEventsService.orderEvents().filter(e => e.eventType === 'ORDER_CANCELLED').length
  );

  ngOnInit(): void {
    if (!this.orderEventsService.orderEvents().length) {
      this.orderEventsService.connectToOrderEvents().subscribe();
    }
  }
}

// === ARCHIVO: client/src/app/features/settings/settings.component.ts ===
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="settings-container">
      <h1>Settings</h1>
      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>Display Preferences</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="settings-form">
            <mat-form-field appearance="outline">
              <mat-label>Theme</mat-label>
              <mat-select [value]="theme()" (selectionChange)="theme.set($event.value)">
                <mat-option value="light">Light</mat-option>
                <mat-option value="dark">Dark</mat-option>
                <mat-option value="auto">Auto</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Events per page</mat-label>
              <input matInput type="number" [value]="eventsPerPage()" (input)="eventsPerPage.set($any($event.target).value)">
            </mat-form-field>
            <mat-slide-toggle 
              [checked]="autoReconnect()" 
              (change)="autoReconnect.set($event.checked)">
              Auto-reconnect on disconnect
            </mat-slide-toggle>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="saveSettings()">Save</button>
          <button mat-button (click)="resetSettings()">Reset</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    .settings-card {
      margin-top: 16px;
    }
    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class SettingsComponent {
  readonly theme = signal<string>('light');
  readonly eventsPerPage = signal<number>(50);
  readonly autoReconnect = signal<boolean>(true);

  saveSettings(): void {
    const settings = {
      theme: this.theme(),
      eventsPerPage: this.eventsPerPage(),
      autoReconnect: this.autoReconnect()
    };
    localStorage.setItem('app-settings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
  }

  resetSettings(): void {
    this.theme.set('light');
    this.eventsPerPage.set(50);
    this.autoReconnect.set(true);
    localStorage.removeItem('app-settings');
  }
}

// === ARCHIVO: client/src/app/shared/components/not-found/not-found.component.ts ===
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="not-found-container">
      <mat-card class="not-found-card">
        <mat-card-content>
          <mat-icon class="error-icon">error_outline</mat-icon>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <button mat-raised-button color="primary" routerLink="/">
            <mat-icon>home</mat-icon>
            Go to Home
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 24px;
    }
    .not-found-card {
      max-width: 400px;
      text-align: center;
      padding: 32px;
    }
    .error-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #f44336;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 72px;
      font-weight: bold;
      margin: 0;
      color: #3f51b5;
    }
    h2 {
      font-size: 24px;
      margin: 8px 0;
    }
    p {
      color: #666;
      margin-bottom: 24px;
    }
    button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class NotFoundComponent {}

// === ARCHIVO: client/src/app/core/services/auth.service.ts ===
import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { AppStore } from '../state/store.provider';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  sub: string;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly appStore = inject(AppStore);
  
  private readonly tokenKey = 'auth_token';
  private readonly refreshTokenKey = 'refresh_token';
  private readonly userKey = 'user_data';
  
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly isAuthenticatedSignal = signal<boolean>(false);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  
  private refreshTokenTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  
  readonly isAdmin = computed(() => {
    const user = this.currentUserSignal();
    return user?.role === 'admin' || user?.permissions.includes('admin:access');
  });

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const token = this.getToken();
    const userData = this.getStoredUser();
    
    if (token && userData && !this.isTokenExpired(token)) {
      this.currentUserSignal.set(userData);
      this.isAuthenticatedSignal.set(true);
      this.startRefreshTokenTimer();
    } else {
      this.clearAuthData();
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.performLogin(credentials).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
        this.isLoadingSignal.set(false);
      }),
      catchError(error => {
        this.isLoadingSignal.set(false);
        const errorMessage = this.extractErrorMessage(error);
        this.errorSignal.set(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private performLogin(credentials: LoginCredentials): Observable<AuthResponse> {
    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      username: credentials.username,
      email: `${credentials.username}@example.com`,
      role: credentials.username === 'admin' ? 'admin' : 'user',
      permissions: credentials.username === 'admin' 
        ? ['admin:access', 'orders:read', 'orders:write', 'analytics:view']
        : ['orders:read', 'orders:write'],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${credentials.username}`,
      lastLogin: new Date().toISOString()
    };

    const mockResponse: AuthResponse = {
      user: mockUser,
      token: this.generateMockToken(mockUser),
      refreshToken: 'refresh_' + Math.random().toString(36).substr(2, 16),
      expiresIn: 3600
    };

    return timer(800).pipe(
      map(() => mockResponse)
    );
  }

  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      username: user.username,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = btoa('mock_signature');
    return `${header}.${payload}.${signature}`;
  }

  logout(): void {
    this.clearAuthData();
    this.stopRefreshTokenTimer();
    this.appStore.logout();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const currentUser = this.currentUserSignal();
    if (!currentUser) {
      return throwError(() => new Error('No user session'));
    }

    const newToken = this.generateMockToken(currentUser);
    const response: AuthResponse = {
      user: currentUser,
      token: newToken,
      refreshToken: 'refresh_' + Math.random().toString(36).substr(2, 16),
      expiresIn: 3600
    };

    return timer(300).pipe(
      map(() => {
        this.storeToken(response.token);
        this.storeRefreshToken(response.refreshToken);
        this.startRefreshTokenTimer();
        return response;
      })
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.storeToken(response.token);
    this.storeRefreshToken(response.refreshToken);
    this.storeUser(response.user);
    this.currentUserSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);
    this.appStore.setAuthenticated(response.user);
    this.startRefreshTokenTimer();
  }

  private startRefreshTokenTimer(): void {
    this.stopRefreshTokenTimer();
    const token = this.getToken();
    if (!token) return;

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return;

    const expiryTime = payload.exp * 1000;
    const timeout = expiryTime - Date.now() - 60000;
    
    if (timeout > 0) {
      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken().subscribe({
          error: () => this.logout()
        });
      }, timeout);
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey) || sessionStorage.getItem(this.refreshTokenKey);
  }

  private storeToken(token: string, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.tokenKey, token);
  }

  private storeRefreshToken(token: string, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.refreshTokenKey, token);
  }

  private getStoredUser(): User | null {
    const userData = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  private storeUser(user: User, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.userKey, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
    sessionStorage.removeItem(this.userKey);
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  private decodeToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return 'An unexpected error occurred. Please try again.';
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSignal();
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === 'admin';
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSignal();
    if (!user) return false;
    return user.role === role;
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.currentUserSignal();
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user'));
    }

    const updatedUser = { ...currentUser, ...updates };
    return timer(500).pipe(
      map(() => {
        this.currentUserSignal.set(updatedUser);
        this.storeUser(updatedUser);
        this.appStore.setAuthenticated(updatedUser);
        return updatedUser;
      })
    );
  }
}

// === ARCHIVO: client/src/app/core/services/loading.service.ts ===
import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private ready = false;
  private initializationDelay = 500;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    timer(this.initializationDelay).subscribe(() => {
      this.ready = true;
    });
  }

  isReady(): Observable<boolean> {
    return of(this.ready).pipe(
      take(1)
    );
  }

  isLoading(): boolean {
    return !this.ready;
  }

  setReady(ready: boolean): void {
    this.ready = ready;
  }
}

// === ARCHIVO: client/tsconfig.app.json ===
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts",
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts"
  ]
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  kafka:
    image: "apache/kafka:3.8.0"
    ports:
      - "127.0.0.1:9092:9092"
    environment:
      KAFKA_NODE_ID: "1"
      KAFKA_PROCESS_ROLES: "broker,controller"
      KAFKA_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://localhost:9092"
      KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
      KAFKA_CONTROLLER_QUORUM_VOTERS: "1@localhost:9093"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0"
    healthcheck:
      test: ["CMD-SHELL","/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092 > /dev/null 2>&1"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 30s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| Apache Kafka (KRaft, un nodo) | `apache/kafka:3.8.0` | 9092 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/kafka/create-topics.sh ===
#!/usr/bin/env bash
# Crea los topics en Kafka local (idempotente). Ejecutar con el compose levantado y healthy.
set -euo pipefail

docker compose exec -T kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic app-events --partitions 1 --replication-factor 1

```
