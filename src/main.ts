/*
 * @Author: liaokt
 * @Description:
 * @Date: 2023-11-27 16:21:04
 * @LastEditors: liaokt
 * @LastEditTime: 2023-12-04 16:43:24
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes';
import { FormatResponseInterceptor } from './interceptors/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptors/invoke-record.interceptor';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  app.useGlobalFilters(new CustomExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('K1B_CMS')
    .setDescription('API/DOC')
    .setVersion('0.1')
    .addBearerAuth({
      type: 'http',
      description: 'jwt auth',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(configService.get('NEST_SERVER_PORT'));
}
bootstrap();
