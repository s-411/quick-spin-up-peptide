/**
 * Design Tokens Type Definitions
 *
 * TypeScript types for all CSS variables and design tokens in the MM Design System.
 * These types provide autocomplete and type safety when working with design tokens in JavaScript/TypeScript.
 *
 * @module design-tokens
 * @version 2.0
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

/**
 * Brand color tokens (fixed across light/dark modes)
 */
export type BrandColorToken =
  | '--color-mm-primary'
  | '--color-mm-secondary'
  | '--color-mm-dark'
  | '--color-mm-dark2'
  | '--color-mm-white'
  | '--color-mm-gray';

/**
 * Hex values for brand colors
 */
export const BRAND_COLORS = {
  '--color-mm-primary': '#ef2f23',
  '--color-mm-secondary': '#ff811c',
  '--color-mm-dark': '#1f1f1f',
  '--color-mm-dark2': '#2a2a2a',
  '--color-mm-white': '#ffffff',
  '--color-mm-gray': '#ababab',
} as const;

/**
 * Semantic color tokens (@theme layer - for Tailwind utilities)
 */
export type ThemeColorToken =
  | '--color-background'
  | '--color-foreground'
  | '--color-card'
  | '--color-card-foreground'
  | '--color-popover'
  | '--color-popover-foreground'
  | '--color-primary'
  | '--color-primary-foreground'
  | '--color-secondary'
  | '--color-secondary-foreground'
  | '--color-muted'
  | '--color-muted-foreground'
  | '--color-accent'
  | '--color-accent-foreground'
  | '--color-destructive'
  | '--color-destructive-foreground'
  | '--color-border'
  | '--color-input'
  | '--color-ring';

/**
 * Semantic color tokens (@layer base - for shadcn/ui components)
 */
export type SemanticColorToken =
  | '--background'
  | '--foreground'
  | '--card'
  | '--card-foreground'
  | '--popover'
  | '--popover-foreground'
  | '--primary'
  | '--primary-foreground'
  | '--secondary'
  | '--secondary-foreground'
  | '--muted'
  | '--muted-foreground'
  | '--accent'
  | '--accent-foreground'
  | '--destructive'
  | '--destructive-foreground'
  | '--border'
  | '--input'
  | '--ring';

/**
 * All color tokens
 */
export type ColorToken = BrandColorToken | ThemeColorToken | SemanticColorToken;

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

/**
 * Font family tokens
 */
export type FontFamilyToken =
  | '--font-family-heading'
  | '--font-family-body';

/**
 * Font family values
 */
export const FONT_FAMILIES = {
  '--font-family-heading': "'National2Condensed', 'Arial Black', sans-serif",
  '--font-family-body': "'ESKlarheit', 'Inter', system-ui, sans-serif",
} as const;

// ============================================================================
// SPACING & LAYOUT TOKENS
// ============================================================================

/**
 * Border radius tokens
 */
export type BorderRadiusToken =
  | '--radius-mm'
  | '--radius-card'
  | '--radius-input'
  | '--radius';

/**
 * Border radius values
 */
export const BORDER_RADII = {
  '--radius-mm': '100px',
  '--radius-card': '0.5rem',
  '--radius-input': '0.5rem',
  '--radius': '0.5rem',
} as const;

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

/**
 * Transition duration tokens
 */
export type TransitionToken =
  | '--transition-fast'
  | '--transition-medium'
  | '--transition-slow';

/**
 * Transition duration values
 */
export const TRANSITIONS = {
  '--transition-fast': '0.2s',
  '--transition-medium': '0.3s',
  '--transition-slow': '0.5s',
} as const;

// ============================================================================
// ALL DESIGN TOKENS
// ============================================================================

/**
 * All design token types
 */
export type DesignToken =
  | ColorToken
  | FontFamilyToken
  | BorderRadiusToken
  | TransitionToken;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * CSS variable string format (e.g., "var(--primary)")
 */
export type CSSVar<T extends string> = `var(${T})`;

/**
 * HSL color value format (e.g., "hsl(var(--primary))")
 */
export type HSLVar<T extends SemanticColorToken> = `hsl(${CSSVar<T>})`;

/**
 * HSL color with opacity (e.g., "hsl(var(--primary) / 0.5)")
 */
export type HSLVarWithOpacity<T extends SemanticColorToken> = `hsl(${CSSVar<T>} / ${number})`;

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get CSS variable value from the DOM
 *
 * @param token - The CSS variable name
 * @param element - Optional element to get the value from (defaults to document.documentElement)
 * @returns The computed CSS variable value
 *
 * @example
 * ```ts
 * const primaryColor = getCSSVariable('--color-mm-primary');
 * // Returns: "#ef2f23"
 *
 * const cardBg = getCSSVariable('--card');
 * // Returns: "0 0% 100%" (light mode) or "0 0% 16%" (dark mode)
 * ```
 */
export function getCSSVariable(
  token: DesignToken,
  element: HTMLElement = document.documentElement
): string {
  return getComputedStyle(element).getPropertyValue(token).trim();
}

/**
 * Set CSS variable value on an element
 *
 * @param token - The CSS variable name
 * @param value - The value to set
 * @param element - Optional element to set the value on (defaults to document.documentElement)
 *
 * @example
 * ```ts
 * // Override primary color for specific element
 * setCSSVariable('--color-mm-primary', '#ff0000', myElement);
 * ```
 */
export function setCSSVariable(
  token: DesignToken,
  value: string,
  element: HTMLElement = document.documentElement
): void {
  element.style.setProperty(token, value);
}

/**
 * Get all brand colors as an object
 *
 * @returns Object with brand color names and their current values from the DOM
 *
 * @example
 * ```ts
 * const colors = getBrandColors();
 * // Returns: { primary: "#ef2f23", secondary: "#ff811c", ... }
 * ```
 */
export function getBrandColors(): Record<string, string> {
  return {
    primary: getCSSVariable('--color-mm-primary'),
    secondary: getCSSVariable('--color-mm-secondary'),
    dark: getCSSVariable('--color-mm-dark'),
    dark2: getCSSVariable('--color-mm-dark2'),
    white: getCSSVariable('--color-mm-white'),
    gray: getCSSVariable('--color-mm-gray'),
  };
}

/**
 * Convert HSL channel values to HSL string
 *
 * @param hslChannels - HSL values without "hsl()" wrapper (e.g., "4 86% 54%")
 * @returns Full HSL string (e.g., "hsl(4 86% 54%)")
 *
 * @example
 * ```ts
 * const primaryHSL = toHSLString(getCSSVariable('--primary'));
 * // Returns: "hsl(4 86% 54%)"
 * ```
 */
export function toHSLString(hslChannels: string): string {
  return `hsl(${hslChannels})`;
}

/**
 * Convert HSL channel values to HSL string with opacity
 *
 * @param hslChannels - HSL values without "hsl()" wrapper
 * @param opacity - Opacity value (0-1)
 * @returns HSL string with opacity (e.g., "hsl(4 86% 54% / 0.5)")
 *
 * @example
 * ```ts
 * const primaryWithOpacity = toHSLStringWithOpacity(getCSSVariable('--primary'), 0.5);
 * // Returns: "hsl(4 86% 54% / 0.5)"
 * ```
 */
export function toHSLStringWithOpacity(hslChannels: string, opacity: number): string {
  return `hsl(${hslChannels} / ${opacity})`;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if a string is a valid brand color token
 */
export function isBrandColorToken(token: string): token is BrandColorToken {
  return token in BRAND_COLORS;
}

/**
 * Check if a string is a valid font family token
 */
export function isFontFamilyToken(token: string): token is FontFamilyToken {
  return token in FONT_FAMILIES;
}

/**
 * Check if a string is a valid border radius token
 */
export function isBorderRadiusToken(token: string): token is BorderRadiusToken {
  return token in BORDER_RADII;
}

/**
 * Check if a string is a valid transition token
 */
export function isTransitionToken(token: string): token is TransitionToken {
  return token in TRANSITIONS;
}

// ============================================================================
// REACT/COMPONENT HELPERS
// ============================================================================

/**
 * React inline style object with design tokens
 *
 * @example
 * ```tsx
 * const styles: DesignTokenStyles = {
 *   backgroundColor: 'var(--color-mm-primary)',
 *   color: 'var(--color-mm-white)',
 *   borderRadius: 'var(--radius-mm)',
 *   transition: 'all var(--transition-medium) ease-out',
 * };
 *
 * <div style={styles}>Styled with tokens</div>
 * ```
 */
export interface DesignTokenStyles extends React.CSSProperties {
  backgroundColor?: CSSVar<ColorToken> | string;
  color?: CSSVar<ColorToken> | string;
  borderColor?: CSSVar<ColorToken> | string;
  borderRadius?: CSSVar<BorderRadiusToken> | string;
  fontFamily?: CSSVar<FontFamilyToken> | string;
  transition?: string;
}

/**
 * Props for components that accept design token overrides
 */
export interface DesignTokenProps {
  /**
   * CSS variable overrides
   */
  cssVariables?: Partial<Record<DesignToken, string>>;
}

// ============================================================================
// CONSTANTS EXPORT
// ============================================================================

/**
 * All design token constants in one object
 */
export const DESIGN_TOKENS = {
  colors: BRAND_COLORS,
  fonts: FONT_FAMILIES,
  radii: BORDER_RADII,
  transitions: TRANSITIONS,
} as const;

/**
 * Type representing all design token values
 */
export type DesignTokenValues = typeof DESIGN_TOKENS;
