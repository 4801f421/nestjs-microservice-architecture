// libs/common/src/logger/logger.module.ts

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file'; // Import the daily rotate file transport

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';

        // Console transport for development
        const consoleTransport = new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.colorize(),
            winston.format.simple(),
          ),
        });

        // Daily rotating file transport for production
        const fileTransport = new winston.transports.DailyRotateFile({
          filename: 'logs/application-%DATE%.log', // Log file name pattern
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true, // Zip old log files
          maxSize: '20m', // Max size of a log file before rotating
          maxFiles: '14d', // Keep logs for 14 days
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(), // Log in JSON format for production
          ),
        });

        return {
          level: isProduction ? 'info' : 'debug',
          transports: [
            // In production, log to files. In development, log to console.
            isProduction ? fileTransport : consoleTransport,
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class LoggerModule {}