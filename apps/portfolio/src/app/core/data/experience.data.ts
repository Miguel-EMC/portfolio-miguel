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
      'Lideré el desarrollo integral de un Agente de IA (Text-to-SQL) utilizando LangGraph y AWS Bedrock, integrando un ecosistema técnico con FastAPI y React',
      'Desarrollé íntegramente el aplicativo móvil para Android e iOS utilizando Flutter, liderando su arquitectura y el ciclo completo de publicación en Play Store y App Store',
      'Participé en el desarrollo y mantenimiento del backend serverless (AWS Lambdas, NestJS, Prisma) que sirve a la app móvil en Flutter y web en Angular',
      'Participé activamente en el desarrollo frontend e integración de APIs en la plataforma web mediante Angular',
      'Contribuí al despliegue de infraestructura mediante Terraform (Lambdas, S3) e implementé procesos de CI/CD y monitoreo con CloudWatch y Google Cloud'
    ]
  },
  {
    id: 'billusos-dev',
    location: 'Remoto',
    tasks: [
      'Desarrollé y optimicé servicios de backend para la generación de reportes y dashboards financieros utilizando Python y Django',
      'Desarrollé y mantuve funcionalidades en el aplicativo móvil utilizando React Native, asegurando una integración fluida con los servicios del servidor',
      'Gestioné la persistencia de datos y la optimización de la lógica de negocio sobre PostgreSQL'
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