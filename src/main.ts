import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const appConfig = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MINI Bank')
    .setDescription('THIS IS MINI BANK SERVICE')
    .setVersion('1.0')
    .addTag('bank cash money')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);
  
  await app.listen(appConfig.get<number>('port') || 3000);
}
bootstrap();
