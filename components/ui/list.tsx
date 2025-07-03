"use client"

import type React from "react"

import { useState } from "react"
import { Search, SortAsc, SortDesc, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ListItem {
  id: string
  title: string
  description?: string
  status?: string
  date?: string
  [key: string]: any
}

interface ListProps {
  items: ListItem[]
  loading?: boolean
  searchable?: boolean
  sortable?: boolean
  table?: boolean
  viewToggle?: boolean
  emptyTitle?: string
  emptyDescription?: string
  renderItem?: (item: ListItem) => React.ReactNode
  onItemClick?: (item: ListItem) => void
}

export function CustomList({
  items,
  loading = false,
  searchable = true,
  sortable = true,
  table = false,
  viewToggle = true,
  emptyTitle = "데이터가 없습니다",
  emptyDescription = "표시할 항목이 없습니다.",
  renderItem,
  onItemClick,
}: ListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortField] || ""
    const bValue = b[sortField] || ""

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const defaultRenderItem = (item: ListItem) => (
    <Card
      key={item.id}
      className="cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
      onClick={() => onItemClick?.(item)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{item.title}</h3>
            {item.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>}
            {item.date && <p className="text-xs text-gray-500 dark:text-gray-500">{item.date}</p>}
          </div>
          {item.status && <Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {sortable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("title")}
              className="bg-white dark:bg-gray-800"
            >
              {sortDirection === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              정렬
            </Button>
          )}

          {viewToggle && (
            <div className="flex border rounded-lg bg-white dark:bg-gray-800">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-r-none"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-l-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {sortedItems.length === 0 ? (
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{emptyTitle}</h3>
            <p className="text-gray-600 dark:text-gray-400">{emptyDescription}</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {sortedItems.map((item) => (renderItem ? renderItem(item) : defaultRenderItem(item)))}
        </div>
      )}
    </div>
  )
}
