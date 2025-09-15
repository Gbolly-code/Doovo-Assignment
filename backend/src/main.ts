import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
     .setTitle('Doovo API')
     .setDescription('Mini Doovo API')
     .setVersion('1.0')
     .build();
     const document = SwaggerModule.createDocument(app, config);
     SwaggerModule.setup('api', app, document);
 
     app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

   app.useGlobalFilters(new AllExceptionsFilter());
    
   const port = process.env.PORT || 4000;
  await app.listen(port);
}
bootstrap();
