export interface Experience {
  id: string;
  location: string;
  tasks: string[];
}

export const experiences: Experience[] = [
  {
    id: 'fullstack-lateral',
    location: 'Quito, Ecuador (Híbrido)',
    tasks: [
      'Diseñé y construí la primera versión en producción de un agente de IA Text-to-SQL basado en grafos usando LangGraph y AWS Bedrock, integrado con un backend FastAPI, automatizando gran parte de la creación manual de consultas SQL.',
      'Desarrollé servicios backend serverless en AWS Lambda que orquestan APIs de proveedores LLM (AWS Bedrock, OpenAI, Gemini) y los exponen mediante REST APIs consumidas por las aplicaciones web (Angular) y móvil (Flutter).',
      'Construí y mantuve servicios backend serverless con AWS Lambda y Step Functions usando NestJS y Prisma ORM, sirviendo tanto a la aplicación móvil como a la plataforma web.',
      'Desarrollé y publiqué una aplicación móvil multiplataforma con Flutter para Android e iOS, gestionando el ciclo completo de publicación en Google Play Store y Apple App Store.',
      'Desplegué infraestructura en la nube con Terraform (Lambda, S3, Step Functions) e implementé pipelines de CI/CD con monitoreo en Amazon CloudWatch y Google Cloud Platform.'
    ]
  },
  {
    id: 'billusos-dev',
    location: 'Remoto',
    tasks: [
      'Desarrollé y optimicé servicios backend en Python y Django para la generación automatizada de reportes financieros y dashboards operacionales, eliminando procesos manuales.',
      'Construí y mantuve funcionalidades en la aplicación móvil con React Native, asegurando integración fluida con los endpoints REST y la lógica de negocio del servidor.',
      'Gestioné la capa de persistencia de datos y optimicé consultas PostgreSQL complejas para reportería de inteligencia de negocio, mejorando tiempos de respuesta de los dashboards.'
    ]
  },
  {
    id: 'junior-fullstack',
    location: 'Quito, Ecuador',
    tasks: [
      'Desarrollé reportes dinámicos y dashboards interactivos mediante consultas optimizadas a la base de datos PostgreSQL para la plataforma CONAFIPS SARAS',
      'Implementé funcionalidades tanto en Backend (Laravel/Lumen) como en Frontend (Angular), asegurando la visualización correcta de métricas clave',
      'Participé en la integración de flujos de datos para el cumplimiento de lógica de negocio financiera'
    ]
  }
];