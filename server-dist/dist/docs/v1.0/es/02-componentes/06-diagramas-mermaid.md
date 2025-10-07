---
title: "Diagramas Mermaid - Ejemplos Avanzados"
position: 6
---

# Diagramas Mermaid - Ejemplos Avanzados

Mermaid es una potente herramienta para crear diagramas y gráficos a partir de texto. Aquí encontrarás ejemplos completos de diferentes tipos de diagramas.

## Características del Componente

Nuestro componente Mermaid incluye:

- **Carga dinámica**: La librería se carga solo cuando es necesaria
- **Soporte para temas**: Adaptación automática al modo oscuro/claro
- **IDs únicos**: Generación segura de identificadores para evitar conflictos
- **Manejo de errores**: Visualización clara de errores de renderizado
- **Responsive**: Adaptación automática a diferentes tamaños de pantalla

## Diagrama de Flujo (Flowchart)

Perfecto para representar procesos y flujos de trabajo.

````markdown
```mermaid
flowchart TD
    A[Inicio del Proceso] --> B{¿Datos válidos?}
    B -->|Sí| C[Procesar datos]
    B -->|No| D[Mostrar error]
    C --> E{¿Guardar en BD?}
    E -->|Sí| F[Guardar en base de datos]
    E -->|No| G[Guardar en cache]
    F --> H[Enviar notificación]
    G --> H
    D --> I[Solicitar datos nuevamente]
    I --> B
    H --> J[Fin del proceso]
    
    style A fill:#e1f5fe
    style J fill:#c8e6c9
    style D fill:#ffcdd2
```
````

**Resultado:**
```mermaid
flowchart TD
    A[Inicio del Proceso] --> B{¿Datos válidos?}
    B -->|Sí| C[Procesar datos]
    B -->|No| D[Mostrar error]
    C --> E{¿Guardar en BD?}
    E -->|Sí| F[Guardar en base de datos]
    E -->|No| G[Guardar en cache]
    F --> H[Enviar notificación]
    G --> H
    D --> I[Solicitar datos nuevamente]
    I --> B
    H --> J[Fin del proceso]
    
    style A fill:#e1f5fe
    style J fill:#c8e6c9
    style D fill:#ffcdd2
```

## Diagrama de Secuencia

Ideal para mostrar interacciones entre diferentes actores o sistemas.

````markdown
```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API Gateway
    participant S as Servicio Auth
    participant D as Base de Datos
    
    U->>F: Iniciar sesión
    F->>A: POST /auth/login
    A->>S: Validar credenciales
    S->>D: Consultar usuario
    D-->>S: Datos del usuario
    S-->>A: Token JWT
    A-->>F: Respuesta con token
    F-->>U: Redirigir a dashboard
    
    Note over U,D: Proceso de autenticación completo
    
    U->>F: Solicitar datos
    F->>A: GET /api/data (con token)
    A->>S: Validar token
    S-->>A: Token válido
    A->>D: Consultar datos
    D-->>A: Datos solicitados
    A-->>F: Respuesta con datos
    F-->>U: Mostrar datos
```
````

**Resultado:**
```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API Gateway
    participant S as Servicio Auth
    participant D as Base de Datos
    
    U->>F: Iniciar sesión
    F->>A: POST /auth/login
    A->>S: Validar credenciales
    S->>D: Consultar usuario
    D-->>S: Datos del usuario
    S-->>A: Token JWT
    A-->>F: Respuesta con token
    F-->>U: Redirigir a dashboard
    
    Note over U,D: Proceso de autenticación completo
    
    U->>F: Solicitar datos
    F->>A: GET /api/data (con token)
    A->>S: Validar token
    S-->>A: Token válido
    A->>D: Consultar datos
    D-->>A: Datos solicitados
    A-->>F: Respuesta con datos
    F-->>U: Mostrar datos
```

## Diagrama de Clases

Perfecto para documentar la arquitectura de software orientada a objetos.

````markdown
```mermaid
classDiagram
    class Usuario {
        -id: string
        -nombre: string
        -email: string
        -fechaCreacion: Date
        +login(password: string): boolean
        +actualizarPerfil(datos: Object): void
        +cambiarPassword(nueva: string): boolean
    }
    
    class Producto {
        -id: string
        -nombre: string
        -precio: number
        -stock: number
        +actualizarStock(cantidad: number): void
        +aplicarDescuento(porcentaje: number): void
        +estaDisponible(): boolean
    }
    
    class Pedido {
        -id: string
        -fecha: Date
        -estado: EstadoPedido
        -total: number
        +agregarProducto(producto: Producto, cantidad: number): void
        +calcularTotal(): number
        +procesar(): void
        +cancelar(): void
    }
    
    class EstadoPedido {
        <<enumeration>>
        PENDIENTE
        PROCESANDO
        ENVIADO
        ENTREGADO
        CANCELADO
    }
    
    Usuario ||--o{ Pedido : realiza
    Pedido }o--|| Producto : contiene
    Pedido ||--|| EstadoPedido : tiene
```
````

**Resultado:**
```mermaid
classDiagram
    class Usuario {
        -id: string
        -nombre: string
        -email: string
        -fechaCreacion: Date
        +login(password: string): boolean
        +actualizarPerfil(datos: Object): void
        +cambiarPassword(nueva: string): boolean
    }
    
    class Producto {
        -id: string
        -nombre: string
        -precio: number
        -stock: number
        +actualizarStock(cantidad: number): void
        +aplicarDescuento(porcentaje: number): void
        +estaDisponible(): boolean
    }
    
    class Pedido {
        -id: string
        -fecha: Date
        -estado: EstadoPedido
        -total: number
        +agregarProducto(producto: Producto, cantidad: number): void
        +calcularTotal(): number
        +procesar(): void
        +cancelar(): void
    }
    
    class EstadoPedido {
        <<enumeration>>
        PENDIENTE
        PROCESANDO
        ENVIADO
        ENTREGADO
        CANCELADO
    }
    
    Usuario ||--o{ Pedido : realiza
    Pedido }o--|| Producto : contiene
    Pedido ||--|| EstadoPedido : tiene
```

## Diagrama de Estados

Excelente para modelar el comportamiento de sistemas con diferentes estados.

````markdown
```mermaid
stateDiagram-v2
    [*] --> Inactivo
    
    Inactivo --> Autenticando : iniciar_sesion()
    Autenticando --> Activo : credenciales_validas
    Autenticando --> Inactivo : credenciales_invalidas
    
    Activo --> Navegando : navegar()
    Activo --> Editando : editar_documento()
    Activo --> Configurando : abrir_configuracion()
    
    Navegando --> Activo : volver_inicio()
    Navegando --> Editando : seleccionar_documento()
    
    Editando --> Guardando : guardar()
    Editando --> Activo : cancelar()
    Editando --> Editando : modificar_contenido()
    
    Guardando --> Activo : guardado_exitoso
    Guardando --> Editando : error_guardado
    
    Configurando --> Activo : aplicar_configuracion()
    Configurando --> Activo : cancelar_configuracion()
    
    Activo --> Inactivo : cerrar_sesion()
    Activo --> [*] : timeout_sesion
    
    note right of Autenticando
        Validación de credenciales
        con el servidor
    end note
    
    note left of Guardando
        Proceso de persistencia
        de datos
    end note
```
````

**Resultado:**
```mermaid
stateDiagram-v2
    [*] --> Inactivo
    
    Inactivo --> Autenticando : iniciar_sesion()
    Autenticando --> Activo : credenciales_validas
    Autenticando --> Inactivo : credenciales_invalidas
    
    Activo --> Navegando : navegar()
    Activo --> Editando : editar_documento()
    Activo --> Configurando : abrir_configuracion()
    
    Navegando --> Activo : volver_inicio()
    Navegando --> Editando : seleccionar_documento()
    
    Editando --> Guardando : guardar()
    Editando --> Activo : cancelar()
    Editando --> Editando : modificar_contenido()
    
    Guardando --> Activo : guardado_exitoso
    Guardando --> Editando : error_guardado
    
    Configurando --> Activo : aplicar_configuracion()
    Configurando --> Activo : cancelar_configuracion()
    
    Activo --> Inactivo : cerrar_sesion()
    Activo --> [*] : timeout_sesion
    
    note right of Autenticando
        Validación de credenciales
        con el servidor
    end note
    
    note left of Guardando
        Proceso de persistencia
        de datos
    end note
```

## Diagrama de Entidad-Relación (ER)

Perfecto para diseñar bases de datos y mostrar relaciones entre entidades.

````markdown
```mermaid
erDiagram
    USUARIO {
        string id PK
        string nombre
        string email UK
        string password
        datetime fecha_creacion
        boolean activo
    }
    
    CATEGORIA {
        string id PK
        string nombre
        string descripcion
        boolean activa
    }
    
    PRODUCTO {
        string id PK
        string nombre
        text descripcion
        decimal precio
        integer stock
        string categoria_id FK
        datetime fecha_creacion
    }
    
    PEDIDO {
        string id PK
        string usuario_id FK
        datetime fecha_pedido
        decimal total
        string estado
        text notas
    }
    
    DETALLE_PEDIDO {
        string id PK
        string pedido_id FK
        string producto_id FK
        integer cantidad
        decimal precio_unitario
        decimal subtotal
    }
    
    DIRECCION {
        string id PK
        string usuario_id FK
        string calle
        string ciudad
        string codigo_postal
        string pais
        boolean principal
    }
    
    USUARIO ||--o{ PEDIDO : "realiza"
    USUARIO ||--o{ DIRECCION : "tiene"
    CATEGORIA ||--o{ PRODUCTO : "contiene"
    PEDIDO ||--o{ DETALLE_PEDIDO : "incluye"
    PRODUCTO ||--o{ DETALLE_PEDIDO : "forma parte de"
```
````

**Resultado:**
```mermaid
erDiagram
    USUARIO {
        string id PK
        string nombre
        string email UK
        string password
        datetime fecha_creacion
        boolean activo
    }
    
    CATEGORIA {
        string id PK
        string nombre
        string descripcion
        boolean activa
    }
    
    PRODUCTO {
        string id PK
        string nombre
        text descripcion
        decimal precio
        integer stock
        string categoria_id FK
        datetime fecha_creacion
    }
    
    PEDIDO {
        string id PK
        string usuario_id FK
        datetime fecha_pedido
        decimal total
        string estado
        text notas
    }
    
    DETALLE_PEDIDO {
        string id PK
        string pedido_id FK
        string producto_id FK
        integer cantidad
        decimal precio_unitario
        decimal subtotal
    }
    
    DIRECCION {
        string id PK
        string usuario_id FK
        string calle
        string ciudad
        string codigo_postal
        string pais
        boolean principal
    }
    
    USUARIO ||--o{ PEDIDO : "realiza"
    USUARIO ||--o{ DIRECCION : "tiene"
    CATEGORIA ||--o{ PRODUCTO : "contiene"
    PEDIDO ||--o{ DETALLE_PEDIDO : "incluye"
    PRODUCTO ||--o{ DETALLE_PEDIDO : "forma parte de"
```

## Diagrama de Gantt

Ideal para planificación de proyectos y gestión de cronogramas.

````markdown
```mermaid
gantt
    title Cronograma de Desarrollo de Aplicación Web
    dateFormat  YYYY-MM-DD
    section Análisis
    Requerimientos           :done,    req, 2024-01-01, 2024-01-15
    Análisis técnico         :done,    analysis, 2024-01-10, 2024-01-25
    Diseño de arquitectura   :done,    arch, 2024-01-20, 2024-02-05
    
    section Diseño
    Wireframes              :done,    wireframes, 2024-01-25, 2024-02-10
    Diseño UI/UX            :active,  design, 2024-02-05, 2024-02-25
    Prototipo               :         proto, 2024-02-20, 2024-03-05
    
    section Desarrollo
    Setup del proyecto      :         setup, 2024-02-25, 2024-03-01
    Backend API             :         backend, 2024-03-01, 2024-04-15
    Frontend                :         frontend, 2024-03-15, 2024-05-01
    Integración             :         integration, 2024-04-15, 2024-05-15
    
    section Testing
    Pruebas unitarias       :         unit-tests, 2024-04-01, 2024-05-01
    Pruebas de integración  :         int-tests, 2024-05-01, 2024-05-20
    Pruebas de usuario      :         user-tests, 2024-05-15, 2024-06-01
    
    section Despliegue
    Configuración servidor  :         server-config, 2024-05-20, 2024-06-01
    Despliegue producción   :         deploy, 2024-06-01, 2024-06-05
    Monitoreo inicial       :         monitoring, 2024-06-05, 2024-06-15
```
````

**Resultado:**
```mermaid
gantt
    title Cronograma de Desarrollo de Aplicación Web
    dateFormat  YYYY-MM-DD
    section Análisis
    Requerimientos           :done,    req, 2024-01-01, 2024-01-15
    Análisis técnico         :done,    analysis, 2024-01-10, 2024-01-25
    Diseño de arquitectura   :done,    arch, 2024-01-20, 2024-02-05
    
    section Diseño
    Wireframes              :done,    wireframes, 2024-01-25, 2024-02-10
    Diseño UI/UX            :active,  design, 2024-02-05, 2024-02-25
    Prototipo               :         proto, 2024-02-20, 2024-03-05
    
    section Desarrollo
    Setup del proyecto      :         setup, 2024-02-25, 2024-03-01
    Backend API             :         backend, 2024-03-01, 2024-04-15
    Frontend                :         frontend, 2024-03-15, 2024-05-01
    Integración             :         integration, 2024-04-15, 2024-05-15
    
    section Testing
    Pruebas unitarias       :         unit-tests, 2024-04-01, 2024-05-01
    Pruebas de integración  :         int-tests, 2024-05-01, 2024-05-20
    Pruebas de usuario      :         user-tests, 2024-05-15, 2024-06-01
    
    section Despliegue
    Configuración servidor  :         server-config, 2024-05-20, 2024-06-01
    Despliegue producción   :         deploy, 2024-06-01, 2024-06-05
    Monitoreo inicial       :         monitoring, 2024-06-05, 2024-06-15
```

## Diagrama de Recorrido del Usuario (User Journey)

Perfecto para mapear la experiencia del usuario en una aplicación.

````markdown
```mermaid
journey
    title Experiencia de Compra Online
    section Descubrimiento
      Buscar producto: 5: Usuario
      Ver resultados: 4: Usuario
      Comparar opciones: 3: Usuario
    section Evaluación
      Leer reseñas: 4: Usuario
      Ver detalles: 5: Usuario
      Verificar precio: 3: Usuario
    section Compra
      Agregar al carrito: 5: Usuario
      Revisar carrito: 4: Usuario
      Proceder al pago: 3: Usuario
      Ingresar datos: 2: Usuario
      Confirmar pedido: 4: Usuario
    section Post-compra
      Recibir confirmación: 5: Usuario
      Seguir envío: 4: Usuario
      Recibir producto: 5: Usuario
      Dejar reseña: 3: Usuario
```
````

**Resultado:**
```mermaid
journey
    title Experiencia de Compra Online
    section Descubrimiento
      Buscar producto: 5: Usuario
      Ver resultados: 4: Usuario
      Comparar opciones: 3: Usuario
    section Evaluación
      Leer reseñas: 4: Usuario
      Ver detalles: 5: Usuario
      Verificar precio: 3: Usuario
    section Compra
      Agregar al carrito: 5: Usuario
      Revisar carrito: 4: Usuario
      Proceder al pago: 3: Usuario
      Ingresar datos: 2: Usuario
      Confirmar pedido: 4: Usuario
    section Post-compra
      Recibir confirmación: 5: Usuario
      Seguir envío: 4: Usuario
      Recibir producto: 5: Usuario
      Dejar reseña: 3: Usuario
```

## Consejos para Usar Mermaid

### Mejores Prácticas

1. **Mantén la simplicidad**: No sobrecargues los diagramas con demasiada información
2. **Usa colores consistentes**: Define un esquema de colores y manténlo
3. **Añade notas explicativas**: Usa `note` para aclarar conceptos complejos
4. **Organiza la información**: Agrupa elementos relacionados
5. **Prueba la legibilidad**: Asegúrate de que el diagrama sea fácil de leer

### Personalización con Estilos

Puedes personalizar la apariencia de tus diagramas:

```markdown
```mermaid
flowchart LR
    A[Inicio] --> B[Proceso]
    B --> C[Fin]
    
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef process fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class A,C startEnd
    class B process
```
```

### Mejores Prácticas

#### Para Diagramas de Flujo
- Usa formas consistentes para tipos similares de elementos
- Mantén el flujo de izquierda a derecha o de arriba hacia abajo
- Incluye puntos de decisión claros con etiquetas descriptivas

#### Para Diagramas de Secuencia
- Ordena los participantes de manera lógica
- Usa notas para aclarar comportamientos complejos
- Agrupa interacciones relacionadas

#### Para Diagramas de Clases
- Mantén las clases relacionadas cerca unas de otras
- Usa herencia y composición de manera clara
- Incluye solo los métodos y propiedades más importantes

#### Consejos Generales
- Evita diagramas demasiado complejos; divídelos en partes más pequeñas
- Usa colores de manera consistente para categorizar elementos
- Prueba tus diagramas en diferentes tamaños de pantalla
- Actualiza los diagramas cuando cambies el código

### Solución de Problemas

#### Error de Selector CSS
Si ves errores relacionados con selectores CSS inválidos, el componente ahora genera automáticamente IDs únicos y válidos.

#### Problemas de Renderizado
- Verifica la sintaxis de Mermaid en el [editor online](https://mermaid.live/)
- Asegúrate de que no hay caracteres especiales no escapados
- Revisa que las llaves y paréntesis estén balanceados

### Recursos Adicionales

- [Documentación oficial de Mermaid](https://mermaid-js.github.io/mermaid/)
- [Editor online de Mermaid](https://mermaid.live/)
- [Galería de ejemplos](https://mermaid-js.github.io/mermaid/#/examples)
- [Guía de sintaxis completa](https://mermaid-js.github.io/mermaid/#/flowchart)