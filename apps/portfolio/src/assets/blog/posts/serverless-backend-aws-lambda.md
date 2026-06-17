---
title: "Building Serverless Backends with AWS Lambda and NestJS"
slug: "serverless-backend-aws-lambda"
excerpt: "How to deploy scalable serverless APIs using NestJS on AWS Lambda with Terraform infrastructure as code."
author: "Miguel"
publishedAt: "2024-10-05T10:00:00.000Z"
category: "devops"
tags: ["AWS", "Lambda", "NestJS", "Terraform", "Serverless"]
coverImage: "/assets/img/blog/serverless.jpg"
featured: false
published: true
---

# Building Serverless Backends with AWS Lambda and NestJS

Serverless architecture has transformed how we deploy and scale backend applications. In this article, I'll share how to deploy a NestJS application on AWS Lambda using Terraform for infrastructure as code.

## Why Serverless?

Serverless computing offers several advantages:

- **Cost efficiency**: Pay only for what you use
- **Auto-scaling**: Handles traffic spikes automatically
- **Reduced ops overhead**: No server management required
- **Quick deployments**: Focus on code, not infrastructure

## NestJS on Lambda

NestJS works seamlessly with AWS Lambda using the `@vendia/serverless-express` adapter.

### Project Setup

```bash
npm i @vendia/serverless-express aws-lambda
npm i -D @types/aws-lambda serverless-webpack
```

### Lambda Handler

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

## Infrastructure with Terraform

### Lambda Function

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
  
  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [aws_security_group.lambda.id]
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

resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api.invoke_arn
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}
```

## CI/CD Pipeline

We use GitHub Actions for continuous deployment:

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
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Package Lambda
        run: zip -r lambda.zip dist node_modules
        
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy Lambda
        run: |
          aws lambda update-function-code \
            --function-name my-api \
            --zip-file fileb://lambda.zip
```

## Monitoring with CloudWatch

Setting up proper monitoring is crucial:

```typescript
// Custom CloudWatch metrics
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

## Conclusion

Serverless NestJS on AWS Lambda provides a powerful, scalable architecture for modern APIs. Combined with Terraform for IaC and proper monitoring, you can build robust production systems with minimal operational overhead.
