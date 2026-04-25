import { create } from 'zustand'

interface BookingStore {
  isOpen: boolean
  triggerEl: HTMLElement | null
  openBooking: (trigger?: HTMLElement | null) => void
  closeBooking: () => void
}

export const useBookingStore = create<BookingStore>((set) => ({
  isOpen: false,
  triggerEl: null,
  // Capture the element that opened the modal so BookingModal can return focus
  // to it on close (WCAG 2.4.3 Focus Order). Calling openBooking() with no
  // argument falls back to null and focus returns to body — no regression.
  openBooking: (trigger) => set({ isOpen: true, triggerEl: trigger ?? null }),
  // DO NOT clear triggerEl here; BookingModal reads it during the close transition.
  closeBooking: () => set({ isOpen: false }),
}))
