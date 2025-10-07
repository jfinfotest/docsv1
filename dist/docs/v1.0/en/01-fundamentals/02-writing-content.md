---
title: "Writing Content"
position: 2
---

# Complete Content Writing Guide v1.0

This platform supports [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/) and extends it with powerful custom components for creating rich, interactive documentation.

## Basic Markdown

### Text and Headings

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*.
~~Strikethrough text~~ and `inline code`.
```

### Lists

**Unordered:**
* Item 1
* Item 2
  * Nested item
* Item 3

**Ordered:**
1. First item
2. Second item
3. Third item

### Tables

| Header 1 | Header 2 | Header 3 |
| :--- | :---: | ---: |
| Left | Center | Right |
| Cell 2.1 | Cell 2.2 | Cell 2.3 |

### Blockquotes
> This is a blockquote.
>> Nested blockquote

### Math Formulas (KaTeX)

Render inline LaTeX expressions like $E=mc^2$ or in block form:
$$
\sum_{i=1}^n i = \frac{n(n+1)}{2}
$$

### Footnotes
You can add footnotes[^1] for extra information.

[^1]: Content of the footnote.

## Custom Components

This platform includes numerous custom components to enhance your documentation:

### Admonitions

Create highlighted information boxes:

```markdown
:::note[Title]
This is a note admonition.
:::

:::tip[Pro Tip]
This is a helpful tip.
:::

:::warning[Important]
This is a warning.
:::

:::danger[Critical]
This is a danger alert.
:::
```

### Code Blocks with Enhanced Features

````markdown
```javascript title="example.js" {1,3}
// This line will be highlighted
console.log('Hello World');
// This line will also be highlighted
```

```python showLineNumbers
# Line numbers will be shown
def hello():
    return "Hello"
```
````

### Interactive Components

**Accordion:**
```markdown
<Accordion title="Click to expand">
This content is hidden until clicked.
</Accordion>
```

**Tabs:**
```markdown
<TabbedCodeBlock>
```javascript tab="JavaScript"
console.log('Hello from JS');
```

```python tab="Python"
print('Hello from Python')
```
</TabbedCodeBlock>
```

**Quiz:**
```markdown
<Quiz>
{
  "question": "What is React?",
  "options": [
    "A JavaScript library for building UIs",
    "A database",
    "A CSS framework",
    "A server technology"
  ],
  "correct": 0,
  "explanation": "React is a JavaScript library for building user interfaces."
}
</Quiz>
```

### Content Organization

**Steps:**
```markdown
<Steps>
1. First step with detailed instructions
2. Second step with additional information
3. Final step to complete the process
</Steps>
```

**Timeline:**
```markdown
<Timeline>
- **2023** - Project inception and planning
- **2024** - First public release
- **2025** - Major feature updates
</Timeline>
```

**Cards:**
```markdown
<Cards>
- **Feature 1**
  Description of the first feature with details.
- **Feature 2**
  Description of the second feature with details.
</Cards>
```

### Media Components

**Video Embed:**
```markdown
<VideoEmbed src="https://www.youtube.com/watch?v=VIDEO_ID" />
```

**Image Gallery:**
```markdown
<ImageGallery>
![Description 1](image1.jpg)
![Description 2](image2.jpg)
![Description 3](image3.jpg)
</ImageGallery>
```

**Image with Lightbox:**
```markdown
![Alt text](image.jpg){lightbox=true}
```

### Data Visualization

**Charts:**
```markdown
<Charts type="bar" data='{"labels":["Jan","Feb","Mar"],"datasets":[{"data":[10,20,30]}]}' />
```

**Stat Cards:**
```markdown
<StatCards>
- **1,000+** - Active Users
- **99.9%** - Uptime
- **4.8/5** - User Rating
</StatCards>
```

### Layout Components

**Grid:**
```markdown
<Grid cols="2">
<div>Column 1 content</div>
<div>Column 2 content</div>
</Grid>
```

**Hero Section:**
```markdown
<HeroSection>
# Welcome to Our Documentation

Comprehensive guides and tutorials to get you started.

[Get Started](/start) [View Examples](/examples)
</HeroSection>
```

### Advanced Features

**API Explorer:**
```markdown
<ApiExplorer>
{
  "endpoint": "https://api.example.com/users",
  "method": "GET",
  "headers": {
    "Content-Type": "application/json"
  }
}
</ApiExplorer>
```

**Live Code Editor:**
```markdown
<LiveCodeEmbed language="javascript">
console.log('Hello World');
</LiveCodeEmbed>
```

**File Tree:**
```markdown
<FileTree>
project/
├── src/
│   ├── components/
│   └── utils/
├── public/
└── config.json
</FileTree>
```

## Frontmatter

Every documentation page can include frontmatter for metadata:

```markdown
---
title: "Page Title"
description: "Page description for SEO"
position: 1
date: "2024-01-01"
tags: ["guide", "beginner"]
---

# Your content starts here
```

### Frontmatter Options

- **`title`**: Page title (overrides H1)
- **`description`**: Meta description for SEO
- **`position`**: Ordering in navigation
- **`date`**: Publication date
- **`tags`**: Tags for categorization
- **`draft`**: Set to `true` to hide from production

## Best Practices

### 1. Component Selection
- Use admonitions for important information
- Choose appropriate component types for your content
- Consider mobile responsiveness

### 2. Content Organization
- Break long content into sections
- Use consistent heading hierarchy
- Include table of contents for long pages

### 3. Code Examples
- Provide complete, runnable examples
- Use syntax highlighting
- Include comments for complex code

### 4. Media Usage
- Optimize images for web
- Provide alt text for accessibility
- Use appropriate video hosting platforms

### 5. Interactive Elements
- Test all interactive components
- Provide fallback content
- Consider accessibility implications
