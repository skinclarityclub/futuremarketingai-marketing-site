import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export interface HeatMapData {
  row: string
  col: string
  value: number
}

interface HeatMapProps {
  data: HeatMapData[]
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  colorScheme?: 'cyan' | 'purple' | 'green'
  onCellClick?: (data: HeatMapData) => void
}

/**
 * HeatMap - D3.js-powered heat map visualization
 *
 * @param data - Array of { row, col, value } objects
 * @param width - Total width (default: 600)
 * @param height - Total height (default: 400)
 * @param margin - Chart margins
 * @param colorScheme - Color theme: cyan, purple, or green
 * @param onCellClick - Callback when cell is clicked
 */
export const HeatMap: React.FC<HeatMapProps> = ({
  data,
  width = 600,
  height = 400,
  margin = { top: 40, right: 40, bottom: 60, left: 100 },
  colorScheme = 'cyan',
  onCellClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) {
      return
    }

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove()

    // Dimensions
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    // Extract unique rows and columns
    const rows = Array.from(new Set(data.map((d) => d.row)))
    const cols = Array.from(new Set(data.map((d) => d.col)))

    // Color scales based on theme
    const colorScales = {
      cyan: d3.scaleSequential(d3.interpolateBlues),
      purple: d3.scaleSequential(d3.interpolatePurples),
      green: d3.scaleSequential(d3.interpolateGreens),
    }

    const colorScale = colorScales[colorScheme].domain([0, d3.max(data, (d) => d.value) || 100])

    // X and Y scales
    const xScale = d3.scaleBand().domain(cols).range([0, chartWidth]).padding(0.05)

    const yScale = d3.scaleBand().domain(rows).range([0, chartHeight]).padding(0.05)

    // Create SVG
    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Add cells
    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.col) || 0)
      .attr('y', (d) => yScale(d.row) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', (d) => colorScale(d.value))
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-width', 1)
      .attr('rx', 4)
      .style('cursor', onCellClick ? 'pointer' : 'default')
      .on('mouseover', function (_event, d) {
        // Highlight on hover
        d3.select(this).attr('stroke', '#00D4FF').attr('stroke-width', 2)

        // Show tooltip
        const tooltip = g
          .append('g')
          .attr('class', 'tooltip')
          .attr(
            'transform',
            `translate(${(xScale(d.col) || 0) + xScale.bandwidth() / 2}, ${(yScale(d.row) || 0) - 10})`
          )

        const text = tooltip
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', '#FFFFFF')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(`${d.value.toFixed(1)}%`)

        const bbox = (text.node() as SVGTextElement).getBBox()
        tooltip
          .insert('rect', 'text')
          .attr('x', bbox.x - 6)
          .attr('y', bbox.y - 3)
          .attr('width', bbox.width + 12)
          .attr('height', bbox.height + 6)
          .attr('fill', 'rgba(0, 0, 0, 0.8)')
          .attr('rx', 4)
      })
      .on('mouseout', function () {
        // Remove highlight
        d3.select(this).attr('stroke', 'rgba(255, 255, 255, 0.1)').attr('stroke-width', 1)

        // Remove tooltip
        g.selectAll('.tooltip').remove()
      })
      .on('click', function (_event, d) {
        if (onCellClick) {
          onCellClick(d)
        }
      })

    // Add X axis
    const xAxis = d3.axisBottom(xScale)
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '11px')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')

    // Add Y axis
    const yAxis = d3.axisLeft(yScale)
    g.append('g').call(yAxis).selectAll('text').attr('fill', '#94A3B8').attr('font-size', '11px')

    // Style axes
    g.selectAll('.domain, .tick line').attr('stroke', 'rgba(255, 255, 255, 0.1)')

    // Add legend
    const legendWidth = 20
    const legendHeight = chartHeight
    const legendSteps = 10

    const legend = g.append('g').attr('transform', `translate(${chartWidth + 20}, 0)`)

    const legendScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 100])
      .range([legendHeight, 0])

    const legendData = d3.range(legendSteps).map((i) => {
      const value = (legendScale.domain()[1] / legendSteps) * i
      return { value, y: legendScale(value) }
    })

    legend
      .selectAll('rect')
      .data(legendData)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => d.y)
      .attr('width', legendWidth)
      .attr('height', legendHeight / legendSteps)
      .attr('fill', (d) => colorScale(d.value))

    const legendAxis = d3
      .axisRight(legendScale)
      .ticks(5)
      .tickFormat((d) => `${Number(d)}%`)
    legend
      .append('g')
      .attr('transform', `translate(${legendWidth}, 0)`)
      .call(legendAxis)
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '10px')

    legend.selectAll('.domain, .tick line').attr('stroke', 'rgba(255, 255, 255, 0.1)')
  }, [data, width, height, margin, colorScheme, onCellClick])

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} className="heat-map" />
    </div>
  )
}

export default HeatMap
