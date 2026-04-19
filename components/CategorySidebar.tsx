'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { CATEGORY_GROUPS } from '@/lib/categories'

type CategorySidebarProps = {
  activeCategory?: string
  search?: string
  availableCategories: string[]
}

export default function CategorySidebar({ activeCategory, search, availableCategories }: CategorySidebarProps) {
  const knownOptions = useMemo(
    () => new Set(CATEGORY_GROUPS.flatMap((group) => group.options)),
    []
  )

  const uncategorizedOptions = useMemo(
    () => availableCategories.filter((category) => !knownOptions.has(category)).sort((a, b) => a.localeCompare(b, 'ja')),
    [availableCategories, knownOptions]
  )

  const groups = useMemo(() => {
    if (uncategorizedOptions.length === 0) {
      return CATEGORY_GROUPS
    }

    return [
      ...CATEGORY_GROUPS,
      {
        label: 'その他',
        icon: '📦',
        options: uncategorizedOptions,
      },
    ]
  }, [uncategorizedOptions])

  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(groups.map((group) => group.label))
  )

  useEffect(() => {
    setOpenGroups((prev) => {
      if (prev.size === 0) {
        return new Set(groups.map((group) => group.label))
      }

      const next = new Set(prev)
      for (const group of groups) {
        if (!next.has(group.label)) {
          next.add(group.label)
        }
      }
      return next
    })
  }, [groups])

  useEffect(() => {
    if (!activeCategory) return
    const targetGroup = groups.find((group) => group.options.includes(activeCategory))
    if (!targetGroup) return

    setOpenGroups((prev) => {
      if (prev.has(targetGroup.label)) {
        return prev
      }
      const next = new Set(prev)
      next.add(targetGroup.label)
      return next
    })
  }, [activeCategory, groups])

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  const makeHref = (category?: string) => {
    const query = new URLSearchParams()
    if (category) {
      query.set('category', category)
    }
    if (search) {
      query.set('search', search)
    }
    const qs = query.toString()
    return qs ? `/projects?${qs}` : '/projects'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
      <h2 className="text-sm font-bold text-gray-900 mb-3">カテゴリ</h2>
      <nav className="space-y-1">
        <Link
          href={makeHref()}
          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
            !activeCategory ? 'bg-gray-900 text-white font-medium' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          すべて
        </Link>

        {groups.map((group) => {
          const isOpen = openGroups.has(group.label)
          return (
            <div key={group.label} className="rounded-lg border border-gray-100">
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-3 py-2 text-left"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <span>{group.icon}</span>
                  <span>{group.label}</span>
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="pb-2 px-2 space-y-1">
                  {group.options.map((option) => (
                    <Link
                      key={option}
                      href={makeHref(option)}
                      className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                        activeCategory === option
                          ? 'bg-gray-900 text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
