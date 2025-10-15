/**
 * useChartExport Hook
 *
 * Custom hook for exporting charts to PNG or PDF formats.
 *
 * Features:
 * - High-quality PNG exports (2x scale for retina)
 * - PDF exports with proper dimensions
 * - Maintains chart styling and colors
 * - Loading states during export
 * - Error handling
 * - Accessible file naming
 *
 * Usage:
 * ```tsx
 * const { exportToPNG, exportToPDF, isExporting } = useChartExport();
 *
 * <button onClick={() => exportToPNG(chartRef.current, 'chart-name')}>
 *   Export PNG
 * </button>
 * ```
 */

import { useState, useCallback } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export interface ExportOptions {
  /** Scale factor for image quality (default: 2 for retina) */
  scale?: number
  /** Background color for transparent elements */
  backgroundColor?: string
  /** Additional filename prefix */
  prefix?: string
}

/**
 * Hook for exporting chart elements
 */
export const useChartExport = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Export chart as PNG
   */
  const exportToPNG = useCallback(
    async (
      element: HTMLElement | null,
      filename: string = 'chart',
      options: ExportOptions = {}
    ): Promise<void> => {
      if (!element) {
        setError('No element provided for export')
        return
      }

      setIsExporting(true)
      setError(null)

      try {
        const {
          scale = 2,
          backgroundColor = '#0f172a', // Dark theme background
          prefix = '',
        } = options

        // Capture the element as canvas
        const canvas = await html2canvas(element, {
          scale,
          backgroundColor,
          useCORS: true,
          logging: false,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
        })

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (!blob) {
            setError('Failed to create image')
            setIsExporting(false)
            return
          }

          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          const timestamp = new Date().toISOString().split('T')[0]
          link.download = `${prefix}${filename}-${timestamp}.png`
          link.href = url
          link.click()

          // Cleanup
          URL.revokeObjectURL(url)
          setIsExporting(false)
        }, 'image/png')
      } catch (err) {
        console.error('PNG export failed:', err)
        setError(err instanceof Error ? err.message : 'Export failed')
        setIsExporting(false)
      }
    },
    []
  )

  /**
   * Export chart as PDF
   */
  const exportToPDF = useCallback(
    async (
      element: HTMLElement | null,
      filename: string = 'chart',
      options: ExportOptions = {}
    ): Promise<void> => {
      if (!element) {
        setError('No element provided for export')
        return
      }

      setIsExporting(true)
      setError(null)

      try {
        const { scale = 2, backgroundColor = '#0f172a', prefix = '' } = options

        // Capture the element as canvas
        const canvas = await html2canvas(element, {
          scale,
          backgroundColor,
          useCORS: true,
          logging: false,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
        })

        // Calculate PDF dimensions
        const imgWidth = 210 // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Create PDF
        const pdf = new jsPDF({
          orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
          unit: 'mm',
          format: 'a4',
        })

        // Add image to PDF
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

        // Save PDF
        const timestamp = new Date().toISOString().split('T')[0]
        pdf.save(`${prefix}${filename}-${timestamp}.pdf`)

        setIsExporting(false)
      } catch (err) {
        console.error('PDF export failed:', err)
        setError(err instanceof Error ? err.message : 'Export failed')
        setIsExporting(false)
      }
    },
    []
  )

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    exportToPNG,
    exportToPDF,
    isExporting,
    error,
    clearError,
  }
}

export default useChartExport
