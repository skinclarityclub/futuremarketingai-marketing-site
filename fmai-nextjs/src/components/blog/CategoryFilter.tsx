'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface Category {
  readonly id: string
  readonly label: string
}

interface CategoryFilterProps {
  categories: readonly Category[]
  activeCategory: string | null
  locale: string
}

export function CategoryFilter({ categories, activeCategory, locale }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilter = useCallback(
    (categoryId: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (categoryId) {
        params.set('category', categoryId)
      } else {
        params.delete('category')
      }
      router.push(`/${locale}/blog?${params.toString()}`)
    },
    [router, searchParams, locale]
  )

  return (
    <nav aria-label="Blog categories" className="mb-8 flex flex-wrap gap-2">
      <button
        onClick={() => handleFilter(null)}
        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
          activeCategory === null
            ? 'bg-accent-system text-bg-deep'
            : 'border border-border-primary text-text-secondary hover:border-accent-system/30 hover:text-text-primary'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleFilter(cat.id)}
          className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            activeCategory === cat.id
              ? 'bg-accent-system text-bg-deep'
              : 'border border-border-primary text-text-secondary hover:border-accent-system/30 hover:text-text-primary'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  )
}
