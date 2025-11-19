"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange?: (date: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({ 
  value, 
  onChange, 
  placeholder = "dd/mm/aaaa", 
  className,
  disabled = false 
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  React.useEffect(() => {
    if (value) {
      const parsedDate = new Date(value)
      setDate(parsedDate)
      setInputValue(format(parsedDate, "dd/MM/yyyy", { locale: ptBR }))
    } else {
      setDate(undefined)
      setInputValue("")
    }
  }, [value])

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate && onChange) {
      const formatted = format(selectedDate, "yyyy-MM-dd")
      onChange(formatted)
      setInputValue(format(selectedDate, "dd/MM/yyyy", { locale: ptBR }))
      setOpen(false)
    } else if (!selectedDate && onChange) {
      onChange("")
      setInputValue("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    // Tenta parsear a data no formato dd/MM/yyyy
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    const match = newValue.match(dateRegex)
    
    if (match) {
      const [, day, month, year] = match
      const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate)
        if (onChange) {
          const formatted = format(parsedDate, "yyyy-MM-dd")
          onChange(formatted)
        }
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "h-9 pr-10",
              className
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9 w-9 hover:bg-transparent"
            disabled={disabled}
            onClick={() => setOpen(!open)}
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={date}
          onSelect={handleSelect}
          disabled={disabled}
          captionLayout="dropdown"
          fromYear={1920}
          toYear={2026}
        />
      </PopoverContent>
    </Popover>
  )
}
