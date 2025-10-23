import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  useShouldLoadComponent,
  useConditionalPreload,
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  isMobileOrTabletDevice,
  runByDevice,
} from './useConditionalLoad'

describe('Conditional Loading Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useShouldLoadComponent', () => {
    it('should return true when loadOn is "all"', () => {
      const { result } = renderHook(() => useShouldLoadComponent('all'))
      expect(result.current).toBe(true)
    })

    it('should return true for mobile when on mobile device', () => {
      // Mock mobile device
      vi.mocked(window.matchMedia).mockImplementation((query) => ({
        matches: query === '(max-width: 639px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useShouldLoadComponent('mobile'))
      expect(result.current).toBe(true)
    })

    it('should return false for desktop when on mobile device', () => {
      // Mock mobile device
      vi.mocked(window.matchMedia).mockImplementation((query) => ({
        matches: query === '(max-width: 639px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useShouldLoadComponent('desktop'))
      expect(result.current).toBe(false)
    })

    it('should return true when device matches one of multiple loadOn values', () => {
      // Mock mobile device
      vi.mocked(window.matchMedia).mockImplementation((query) => ({
        matches: query === '(max-width: 639px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useShouldLoadComponent(['mobile', 'tablet']))
      expect(result.current).toBe(true)
    })

    it('should return true for desktop on desktop device', () => {
      // Mock desktop device
      vi.mocked(window.matchMedia).mockImplementation((query) => ({
        matches: query === '(min-width: 1024px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useShouldLoadComponent('desktop'))
      expect(result.current).toBe(true)
    })

    it('should return true for tablet on tablet device', () => {
      // Mock tablet device
      vi.mocked(window.matchMedia).mockImplementation((query) => ({
        matches: query === '(min-width: 640px) and (max-width: 1023px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useShouldLoadComponent('tablet'))
      expect(result.current).toBe(true)
    })
  })

  describe('useConditionalPreload', () => {
    it('should return a function', () => {
      const importFn = vi.fn(() => Promise.resolve({ default: () => null }))
      const { result } = renderHook(() => useConditionalPreload(importFn, 'all'))

      expect(typeof result.current).toBe('function')
    })

    it('should call importFn when preload is triggered and device matches', () => {
      const importFn = vi.fn(() => Promise.resolve({ default: () => null }))

      const { result } = renderHook(() => useConditionalPreload(importFn, 'all'))

      // Call the preload function
      result.current()

      expect(importFn).toHaveBeenCalled()
    })

    it('should not call importFn when device does not match', () => {
      // Mock mobile device
      vi.mocked(window.matchMedia).mockImplementation((query) => ({
        matches: query === '(max-width: 639px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const importFn = vi.fn(() => Promise.resolve({ default: () => null }))

      const { result } = renderHook(() => useConditionalPreload(importFn, 'desktop'))

      // Call the preload function
      result.current()

      expect(importFn).not.toHaveBeenCalled()
    })

    it('should handle import failures gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const importFn = vi.fn(() => Promise.reject(new Error('Import failed')))

      const { result } = renderHook(() => useConditionalPreload(importFn, 'all'))

      // Call the preload function
      result.current()

      expect(importFn).toHaveBeenCalled()

      // Restore console
      consoleSpy.mockRestore()
    })
  })

  describe('Device Detection Utilities', () => {
    describe('isMobileDevice', () => {
      it('should return true on mobile', () => {
        vi.mocked(window.matchMedia).mockImplementation((query) => ({
          matches: query === '(max-width: 639px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }))

        expect(isMobileDevice()).toBe(true)
      })

      it('should return false on desktop', () => {
        vi.mocked(window.matchMedia).mockImplementation(() => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }))

        expect(isMobileDevice()).toBe(false)
      })
    })

    describe('isTabletDevice', () => {
      it('should return true on tablet', () => {
        vi.mocked(window.matchMedia).mockImplementation((query) => ({
          matches: query === '(min-width: 640px) and (max-width: 1023px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }))

        expect(isTabletDevice()).toBe(true)
      })

      it('should return false on mobile', () => {
        vi.mocked(window.matchMedia).mockImplementation(() => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }))

        expect(isTabletDevice()).toBe(false)
      })
    })

    describe('isDesktopDevice', () => {
      it('should return true on desktop', () => {
        vi.mocked(window.matchMedia).mockImplementation((query) => ({
          matches: query === '(min-width: 1024px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }))

        expect(isDesktopDevice()).toBe(true)
      })

      it('should return false on mobile', () => {
        vi.mocked(window.matchMedia).mockImplementation(() => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }))

        expect(isDesktopDevice()).toBe(false)
      })
    })

    describe('isMobileOrTabletDevice', () => {
      it('should return true on mobile', () => {
        vi.mocked(window.matchMedia).mockImplementation((query) => ({
          matches: query === '(max-width: 1023px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }))

        expect(isMobileOrTabletDevice()).toBe(true)
      })

      it('should return false on desktop', () => {
        vi.mocked(window.matchMedia).mockImplementation(() => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }))

        expect(isMobileOrTabletDevice()).toBe(false)
      })
    })
  })

  describe('runByDevice', () => {
    it('should execute desktop function on desktop', () => {
      vi.mocked(window.matchMedia).mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const desktopFn = vi.fn(() => 'desktop')
      const mobileFn = vi.fn(() => 'mobile')

      const result = runByDevice(desktopFn, mobileFn)

      expect(desktopFn).toHaveBeenCalled()
      expect(mobileFn).not.toHaveBeenCalled()
      expect(result).toBe('desktop')
    })

    it('should execute mobile function on mobile', () => {
      vi.mocked(window.matchMedia).mockImplementation((query) => ({
        matches: query === '(max-width: 1023px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const desktopFn = vi.fn(() => 'desktop')
      const mobileFn = vi.fn(() => 'mobile')

      const result = runByDevice(desktopFn, mobileFn)

      expect(desktopFn).not.toHaveBeenCalled()
      expect(mobileFn).toHaveBeenCalled()
      expect(result).toBe('mobile')
    })

    it('should execute desktop function when mobile function is not provided', () => {
      vi.mocked(window.matchMedia).mockImplementation((query) => ({
        matches: query === '(max-width: 1023px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const desktopFn = vi.fn(() => 'desktop')

      const result = runByDevice(desktopFn)

      expect(desktopFn).toHaveBeenCalled()
      expect(result).toBe('desktop')
    })
  })
})
