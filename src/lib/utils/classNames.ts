/**
 * Conditional class name utility for Tailwind CSS
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Build class names based on conditions
 */
export function classNames(
  ...classes: (string | Record<string, boolean | undefined | null> | undefined | null)[]
): string {
  const result: string[] = [];

  for (const cls of classes) {
    if (!cls) continue;

    if (typeof cls === 'string') {
      result.push(cls);
    } else if (typeof cls === 'object') {
      for (const [key, value] of Object.entries(cls)) {
        if (value) {
          result.push(key);
        }
      }
    }
  }

  return result.join(' ');
}

/**
 * Create a variant-based class name utility
 */
export function variant<T extends Record<string, Record<string, string>>>(
  variants: T,
  defaultVariant?: keyof T
) {
  return (variant: keyof T = defaultVariant ?? (Object.keys(variants)[0] as keyof T)) => {
    return variants[variant] || '';
  };
}
