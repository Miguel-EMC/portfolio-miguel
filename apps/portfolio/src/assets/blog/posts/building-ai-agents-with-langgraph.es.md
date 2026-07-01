---
slug: building-ai-agents-with-langgraph
lang: es
title: "Construyendo Agentes de IA con LangGraph y AWS Bedrock"
excerpt: "Un análisis profundo sobre cómo crear agentes Text-to-SQL inteligentes usando la orquestación de LangGraph y los modelos fundacionales de AWS Bedrock."
author: Miguel
publishedAt: 2024-12-15
category: technology
tags: [AI, LangGraph, AWS, Python, LLM]
coverImage: /assets/img/blog/ai-agents.jpg
featured: true
published: true
---

# Construyendo Agentes de IA con LangGraph y AWS Bedrock

En el dinámico panorama del desarrollo de IA, construir agentes inteligentes capaces de interactuar con bases de datos mediante lenguaje natural se ha vuelto cada vez más importante. En este artículo comparto mi experiencia construyendo un agente Text-to-SQL usando LangGraph para la orquestación y AWS Bedrock para los modelos fundacionales.

## La Arquitectura

El sistema consta de varios componentes clave:

1. **Máquina de estados LangGraph**: Orquesta el flujo de la conversación
2. **AWS Bedrock**: Proporciona acceso a Claude y otros modelos fundacionales
3. **Backend FastAPI**: Expone el agente mediante una REST API
4. **Frontend React**: Interfaz de usuario para consultas en lenguaje natural

## Configurando LangGraph

LangGraph ofrece una forma poderosa de definir flujos de trabajo de agentes complejos como grafos. Aquí la configuración básica:

```python
from langgraph.graph import Graph, END
from langchain_aws import ChatBedrock

# Inicializar cliente Bedrock
llm = ChatBedrock(
    model_id="anthropic.claude-3-sonnet-20240229-v1:0",
    region_name="us-east-1"
)

# Definir el grafo
workflow = Graph()

# Agregar nodos
workflow.add_node("understand_query", understand_query)
workflow.add_node("generate_sql", generate_sql)
workflow.add_node("execute_query", execute_query)
workflow.add_node("format_response", format_response)
```

## Comprendiendo la Intención del Usuario

El primer paso en nuestro pipeline es entender qué está preguntando el usuario. Esto implica:

- Extraer entidades (nombres de tablas, columnas, condiciones)
- Identificar el tipo de consulta (SELECT, agregado, join)
- Manejar peticiones ambiguas

```python
def understand_query(state):
    prompt = f"""
    Analiza esta consulta en lenguaje natural y extrae:
    1. Las tablas involucradas
    2. Las columnas necesarias
    3. Filtros o condiciones
    4. El tipo de agregación (si aplica)
    
    Consulta: {state["user_query"]}
    """
    
    response = llm.invoke(prompt)
    return {"intent": response.content}
```

## Generando SQL Seguro

La seguridad es fundamental cuando se genera SQL a partir de entrada del usuario. Implementamos varias salvaguardas:

- **Validación de esquema**: Solo permitir consultas sobre tablas conocidas
- **Sanitización de consultas**: Prevenir intentos de inyección SQL
- **Modo solo lectura**: Restringir a sentencias SELECT únicamente

## Resultados y Aprendizajes

Tras implementar el sistema, logramos:

| Métrica | Resultado |
|---------|-----------|
| Precisión en consultas estándar | 95% |
| Tiempo promedio de respuesta | < 1 segundo |
| Reducción de carga manual de analistas | ~70% |

## Conclusión

Construir agentes de IA con LangGraph y AWS Bedrock proporciona una solución poderosa y escalable para interacciones con bases de datos en lenguaje natural. La clave es combinar una orquestación robusta con medidas de seguridad sólidas.

Si tienes interés en implementar algo similar, no dudes en contactarme. Con gusto discuto la arquitectura con más detalle.
