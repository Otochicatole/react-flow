# React Flow Diagrammer

Aplicación para crear diagramas de flujo complejos con procesos anidados y nodos personalizados.

## Características

- **Diagramas Complejos**: Crea diagramas con múltiples tipos de nodos y conexiones.
- **Procesos Anidados**: Organiza flujos complejos en subprocesos navegables.
- **Nodos Personalizados**: Crea y reutiliza nodos personalizados.
- **Flujos Separados**: Maneja flujos de datos y ejecución por separado.
- **Persistencia Local**: Guarda proyectos en localStorage.
- **Import/Export**: Comparte proyectos como archivos JSON.

## Tecnologías

- **React + Next.js**: Framework base
- **React Flow**: Motor de diagramas
- **TypeScript**: Tipado estático
- **CSS Modules**: Estilos modulares

## Estructura del Proyecto

```
src/
├── app/                 # Páginas y rutas
├── components/         # Componentes React
│   ├── common/        # Componentes genéricos
│   ├── layout/        # Componentes de layout
│   └── styles/        # Estilos CSS
├── config/            # Configuración de React Flow
├── constants/         # Constantes y configuración
├── context/          # Estado global
├── hooks/            # Hooks personalizados
├── services/         # Servicios y APIs
├── types/            # TypeScript types
└── utils/            # Utilidades
```

## Componentes Principales

### Layout

- `project-header.tsx`: Barra superior con controles
- `process-breadcrumbs.tsx`: Navegación entre procesos
- `aside.tsx`: Panel lateral con biblioteca de nodos

### Nodos

- `custom-node.tsx`: Nodo personalizable
- `process-node.tsx`: Nodo de proceso anidado
- `node-types.tsx`: Tipos de nodos predefinidos

### Modales

- `create-custom-node-modal.tsx`: Crear nodo personalizado
- `delete-custom-node-modal.tsx`: Eliminar nodo personalizado
- `custom-node-usage-modal.tsx`: Ver uso de nodo personalizado

## Tipos de Nodos

### Event-Driven
- Event: Eventos del dominio
- Command: Acciones a ejecutar
- Query: Consultas de datos
- Aggregate: Lógica de negocio
- Service: Servicios de aplicación
- Message Bus: Infraestructura de comunicación
- Process: Contenedor de subprocesos

### Flowchart
- Start: Inicio de flujo
- End: Fin de flujo
- Decision: Punto de decisión
- Input/Output: Entrada/salida de datos
- Document: Generación de documentos
- Database: Almacenamiento de datos
- Connector: Punto de unión
- Text Input: Campo de texto

### Logic Gates
- AND Gate: Operación AND
- OR Gate: Operación OR
- XOR Gate: Operación XOR
- NOT Gate: Operación NOT

### Project Management
- Task: Tarea con progreso
- Milestone: Hito importante

## Flujos y Conexiones

### Flujo de Datos
- Conexiones cuadradas simétricas
- Color azul (#3b82f6)
- Solo conecta puntos de datos

### Flujo de Ejecución
- Conexiones curvas con animación
- Color naranja (#d97706)
- Solo conecta puntos de ejecución
- Toggle para mostrar/ocultar

## Estado Global

### ProjectState
- Lista de proyectos
- Proyecto actual
- Ruta de proceso
- Historial (undo/redo)
- Nodos personalizados
- Toggle de flujo de ejecución

### Persistencia
- localStorage para proyectos
- localStorage para nodos personalizados
- Import/Export de proyectos

## Utilidades

### Flow Helpers
- Navegación de procesos
- Generación de breadcrumbs
- Validación de rutas

### Storage Helpers
- Operaciones de localStorage
- Import/Export de archivos
- Manejo de errores

### Validation
- Type guards
- Validación de datos
- Sanitización de nombres

## Desarrollo

### Setup
```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Construir para producción
npm run build
```

### Agregar Funcionalidades

1. **Nuevo Tipo de Nodo**
   - Agregar tipo en `types/node.ts`
   - Crear componente en `components/common/node-types.tsx`
   - Agregar a categoría en `constants/node-categories.tsx`

2. **Nueva Categoría**
   - Agregar categoría en `constants/node-categories.tsx`
   - Definir ícono y descripción
   - Agregar nodos relacionados

3. **Nuevo Tipo de Flujo**
   - Agregar handles en componentes de nodo
   - Definir estilos en `styles/react-flow-overrides.css`
   - Actualizar validación en `useCanvas.ts`

## Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing`)
5. Abre un Pull Request

## Licencia

MIT