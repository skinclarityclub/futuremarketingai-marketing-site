import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { formatNumber, formatCurrency, formatPercentage, type ROIMetrics } from './calculations'

export interface PDFExportOptions {
  includeCharts?: boolean
  includeTable?: boolean
  quality?: number // 0-1, default 0.95
}

/**
 * Export calculator results to PDF
 *
 * @param metrics - ROI calculation metrics
 * @param inputs - User input values
 * @param options - Export options
 * @returns Promise that resolves when PDF is generated
 */
export async function exportCalculatorToPDF(
  metrics: ROIMetrics,
  inputs: {
    teamSize: number
    avgSalary: number
    campaignsPerMonth: number
  },
  options: PDFExportOptions = {}
): Promise<void> {
  const { includeCharts = true, includeTable = true, quality = 0.95 } = options

  try {
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin

    // ========================================
    // HEADER WITH GRADIENT EFFECT
    // ========================================
    // Background header rectangle
    pdf.setFillColor(100, 50, 255) // Primary purple
    pdf.rect(0, 0, pageWidth, 45, 'F')

    // Gradient effect (second layer)
    pdf.setFillColor(139, 92, 246, 180) // Lighter purple with transparency effect
    pdf.rect(0, 0, pageWidth, 25, 'F')

    // Logo/Brand Name
    pdf.setFontSize(32)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 255, 255)
    pdf.text('FutureMarketingAI', margin, 15)
    yPosition = 22

    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(230, 230, 255)
    pdf.text('ROI Calculator Report', margin, yPosition)
    yPosition = 32

    // Date in header
    pdf.setFontSize(10)
    pdf.setTextColor(200, 200, 255)
    const date = new Date().toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    pdf.text(`📅 Gegenereerd op ${date}`, margin, yPosition)
    yPosition = 55

    // ========================================
    // INPUT SUMMARY SECTION
    // ========================================
    // Section box
    pdf.setFillColor(248, 250, 252) // Light gray background
    pdf.setDrawColor(220, 220, 230)
    pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 32, 3, 3, 'FD')

    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(30, 30, 50)
    pdf.text('📊 Jouw Inputs', margin + 5, yPosition + 8)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.setTextColor(60, 60, 80)

    const inputY = yPosition + 15
    pdf.text(`👥 Team Size: ${inputs.teamSize} mensen`, margin + 10, inputY)
    pdf.text(`💰 Gem. Salaris: ${formatCurrency(inputs.avgSalary)}/jaar`, margin + 10, inputY + 6)
    pdf.text(`📈 Campagnes: ${inputs.campaignsPerMonth} per maand`, margin + 10, inputY + 12)
    yPosition += 40

    // ========================================
    // HERO ROI SECTION
    // ========================================
    // Large ROI showcase box with gradient
    pdf.setFillColor(16, 185, 129) // Success green
    pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 35, 5, 5, 'F')

    // Add subtle inner shadow effect with darker border
    pdf.setDrawColor(10, 140, 95)
    pdf.setLineWidth(0.5)
    pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 35, 5, 5, 'D')
    pdf.setLineWidth(0.2) // Reset

    // Icon/Label
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 255, 255)
    pdf.text('🎯 JOUW TOTAL ROI', margin + 8, yPosition + 12)

    // Giant ROI number
    pdf.setFontSize(42)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 255, 255)
    const roiText = formatPercentage(metrics.totalROI)
    const roiWidth = pdf.getTextWidth(roiText)
    pdf.text(roiText, (pageWidth - roiWidth) / 2, yPosition + 28)

    yPosition += 45

    // ========================================
    // KEY METRICS GRID
    // ========================================
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(30, 30, 50)
    pdf.text('💎 Key Metrics', margin, yPosition)
    yPosition += 10

    const metricsData = [
      {
        icon: '⏱️',
        label: 'Tijd Bespaard',
        value: `${formatNumber(metrics.timeSaved)}`,
        unit: 'uren/maand',
        color: [16, 185, 129],
        bgColor: [16, 185, 129, 20],
      },
      {
        icon: '💰',
        label: 'Kostenbesparing',
        value: formatCurrency(metrics.laborCostSavings),
        unit: 'per maand',
        color: [100, 50, 255],
        bgColor: [100, 50, 255, 20],
      },
      {
        icon: '📈',
        label: 'Content Output',
        value: formatNumber(metrics.contentOutput),
        unit: 'campagnes/maand',
        color: [251, 146, 60],
        bgColor: [251, 146, 60, 20],
      },
      {
        icon: '💵',
        label: 'Extra Revenue',
        value: formatCurrency(metrics.revenueIncrease),
        unit: 'per maand',
        color: [16, 185, 129],
        bgColor: [16, 185, 129, 20],
      },
      {
        icon: '🎯',
        label: 'Net Benefit',
        value: formatCurrency(metrics.netBenefit),
        unit: 'per maand',
        color: [100, 50, 255],
        bgColor: [100, 50, 255, 20],
      },
      {
        icon: '⚡',
        label: 'Break-Even',
        value: metrics.breakEven < 1 ? '<1' : `${Math.round(metrics.breakEven)}`,
        unit: 'maanden',
        color: [251, 146, 60],
        bgColor: [251, 146, 60, 20],
      },
    ]

    // Draw metrics in 2-column grid
    const colWidth = (pageWidth - 2 * margin - 8) / 2
    const rowHeight = 28

    metricsData.forEach((metric, index) => {
      if (yPosition > pageHeight - 50) {
        pdf.addPage()
        yPosition = margin + 20
      }

      const col = index % 2
      const row = Math.floor(index / 2)
      const x = margin + col * (colWidth + 8)
      const y = yPosition + row * (rowHeight + 4)

      // Card background
      pdf.setFillColor(
        metric.bgColor[0],
        metric.bgColor[1],
        metric.bgColor[2],
        metric.bgColor[3] || 255
      )
      pdf.setDrawColor(metric.color[0], metric.color[1], metric.color[2])
      pdf.setLineWidth(0.3)
      pdf.roundedRect(x, y, colWidth, rowHeight, 2, 2, 'FD')

      // Icon
      pdf.setFontSize(16)
      pdf.text(metric.icon, x + 4, y + 12)

      // Label
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(60, 60, 80)
      pdf.text(metric.label, x + 15, y + 8)

      // Value
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(metric.color[0], metric.color[1], metric.color[2])
      pdf.text(metric.value, x + 15, y + 18)

      // Unit
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 120)
      pdf.text(metric.unit, x + 15, y + 23)
    })

    yPosition += Math.ceil(metricsData.length / 2) * (rowHeight + 4) + 10
    pdf.setLineWidth(0.2) // Reset

    // ========================================
    // YEARLY PROJECTION HIGHLIGHT
    // ========================================
    if (yPosition > pageHeight - 65) {
      pdf.addPage()
      yPosition = margin + 20
    }

    // Big callout box for yearly total
    pdf.setFillColor(240, 253, 244) // Very light green
    pdf.setDrawColor(16, 185, 129)
    pdf.setLineWidth(1)
    pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 4, 4, 'FD')

    // Icon + Label
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(16, 120, 90)
    pdf.text('📊 Eerste Jaar Projectie', margin + 8, yPosition + 12)

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(80, 80, 80)
    pdf.text('Totale netto waarde na 12 maanden:', margin + 8, yPosition + 20)

    // Giant yearly number
    pdf.setFontSize(26)
    pdf.setTextColor(16, 185, 129)
    pdf.setFont('helvetica', 'bold')
    const yearlyValue = formatCurrency(Math.round(metrics.netBenefit * 12))
    pdf.text(yearlyValue, margin + 8, yPosition + 32)

    // Small ROI indicator
    pdf.setFontSize(11)
    pdf.setTextColor(100, 100, 120)
    pdf.setFont('helvetica', 'normal')
    pdf.text(
      `(${formatPercentage(metrics.totalROI)} ROI)`,
      margin + 8 + pdf.getTextWidth(yearlyValue) + 3,
      yPosition + 32
    )

    pdf.setFont('helvetica', 'normal')
    pdf.setLineWidth(0.2) // Reset
    yPosition += 50

    // Capture charts if requested
    if (includeCharts) {
      const chartsElement = document.querySelector('[data-pdf-charts]')
      if (chartsElement) {
        try {
          const canvas = await html2canvas(chartsElement as HTMLElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
          })

          const imgData = canvas.toDataURL('image/png', quality)
          const imgWidth = pageWidth - 2 * margin
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage()
            yPosition = margin
          }

          pdf.setFontSize(18)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor(30, 30, 50)
          pdf.text('📊 Visual Analysis', margin, yPosition)
          yPosition += 10

          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight)
          yPosition += imgHeight + 10
        } catch (error) {
          console.warn('Failed to capture charts:', error)
        }
      }
    }

    // Capture comparison table if requested
    if (includeTable) {
      const tableElement = document.querySelector('[data-pdf-table]')
      if (tableElement) {
        try {
          const canvas = await html2canvas(tableElement as HTMLElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
          })

          const imgData = canvas.toDataURL('image/png', quality)
          const imgWidth = pageWidth - 2 * margin
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage()
            yPosition = margin
          }

          pdf.setFontSize(18)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor(30, 30, 50)
          pdf.text('⚖️ Voor & Na Vergelijking', margin, yPosition)
          yPosition += 10

          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight)
        } catch (error) {
          console.warn('Failed to capture table:', error)
        }
      }
    }

    // ========================================
    // FOOTER (on every page)
    // ========================================
    const totalPages = pdf.getNumberOfPages()

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)

      // Footer background bar
      pdf.setFillColor(248, 250, 252)
      pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F')

      // Footer divider line
      pdf.setDrawColor(220, 220, 230)
      pdf.setLineWidth(0.5)
      pdf.line(0, pageHeight - 20, pageWidth, pageHeight - 20)

      // Left: Brand
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(100, 50, 255)
      pdf.text('FutureMarketingAI', margin, pageHeight - 10)

      // Center: Website
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 120)
      pdf.text('www.futuremarketingai.com', pageWidth / 2, pageHeight - 10, { align: 'center' })

      // Right: Page number
      pdf.setFontSize(8)
      pdf.setTextColor(120, 120, 140)
      pdf.text(`Pagina ${i} van ${totalPages}`, pageWidth - margin, pageHeight - 10, {
        align: 'right',
      })
    }

    pdf.setLineWidth(0.2) // Reset

    // Generate filename
    const filename = `FutureMarketingAI-ROI-${new Date().getTime()}.pdf`

    // Save PDF
    pdf.save(filename)
  } catch (error) {
    console.error('Failed to generate PDF:', error)
    throw new Error('PDF export failed. Please try again.')
  }
}

/**
 * Prepare element for PDF export by adding data attribute
 */
export function markForPDFExport(element: HTMLElement, type: 'charts' | 'table'): void {
  element.setAttribute(`data-pdf-${type}`, 'true')
}

export default exportCalculatorToPDF
