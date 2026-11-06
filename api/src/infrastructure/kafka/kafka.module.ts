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