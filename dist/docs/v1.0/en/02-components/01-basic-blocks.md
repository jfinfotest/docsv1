---
title: "Basic Blocks - FusionDoc v1.0"
description: "Essential components for structuring content including admonitions, code blocks, and tabbed content"
position: 1
category: "components"
version: "v1.0"
language: "en"
---

# Basic Blocks

These are the fundamental components for structuring your content. This guide covers the essential building blocks you'll use most frequently.

## Admonitions

Highlight key information with styled callout boxes. Use the simple admonition syntax for the most common types.

### Basic Admonitions

```markdown
:::note
This is a note admonition for general information.
:::

:::tip
This is a tip admonition for helpful suggestions.
:::

:::warning
This is a warning admonition for important cautions.
:::

:::danger
This is a danger admonition for critical warnings.
:::
```

### Admonitions with Titles

```markdown
:::note[Pro Tip]
This note has a custom title.
:::

:::warning[Security Alert]
This warning has a custom title.
:::
```

**Available types**: `note`, `tip`, `warning`, `danger`, `success`, `info`

## Code Blocks

Use standard Markdown syntax for code blocks with enhanced syntax highlighting and features.

### Basic Code Block

````markdown
```python
def hello():
    print("Hello, World!")
```
````

### Code Block with Title

````markdown
```javascript title="app.js"
function greet(name) {
    return `Hello, ${name}!`;
}
```
````

### Code Block with Line Highlighting

````markdown
```python {1,3}
def calculate(x, y):
    result = x + y  # This line won't be highlighted
    return result   # This line will be highlighted
```
````

### Code Block with Line Numbers

````markdown
```python showLineNumbers
import os
import sys

def main():
    print("Hello World")

if __name__ == "__main__":
    main()
```
````

## Tabbed Code Blocks

Display the same code in different languages or show different variations.

### Multi-Language Example

````markdown
<TabbedCodeBlock>
```python tab="Python"
def greet(name):
    return f"Hello, {name}!"
```

```javascript tab="JavaScript"
function greet(name) {
    return `Hello, ${name}!`;
}
```

```java tab="Java"
public String greet(String name) {
    return "Hello, " + name + "!";
}
```
</TabbedCodeBlock>
````

### Configuration Variations

````markdown
<TabbedCodeBlock>
```json tab="Development"
{
  "environment": "dev",
  "debug": true,
  "apiUrl": "http://localhost:3000"
}
```

```json tab="Production"
{
  "environment": "prod",
  "debug": false,
  "apiUrl": "https://api.example.com"
}
```
</TabbedCodeBlock>
````

## Inline Code

Highlight short code snippets within text.

```markdown
Use the `npm install` command to install dependencies.

The `Array.map()` method creates a new array with the results.

Call `console.log()` to output debug information.
```

## Best Practices

### Code Block Guidelines

1. **Choose appropriate languages**: Use the correct language identifier for syntax highlighting
2. **Add titles**: Include file names or descriptions when showing complete files
3. **Highlight important lines**: Use line highlighting to draw attention to key parts
4. **Keep examples concise**: Show only relevant code, not entire files when unnecessary
5. **Provide context**: Include comments or explanations for complex code

### Admonition Usage

1. **Use consistently**: Choose admonition types that match your content's tone
2. **Don't overuse**: Too many admonitions can overwhelm readers
3. **Write clear titles**: Make admonition titles descriptive and actionable
4. **Place strategically**: Position admonitions near relevant content

### Tabbed Content

1. **Logical grouping**: Only use tabs when content has clear alternatives
2. **Consistent structure**: Keep similar content in the same order across tabs
3. **Clear labels**: Use descriptive tab titles that indicate the content
4. **Avoid too many tabs**: Limit to 3-4 tabs maximum for better usability
