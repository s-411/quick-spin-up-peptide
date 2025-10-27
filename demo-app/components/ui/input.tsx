'use client'

import * as React from 'react'
import { Loader2, X } from 'lucide-react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon to display at the start of the input */
  startIcon?: React.ReactNode
  /** Icon to display at the end of the input */
  endIcon?: React.ReactNode
  /** Shows a loading spinner */
  loading?: boolean
  /** Shows a clear button when input has value */
  clearable?: boolean
  /** Error message to display below input */
  error?: string
  /** Character counter - shows current/max characters */
  maxLength?: number
  /** Show character count */
  showCount?: boolean
  /** Callback when clear button is clicked */
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      loading,
      clearable,
      error,
      maxLength,
      showCount,
      onClear,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const hasValue = value !== undefined && value !== ''

    const handleClear = () => {
      if (onClear) {
        onClear()
      }
    }

    return (
      <div className="w-full">
        <div
          className={`
            relative flex items-center
            transition-all duration-200
            ${error ? 'animate-shake' : ''}
          `}
        >
          {/* Start Icon */}
          {startIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
              {startIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            type={type}
            className={`
              input-mm w-full
              ${startIcon ? 'pl-10' : ''}
              ${endIcon || loading || (clearable && hasValue) ? 'pr-10' : ''}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${disabled ? 'cursor-not-allowed' : ''}
              transition-all duration-200
            `}
            ref={ref}
            disabled={disabled || loading}
            maxLength={maxLength}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* End Icons/Actions */}
          <div className="absolute right-3 flex items-center gap-2">
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {!loading && clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {!loading && endIcon && (
              <div className="text-muted-foreground">{endIcon}</div>
            )}
          </div>
        </div>

        {/* Error Message or Character Count */}
        <div className="flex justify-between items-center mt-1 min-h-[20px]">
          {error && (
            <p className="text-error text-xs">{error}</p>
          )}
          {!error && showCount && maxLength && (
            <p className="text-xs text-muted-foreground ml-auto">
              {String(value || '').length} / {maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = 'Input'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error message to display below textarea */
  error?: string
  /** Character counter - shows current/max characters */
  maxLength?: number
  /** Show character count */
  showCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      maxLength,
      showCount,
      value,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        <textarea
          className={`
            input-mm min-h-[100px] w-full resize-y
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake' : ''}
          `}
          ref={ref}
          maxLength={maxLength}
          value={value}
          {...props}
        />

        {/* Error Message or Character Count */}
        <div className="flex justify-between items-center mt-1 min-h-[20px]">
          {error && (
            <p className="text-error text-xs">{error}</p>
          )}
          {!error && showCount && maxLength && (
            <p className="text-xs text-muted-foreground ml-auto">
              {String(value || '').length} / {maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Input, Textarea }
