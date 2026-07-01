---
slug: serverless-backend-aws-lambda
lang: es
title: "Construyendo Backends Serverless con AWS Lambda y NestJS"
excerpt: "Cómo desplegar APIs serverless escalables usando NestJS en AWS Lambda con Terraform como infraestructura como código."
author: Miguel
publishedAt: 2024-10-05
category: devops
tags: [AWS, Lambda, NestJS, Terraform, Serverless]
coverImage: /assets/img/blog/serverless.jpg
featured: false
published: true
---

# Construyendo Backends Serverless con AWS Lambda y NestJS

La arquitectura serverless ha transformado cómo desplegamos y escalamos aplicaciones backend. En este artículo comparto cómo desplegar una aplicación NestJS en AWS Lambda usando Terraform como infraestructura como código.

## ¿Por qué Serverless?

El cómputo serverless ofrece varias ventajas:

- **Eficiencia en costos**: Pagas solo por lo que usas
- **Auto-escalado**: Maneja picos de tráfico automáticamente
- **Menos overhead operacional**: Sin gestión de servidores
- **Despliegues rápidos**: Enfócate en el código, no la infraestructura

## NestJS en Lambda

NestJS funciona perfectamente con AWS Lambda usando el adaptador `@vendia/serverless-express`.

### Configuración del Proyecto

```bash
npm i @vendia/serverless-express aws-lambda
npm i -D @types/aws-lambda serverless-webpack
```

### Handler de Lambda

```typescript
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Handler, Context, Callback } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import express from 'express';
import { AppModule } from './app.module';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  
  nestApp.enableCors();
  await nestApp.init();
  
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
```

## Infraestructura con Terraform

### Función Lambda

```hcl
resource "aws_lambda_function" "api" {
  filename         = "${path.module}/lambda.zip"
  function_name    = "${var.project_name}-api"
  role            = aws_iam_role.lambda_role.arn
  handler         = "dist/lambda.handler"
  runtime         = "nodejs18.x"
  memory_size     = 512
  timeout         = 30
  
  environment {
    variables = {
      NODE_ENV     = var.environment
      DATABASE_URL = var.database_url
    }
  }
}
```

### API Gateway

```hcl
resource "aws_apigatewayv2_api" "api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_origins = var.allowed_origins
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
  }
}
```

## Pipeline CI/CD

Usamos GitHub Actions para el despliegue continuo:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Instalar dependencias
        run: npm ci
      - name: Build
        run: npm run build
      - name: Empaquetar Lambda
        run: zip -r lambda.zip dist node_modules
      - name: Desplegar Lambda
        run: |
          aws lambda update-function-code \
            --function-name my-api \
            --zip-file fileb://lambda.zip
```

## Monitoreo con CloudWatch

Configurar un monitoreo adecuado es fundamental:

```typescript
import { CloudWatch } from 'aws-sdk';

const cloudwatch = new CloudWatch();

export async function recordMetric(
  metricName: string,
  value: number,
  unit: string = 'Count'
) {
  await cloudwatch.putMetricData({
    Namespace: 'MyApp',
    MetricData: [{
      MetricName: metricName,
      Value: value,
      Unit: unit,
      Timestamp: new Date()
    }]
  }).promise();
}
```

## Conclusión

NestJS serverless en AWS Lambda provee una arquitectura poderosa y escalable para APIs modernas. Combinado con Terraform para IaC y monitoreo adecuado, puedes construir sistemas robustos en producción con un mínimo overhead operacional.
