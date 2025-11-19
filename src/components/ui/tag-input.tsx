"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
}

export function TagInput({ value, onChange, placeholder = "Adicionar tags...", className }: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      const newTag = inputValue.trim()
      
      // Evitar duplicatas
      if (!value.includes(newTag)) {
        onChange([...value, newTag])
      }
      
      setInputValue("")
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove a última tag quando pressionar backspace com input vazio
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  return (
    <div
      className={cn(
        "flex min-h-9 w-full flex-wrap gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="gap-1 pr-1 pl-2 py-0.5 h-6 text-xs cursor-default"
        >
          <span>{tag}</span>
          <button
            type="button"
            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted p-0.5"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(tag)
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 min-w-[120px] h-6"
      />
    </div>
  )
}
