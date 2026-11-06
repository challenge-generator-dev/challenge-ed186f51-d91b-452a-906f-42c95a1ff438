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