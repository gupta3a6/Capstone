# Reusable Components

This directory contains reusable components that are used across all pages of the Sub4You website.

## PageBackground Component

The `PageBackground` component provides the consistent background (grey + orange blob) for all pages. **Always wrap your page content with this component.**

### Usage

```tsx
import PageBackground from './components/PageBackground'

export const MyPage = () => (
  <PageBackground>
    {/* Your page content here */}
  </PageBackground>
)
```

### Features

- Grey background (`#303133`)
- Orange gradient blob with animations at the bottom
- Consistent styling across all pages

## TopBar Component

The `TopBar` component provides a consistent top navigation bar with glass surfaces for the Sub4You brand and Login button.

### Usage

```tsx
import PageBackground from './components/PageBackground'
import TopBar from './components/TopBar'

export const MyPage = () => (
  <PageBackground>
    <TopBar />
    
    {/* Your page content */}
  </PageBackground>
)
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leftWidth` | `number \| string` | `200` | Width of the Sub4You brand glass surface |
| `leftHeight` | `number \| string` | `75` | Height of the Sub4You brand glass surface |
| `rightWidth` | `number \| string` | `200` | Width of the Login button glass surface |
| `rightHeight` | `number \| string` | `75` | Height of the Login button glass surface |

### Examples

#### Default TopBar
```tsx
<TopBar />
```

#### Custom sizes
```tsx
<TopBar 
  leftWidth={250}
  leftHeight={80}
  rightWidth={150}
  rightHeight={60}
/>
```

## Creating New Pages

When creating a new page, follow this structure:

```tsx
import PageBackground from './components/PageBackground'
import TopBar from './components/TopBar'

export const NewPage = () => (
  <PageBackground>
    <TopBar />
    
    <div className="relative z-10 min-h-screen pb-20 px-8 pt-40">
      <div className="max-w-6xl mx-auto">
        {/* Your page content */}
      </div>
    </div>
  </PageBackground>
)
```

## Notes

- Always use `PageBackground` as the outermost wrapper for your pages
- The content area should have `relative z-10` to appear above the background
- Use appropriate padding (`pt-40`, `pb-20`) to prevent content from being hidden by the fixed header
- The grey background and orange blob are provided by the `PageBackground` component automatically

