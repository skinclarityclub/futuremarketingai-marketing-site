# Mobile Touch Interactions Guide

## ✅ Implemented in Task 10.3

### **1. Touch-Friendly CSS Utilities** (`src/index.css`)

#### **Tap Target Sizes** (iOS/Material Guidelines)

```css
.tap-target        /* 44px minimum - iOS/Material Design guideline */
.tap-target-sm     /* 36px - For secondary elements */
```

#### **Touch Feedback**

```css
.touch-active      /* Scale down on tap (0.97) */
.touch-bounce      /* Bounce animation on tap */
.touch-feedback    /* Background highlight on tap */
```

#### **Touch Utilities**

```css
.no-select         /* Prevents text selection + removes tap highlight */
.touch-spacing     /* 12px safe spacing between tap targets */
```

#### **Swipe Indicators**

```css
.swipe-indicator   /* Mobile-only drag handle for modals (auto-hidden on desktop) */
```

---

## **2. Modal Component** (`src/components/common/Modal.tsx`)

### **Mobile Features:**

✅ **Swipe-to-Close**

- Drag modal down to close (150px threshold or 500px/s velocity)
- Smooth opacity fade during drag
- Elastic snap-back if not dragged enough

✅ **Visual Indicators**

- Swipe indicator bar at top (mobile only)
- Touch-friendly close button (44px tap target)

✅ **Responsive**

- Padding: `p-6 sm:p-8` (smaller on mobile)
- Title: `text-2xl sm:text-3xl`
- Close icon: `w-6 h-6 sm:w-7 sm:h-7`

### **Usage:**

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="My Modal">
  {/* Content */}
</Modal>
```

- On mobile: Swipe down to close
- On desktop: Click X or ESC key

---

## **3. Button Component** (`src/components/common/Button.tsx`)

### **Touch Enhancements:**

✅ **Tap Targets**

- Small: `tap-target-sm` (36px minimum)
- Medium: `tap-target` (44px minimum)
- Large: `tap-target` (44px+ with padding)

✅ **Touch Feedback**

- `touch-active` - Scale down to 0.97 on tap
- `no-select` - Prevents accidental text selection

### **Usage:**

```tsx
<Button size="md" variant="primary">
  Click Me
</Button>
```

- Automatically touch-friendly
- No special props needed

---

## **4. IndustrySelector** (`src/components/common/IndustrySelector.tsx`)

### **Mobile Optimizations:**

✅ **Touch-Friendly Cards**

- Minimum height: 120px
- `touch-active` for tap feedback
- `no-select` to prevent text selection
- `whileTap={{ scale: 0.98 }}` for Framer Motion feedback

✅ **Conditional Animations**

- Hover animations disabled on mobile (`useIsMobile` hook)
- Faster animation duration on mobile (0.2s vs 0.3s)

---

## **Best Practices for Touch Interactions**

### **1. Minimum Tap Target Size**

```tsx
// ✅ DO: 44px minimum for primary actions
<button className="tap-target">Click</button>

// ⚠️ CAUTION: 36px for secondary/less critical actions
<button className="tap-target-sm">Optional</button>

// ❌ DON'T: Smaller than 36px
<button className="w-8 h-8">Bad</button>
```

### **2. Spacing Between Tap Targets**

```tsx
// ✅ DO: Minimum 12px spacing
<div className="touch-spacing">
  <button>Button 1</button>
  <button>Button 2</button>
</div>

// ❌ DON'T: Adjacent touch targets
<div className="flex gap-1">
  <button>Too Close</button>
  <button>Too Close</button>
</div>
```

### **3. Visual Feedback**

```tsx
// ✅ DO: Provide immediate tap feedback
<button className="touch-active">Tap Me</button>

// ❌ DON'T: Rely only on hover states
<button className="hover:bg-blue-500">Desktop Only</button>
```

### **4. Disable Hover on Touch Devices**

```css
@media (hover: none) and (pointer: coarse) {
  /* Remove hover effects */
  .hover\:scale-105:hover {
    transform: none;
  }
}
```

### **5. Prevent Text Selection**

```tsx
// ✅ DO: Use no-select on interactive elements
<div className="no-select cursor-pointer">Clickable, not selectable</div>
```

---

## **Touch Gesture Patterns**

### **Swipe to Close (Modals)**

```tsx
// Implemented in Modal component
drag={isMobile ? "y" : false}
dragConstraints={{ top: 0, bottom: 300 }}
onDragEnd={handleDragEnd}
```

**Threshold:**

- Distance: 150px
- Velocity: 500px/s

### **Tap Feedback (All Buttons)**

```tsx
// Framer Motion
whileTap={{ scale: 0.98 }}

// CSS
.touch-active:active {
  transform: scale(0.97);
}
```

---

## **Testing Touch Interactions**

### **Chrome DevTools**

1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test:
   - Tap targets (should be ≥44px)
   - Swipe gestures
   - Visual feedback
   - No unintended text selection

### **Manual Testing**

- **iOS Safari** (iPhone 12+)
- **Chrome Mobile** (Android)
- **Tablet** (iPad, Samsung Tab)

### **Checklist:**

- [ ] All buttons ≥44px tap target
- [ ] No accidental text selection
- [ ] Swipe-to-close works on modals
- [ ] Visual feedback on tap
- [ ] No hover-only interactions
- [ ] Safe spacing between tap targets (12px+)

---

## **Performance Considerations**

### **Mobile-First Animations**

```tsx
// Faster animations on mobile
transition={{
  duration: isMobile ? 0.2 : 0.3
}}
```

### **Conditional Features**

```tsx
// Disable expensive hover effects on mobile
whileHover={isMobile ? {} : { scale: 1.02 }}
```

---

## **Quick Reference**

| Feature           | CSS Class         | Min Size | Notes                  |
| ----------------- | ----------------- | -------- | ---------------------- |
| Primary Button    | `tap-target`      | 44px     | iOS/Material guideline |
| Secondary Button  | `tap-target-sm`   | 36px     | Less critical actions  |
| Touch Feedback    | `touch-active`    | -        | Scale 0.97 on tap      |
| Prevent Selection | `no-select`       | -        | No text selection      |
| Safe Spacing      | `touch-spacing`   | 12px     | Between tap targets    |
| Swipe Indicator   | `swipe-indicator` | -        | Mobile-only            |

---

## **Browser Support**

✅ **Fully Supported:**

- iOS Safari 12+
- Chrome Mobile 80+
- Samsung Internet 12+
- Firefox Mobile 85+

⚠️ **Partial Support:**

- IE11 (No touch events - fallback to mouse)

---

**Related Files:**

- `src/index.css` - Touch utility classes
- `src/components/common/Modal.tsx` - Swipe-to-close
- `src/components/common/Button.tsx` - Touch-friendly buttons
- `src/hooks/useMediaQuery.ts` - `useIsMobile`, `useIsTouchDevice`

**Last Updated:** Task 10.3 - Mobile-Specific Interactions
