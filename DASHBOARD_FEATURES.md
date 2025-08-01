# Dashboard Card Layout System

## Features Implemented

### 🎛️ **View Modes**
The dashboard now supports 4 different view modes for integration cards:

1. **Katta (Big)** - `scale-105` with enhanced shadows
2. **Oddiy (Normal)** - Default size with subtle hover effects  
3. **Kichik (Small)** - `scale-90` with hover scaling
4. **Ro'yxat (List)** - Compact horizontal layout with borders

### 🖱️ **Drag and Drop Sorting**
- Cards can be reordered by dragging the grip handle (⋮⋮)
- **Card View**: Grip handle appears in top-right corner on hover
- **List View**: Grip handle is always visible on the left side
- Smooth animations and visual feedback during drag operations
- Toast notifications confirm successful reordering

### 💾 **Persistent Preferences**
- View mode preference saved to localStorage
- Card order automatically persisted across sessions
- Settings restored on page reload

### 🔄 **Reset Functionality**
- Reset button to restore original card order
- Includes confirmation toast notification
- Located next to view mode controls

## Technical Implementation

### Core Dependencies
- `@dnd-kit/core` - Drag and drop context and sensors
- `@dnd-kit/sortable` - Sortable list functionality
- `@dnd-kit/utilities` - CSS transform utilities

### Key Components

#### `SortableCard`
```tsx
// Wrapper component that makes cards draggable
<SortableCard id={card.id} viewMode={viewMode}>
  {card.component}
</SortableCard>
```

#### `CardWrapper` 
```tsx
// Handles view-specific styling and layout
<CardWrapper viewMode={viewMode} className={additionalClasses}>
  {children}
</CardWrapper>
```

### State Management
```tsx
const [viewMode, setViewMode] = useState<ViewMode>('normal')
const [cards, setCards] = useState<CardItem[]>(originalOrder)

// Persistence
useEffect(() => {
  localStorage.setItem('dashboard-view-mode', viewMode)
  localStorage.setItem('dashboard-card-order', JSON.stringify(cardIds))
}, [viewMode, cards])
```

### Drag and Drop Logic
```tsx
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    setCards(items => arrayMove(items, oldIndex, newIndex));
  }
}
```

## UI/UX Features

### Visual Feedback
- **Hover Effects**: Enhanced shadows and scaling
- **Drag States**: Opacity changes during drag operations
- **Smooth Transitions**: 200-300ms duration for all animations
- **Touch Support**: Works on mobile devices

### Responsive Design
- **Mobile**: Icon-only buttons with tooltips
- **Desktop**: Full text labels with icons
- **List View**: Optimized spacing for mobile screens

### Accessibility
- **Keyboard Support**: Full keyboard navigation for drag operations
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Clear focus indicators
- **Tooltips**: Descriptive tooltips for all controls

## Layout Variations

### Big Mode (`scale-105`)
- 5% larger than normal
- Enhanced shadow effects
- Extra spacing between cards (8 units)

### Small Mode (`scale-90`) 
- 10% smaller than normal
- Hover scaling to 95%
- Reduced spacing (3 units)

### List Mode
- Horizontal compact layout
- Border and background styling
- Left-aligned drag handles
- Optimized for mobile viewing

### Normal Mode
- Default card presentation
- Standard spacing (6 units)
- Subtle hover effects

## Integration Cards Supported
- ✅ FitbitCard - Dynamic API-driven data
- ✅ GitHubCard - Static props with commit/PR stats
- ✅ WakapiCard - Coding time tracking
- ✅ LeetCodeCard - Dynamic problem-solving stats

## Performance Considerations
- **Efficient Re-rendering**: Only affected cards re-render during drag operations
- **LocalStorage Throttling**: State persisted on change, not on every render
- **CSS Transforms**: Hardware-accelerated animations
- **Lazy Loading**: Cards load data independently

## Future Enhancements
- [ ] Grid layout option for wide screens
- [ ] Card filtering and search
- [ ] Custom card visibility toggles
- [ ] Export/import layout configurations
- [ ] Keyboard shortcuts for quick view switching
