---
title: "Mermaid Diagrams - Advanced Examples"
position: 6
---

# Mermaid Diagrams - Advanced Examples

Mermaid is a powerful tool for creating diagrams and charts from text. Here you'll find comprehensive examples of different diagram types.

## Component Features

Our Mermaid component includes:

- **Dynamic loading**: Library loads only when needed
- **Theme support**: Automatic adaptation to dark/light mode
- **Unique IDs**: Safe identifier generation to avoid conflicts
- **Error handling**: Clear visualization of rendering errors
- **Responsive**: Automatic adaptation to different screen sizes

## Flowchart

Perfect for representing processes and workflows.

````markdown
```mermaid
flowchart TD
    A[Start Process] --> B{Valid Data?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Show Error]
    C --> E{Save to DB?}
    E -->|Yes| F[Save to Database]
    E -->|No| G[Save to Cache]
    F --> H[Send Notification]
    G --> H
    D --> I[Request New Data]
    I --> B
    H --> J[End Process]
    
    style A fill:#e1f5fe
    style J fill:#c8e6c9
    style D fill:#ffcdd2
```
````

**Result:**
```mermaid
flowchart TD
    A[Start Process] --> B{Valid Data?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Show Error]
    C --> E{Save to DB?}
    E -->|Yes| F[Save to Database]
    E -->|No| G[Save to Cache]
    F --> H[Send Notification]
    G --> H
    D --> I[Request New Data]
    I --> B
    H --> J[End Process]
    
    style A fill:#e1f5fe
    style J fill:#c8e6c9
    style D fill:#ffcdd2
```

## Sequence Diagram

Ideal for showing interactions between different actors or systems.

````markdown
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Gateway
    participant S as Auth Service
    participant D as Database
    
    U->>F: Login
    F->>A: POST /auth/login
    A->>S: Validate credentials
    S->>D: Query user
    D-->>S: User data
    S-->>A: JWT Token
    A-->>F: Response with token
    F-->>U: Redirect to dashboard
    
    Note over U,D: Complete authentication process
    
    U->>F: Request data
    F->>A: GET /api/data (with token)
    A->>S: Validate token
    S-->>A: Token valid
    A->>D: Query data
    D-->>A: Requested data
    A-->>F: Response with data
    F-->>U: Display data
```
````

**Result:**
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Gateway
    participant S as Auth Service
    participant D as Database
    
    U->>F: Login
    F->>A: POST /auth/login
    A->>S: Validate credentials
    S->>D: Query user
    D-->>S: User data
    S-->>A: JWT Token
    A-->>F: Response with token
    F-->>U: Redirect to dashboard
    
    Note over U,D: Complete authentication process
    
    U->>F: Request data
    F->>A: GET /api/data (with token)
    A->>S: Validate token
    S-->>A: Token valid
    A->>D: Query data
    D-->>A: Requested data
    A-->>F: Response with data
    F-->>U: Display data
```

## Class Diagram

Perfect for documenting object-oriented software architecture.

````markdown
```mermaid
classDiagram
    class User {
        -id: string
        -name: string
        -email: string
        -createdAt: Date
        +login(password: string): boolean
        +updateProfile(data: Object): void
        +changePassword(newPassword: string): boolean
    }
    
    class Product {
        -id: string
        -name: string
        -price: number
        -stock: number
        +updateStock(quantity: number): void
        +applyDiscount(percentage: number): void
        +isAvailable(): boolean
    }
    
    class Order {
        -id: string
        -date: Date
        -status: OrderStatus
        -total: number
        +addProduct(product: Product, quantity: number): void
        +calculateTotal(): number
        +process(): void
        +cancel(): void
    }
    
    class OrderStatus {
        <<enumeration>>
        PENDING
        PROCESSING
        SHIPPED
        DELIVERED
        CANCELLED
    }
    
    User ||--o{ Order : places
    Order }o--|| Product : contains
    Order ||--|| OrderStatus : has
```
````

**Result:**
```mermaid
classDiagram
    class User {
        -id: string
        -name: string
        -email: string
        -createdAt: Date
        +login(password: string): boolean
        +updateProfile(data: Object): void
        +changePassword(newPassword: string): boolean
    }
    
    class Product {
        -id: string
        -name: string
        -price: number
        -stock: number
        +updateStock(quantity: number): void
        +applyDiscount(percentage: number): void
        +isAvailable(): boolean
    }
    
    class Order {
        -id: string
        -date: Date
        -status: OrderStatus
        -total: number
        +addProduct(product: Product, quantity: number): void
        +calculateTotal(): number
        +process(): void
        +cancel(): void
    }
    
    class OrderStatus {
        <<enumeration>>
        PENDING
        PROCESSING
        SHIPPED
        DELIVERED
        CANCELLED
    }
    
    User ||--o{ Order : places
    Order }o--|| Product : contains
    Order ||--|| OrderStatus : has
```

## State Diagram

Excellent for modeling system behavior with different states.

````markdown
```mermaid
stateDiagram-v2
    [*] --> Inactive
    
    Inactive --> Authenticating : start_session()
    Authenticating --> Active : valid_credentials
    Authenticating --> Inactive : invalid_credentials
    
    Active --> Browsing : navigate()
    Active --> Editing : edit_document()
    Active --> Configuring : open_settings()
    
    Browsing --> Active : go_home()
    Browsing --> Editing : select_document()
    
    Editing --> Saving : save()
    Editing --> Active : cancel()
    Editing --> Editing : modify_content()
    
    Saving --> Active : save_successful
    Saving --> Editing : save_error
    
    Configuring --> Active : apply_settings()
    Configuring --> Active : cancel_settings()
    
    Active --> Inactive : logout()
    Active --> [*] : session_timeout
    
    note right of Authenticating
        Credential validation
        with server
    end note
    
    note left of Saving
        Data persistence
        process
    end note
```
````

**Result:**
```mermaid
stateDiagram-v2
    [*] --> Inactive
    
    Inactive --> Authenticating : start_session()
    Authenticating --> Active : valid_credentials
    Authenticating --> Inactive : invalid_credentials
    
    Active --> Browsing : navigate()
    Active --> Editing : edit_document()
    Active --> Configuring : open_settings()
    
    Browsing --> Active : go_home()
    Browsing --> Editing : select_document()
    
    Editing --> Saving : save()
    Editing --> Active : cancel()
    Editing --> Editing : modify_content()
    
    Saving --> Active : save_successful
    Saving --> Editing : save_error
    
    Configuring --> Active : apply_settings()
    Configuring --> Active : cancel_settings()
    
    Active --> Inactive : logout()
    Active --> [*] : session_timeout
    
    note right of Authenticating
        Credential validation
        with server
    end note
    
    note left of Saving
        Data persistence
        process
    end note
```

## Entity Relationship Diagram (ER)

Perfect for designing databases and showing relationships between entities.

````markdown
```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email UK
        string password
        datetime created_at
        boolean active
    }
    
    CATEGORY {
        string id PK
        string name
        string description
        boolean active
    }
    
    PRODUCT {
        string id PK
        string name
        text description
        decimal price
        integer stock
        string category_id FK
        datetime created_at
    }
    
    ORDER {
        string id PK
        string user_id FK
        datetime order_date
        decimal total
        string status
        text notes
    }
    
    ORDER_DETAIL {
        string id PK
        string order_id FK
        string product_id FK
        integer quantity
        decimal unit_price
        decimal subtotal
    }
    
    ADDRESS {
        string id PK
        string user_id FK
        string street
        string city
        string postal_code
        string country
        boolean primary
    }
    
    USER ||--o{ ORDER : "places"
    USER ||--o{ ADDRESS : "has"
    CATEGORY ||--o{ PRODUCT : "contains"
    ORDER ||--o{ ORDER_DETAIL : "includes"
    PRODUCT ||--o{ ORDER_DETAIL : "part of"
```
````

**Result:**
```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email UK
        string password
        datetime created_at
        boolean active
    }
    
    CATEGORY {
        string id PK
        string name
        string description
        boolean active
    }
    
    PRODUCT {
        string id PK
        string name
        text description
        decimal price
        integer stock
        string category_id FK
        datetime created_at
    }
    
    ORDER {
        string id PK
        string user_id FK
        datetime order_date
        decimal total
        string status
        text notes
    }
    
    ORDER_DETAIL {
        string id PK
        string order_id FK
        string product_id FK
        integer quantity
        decimal unit_price
        decimal subtotal
    }
    
    ADDRESS {
        string id PK
        string user_id FK
        string street
        string city
        string postal_code
        string country
        boolean primary
    }
    
    USER ||--o{ ORDER : "places"
    USER ||--o{ ADDRESS : "has"
    CATEGORY ||--o{ PRODUCT : "contains"
    ORDER ||--o{ ORDER_DETAIL : "includes"
    PRODUCT ||--o{ ORDER_DETAIL : "part of"
```

## Gantt Chart

Ideal for project planning and schedule management.

````markdown
```mermaid
gantt
    title Web Application Development Timeline
    dateFormat  YYYY-MM-DD
    section Analysis
    Requirements           :done,    req, 2024-01-01, 2024-01-15
    Technical analysis     :done,    analysis, 2024-01-10, 2024-01-25
    Architecture design    :done,    arch, 2024-01-20, 2024-02-05
    
    section Design
    Wireframes            :done,    wireframes, 2024-01-25, 2024-02-10
    UI/UX Design          :active,  design, 2024-02-05, 2024-02-25
    Prototype             :         proto, 2024-02-20, 2024-03-05
    
    section Development
    Project setup         :         setup, 2024-02-25, 2024-03-01
    Backend API           :         backend, 2024-03-01, 2024-04-15
    Frontend              :         frontend, 2024-03-15, 2024-05-01
    Integration           :         integration, 2024-04-15, 2024-05-15
    
    section Testing
    Unit tests            :         unit-tests, 2024-04-01, 2024-05-01
    Integration tests     :         int-tests, 2024-05-01, 2024-05-20
    User acceptance tests :         user-tests, 2024-05-15, 2024-06-01
    
    section Deployment
    Server configuration  :         server-config, 2024-05-20, 2024-06-01
    Production deployment :         deploy, 2024-06-01, 2024-06-05
    Initial monitoring    :         monitoring, 2024-06-05, 2024-06-15
```
````

**Result:**
```mermaid
gantt
    title Web Application Development Timeline
    dateFormat  YYYY-MM-DD
    section Analysis
    Requirements           :done,    req, 2024-01-01, 2024-01-15
    Technical analysis     :done,    analysis, 2024-01-10, 2024-01-25
    Architecture design    :done,    arch, 2024-01-20, 2024-02-05
    
    section Design
    Wireframes            :done,    wireframes, 2024-01-25, 2024-02-10
    UI/UX Design          :active,  design, 2024-02-05, 2024-02-25
    Prototype             :         proto, 2024-02-20, 2024-03-05
    
    section Development
    Project setup         :         setup, 2024-02-25, 2024-03-01
    Backend API           :         backend, 2024-03-01, 2024-04-15
    Frontend              :         frontend, 2024-03-15, 2024-05-01
    Integration           :         integration, 2024-04-15, 2024-05-15
    
    section Testing
    Unit tests            :         unit-tests, 2024-04-01, 2024-05-01
    Integration tests     :         int-tests, 2024-05-01, 2024-05-20
    User acceptance tests :         user-tests, 2024-05-15, 2024-06-01
    
    section Deployment
    Server configuration  :         server-config, 2024-05-20, 2024-06-01
    Production deployment :         deploy, 2024-06-01, 2024-06-05
    Initial monitoring    :         monitoring, 2024-06-05, 2024-06-15
```

## User Journey Diagram

Perfect for mapping user experience in an application.

````markdown
```mermaid
journey
    title Online Shopping Experience
    section Discovery
      Search product: 5: User
      View results: 4: User
      Compare options: 3: User
    section Evaluation
      Read reviews: 4: User
      View details: 5: User
      Check price: 3: User
    section Purchase
      Add to cart: 5: User
      Review cart: 4: User
      Proceed to checkout: 3: User
      Enter details: 2: User
      Confirm order: 4: User
    section Post-purchase
      Receive confirmation: 5: User
      Track shipment: 4: User
      Receive product: 5: User
      Leave review: 3: User
```
````

**Result:**
```mermaid
journey
    title Online Shopping Experience
    section Discovery
      Search product: 5: User
      View results: 4: User
      Compare options: 3: User
    section Evaluation
      Read reviews: 4: User
      View details: 5: User
      Check price: 3: User
    section Purchase
      Add to cart: 5: User
      Review cart: 4: User
      Proceed to checkout: 3: User
      Enter details: 2: User
      Confirm order: 4: User
    section Post-purchase
      Receive confirmation: 5: User
      Track shipment: 4: User
      Receive product: 5: User
      Leave review: 3: User
```

## Tips for Using Mermaid

### Best Practices

1. **Keep it simple**: Don't overload diagrams with too much information
2. **Use consistent colors**: Define a color scheme and stick to it
3. **Add explanatory notes**: Use `note` to clarify complex concepts
4. **Organize information**: Group related elements together
5. **Test readability**: Ensure the diagram is easy to read

### Customization with Styles

You can customize the appearance of your diagrams:

```markdown
```mermaid
flowchart LR
    A[Start] --> B[Process]
    B --> C[End]
    
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef process fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class A,C startEnd
    class B process
```
```

### Best Practices

#### For Flowcharts
- Use consistent shapes for similar types of elements
- Maintain left-to-right or top-to-bottom flow
- Include clear decision points with descriptive labels

#### For Sequence Diagrams
- Order participants logically
- Use notes to clarify complex behaviors
- Group related interactions together

#### For Class Diagrams
- Keep related classes close to each other
- Use inheritance and composition clearly
- Include only the most important methods and properties

#### General Tips
- Avoid overly complex diagrams; break them into smaller parts
- Use colors consistently to categorize elements
- Test your diagrams on different screen sizes
- Update diagrams when you change the code

### Troubleshooting

#### CSS Selector Error
If you see errors related to invalid CSS selectors, the component now automatically generates unique and valid IDs.

#### Rendering Issues
- Verify Mermaid syntax in the [online editor](https://mermaid.live/)
- Ensure there are no unescaped special characters
- Check that braces and parentheses are balanced

### Additional Resources

- [Official Mermaid Documentation](https://mermaid-js.github.io/mermaid/)
- [Mermaid Live Editor](https://mermaid.live/)
- [Example Gallery](https://mermaid-js.github.io/mermaid/#/examples)
- [Complete Syntax Guide](https://mermaid-js.github.io/mermaid/#/flowchart)