import { Check, Minus } from 'lucide-react'

export interface ComparisonRow {
  /** Row label (the feature / dimension being compared). */
  label: string
  /** One value per column. Booleans render as a check / dash. */
  values: (string | boolean)[]
}

interface ComparisonTableProps {
  /** Column headers. The first conceptual column is the row label (no header needed). */
  columns: string[]
  rows: ComparisonRow[]
  /** Optional column index to highlight (e.g. your own product). */
  highlightColumn?: number
  caption?: string
}

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check aria-label="Ja" className="mx-auto h-4 w-4 text-status-active" />
    ) : (
      <Minus aria-label="Nee" className="mx-auto h-4 w-4 text-text-muted" />
    )
  }
  return <span className="text-text-secondary">{value}</span>
}

/**
 * Comparison table for "X vs Y" cornerstone pages. Authored in MDX via:
 * <ComparisonTable columns={["Clyde","Jasper"]} rows={[{label:"...", values:[true,false]}]} highlightColumn={0} />
 */
export function ComparisonTable({
  columns,
  rows,
  highlightColumn,
  caption,
}: ComparisonTableProps) {
  return (
    <figure className="my-8 overflow-x-auto rounded-xl border border-border-primary">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-bg-surface/50">
            <th scope="col" className="px-4 py-3 text-left font-display text-text-primary" />
            {columns.map((col, i) => (
              <th
                key={col}
                scope="col"
                className={`px-4 py-3 text-center font-display font-semibold ${
                  i === highlightColumn ? 'text-accent-system' : 'text-text-primary'
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-border-primary">
              <th scope="row" className="px-4 py-3 text-left font-medium text-text-primary">
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td
                  key={i}
                  className={`px-4 py-3 text-center ${
                    i === highlightColumn ? 'bg-accent-system/[0.05]' : ''
                  }`}
                >
                  <Cell value={value} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <figcaption className="border-t border-border-primary px-4 py-2 text-xs text-text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
