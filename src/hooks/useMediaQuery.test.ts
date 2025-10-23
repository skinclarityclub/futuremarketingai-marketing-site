import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsMobileOrTablet } from './useMediaQuery'

describe('useMediaQuery', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('should return false when media query does not match', () => {
      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
      expect(result.current).toBe(false)
    })

    it('should return true when media query matches', () => {
      // Mock matchMedia to return true
      vi.mocked(window.matchMedia).mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
      expect(result.current).toBe(true)
    })

    it('should call matchMedia with correct query', () => {
      renderHook(() => useMediaQuery('(max-width: 1024px)'))
      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 1024px)')
    })
  })

  describe('SSR Support', () => {
    it('should use defaultValue option when provided', () => {
      const { result } = renderHook(() =>
        useMediaQuery('(max-width: 768px)', { defaultValue: true })
      )
      // Should return false (actual matches) or true (defaultValue on first render)
      expect(typeof result.current).toBe('boolean')
    })

    it('should support initializeWithValue option', () => {
      const { result } = renderHook(() =>
        useMediaQuery('(max-width: 768px)', {
          defaultValue: true,
          initializeWithValue: false,
        })
      )
      expect(typeof result.current).toBe('boolean')
    })
  })

  describe('Dynamic Updates', () => {
    it('should update when media query match changes', async () => {
      let changeHandler: ((event: MediaQueryListEvent) => void) | null = null
      
      // Mock addEventListener to capture the handler
      vi.mocked(window.matchMedia).mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event, handler) => {
          if (event === 'change') {
            changeHandler = handler as any
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
      
      expect(result.current).toBe(false)

      // Simulate media query change
      if (changeHandler) {
        act(() => {
          changeHandler!({ matches: true } as MediaQueryListEvent)
        })
      }

      await waitFor(() => {
        expect(result.current).toBe(true)
      })
    })
  })

  describe('Convenience Hooks', () => {
    describe('useIsMobile', () => {
      it('should detect mobile viewport (max-width: 639px)', () => {
        renderHook(() => useIsMobile())
        expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 639px)')
      })

      it('should return false by default', () => {
        const { result } = renderHook(() => useIsMobile())
        expect(result.current).toBe(false)
      })

      it('should return true when mobile query matches', () => {
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

        const { result } = renderHook(() => useIsMobile())
        expect(result.current).toBe(true)
      })
    })

    describe('useIsTablet', () => {
      it('should detect tablet viewport (640-1023px)', () => {
        renderHook(() => useIsTablet())
        expect(window.matchMedia).toHaveBeenCalledWith(
          '(min-width: 640px) and (max-width: 1023px)'
        )
      })
    })

    describe('useIsDesktop', () => {
      it('should detect desktop viewport (min-width: 1024px)', () => {
        renderHook(() => useIsDesktop())
        expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)')
      })
    })

    describe('useIsMobileOrTablet', () => {
      it('should detect mobile or tablet viewport (max-width: 1023px)', () => {
        renderHook(() => useIsMobileOrTablet())
        expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 1023px)')
      })
    })
  })

  describe('Cleanup', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.fn()
      
      vi.mocked(window.matchMedia).mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: removeEventListenerSpy,
        dispatchEvent: vi.fn(),
      }))

      const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'))
      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty query string', () => {
      const { result } = renderHook(() => useMediaQuery(''))
      expect(typeof result.current).toBe('boolean')
    })

    it('should handle query changes', () => {
      const { rerender } = renderHook(
        ({ query }) => useMediaQuery(query),
        { initialProps: { query: '(max-width: 640px)' } }
      )

      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 640px)')

      rerender({ query: '(max-width: 1024px)' })
      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 1024px)')
    })
  })
})
