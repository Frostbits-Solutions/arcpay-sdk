import { type VariantProps, cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'ap-inline-flex ap-items-center ap-justify-center ap-whitespace-nowrap ap-rounded-md ap-cursor-pointer ap-text-sm ap-font-medium ap-transition-colors focus-visible:ap-outline-none focus-visible:ap-ring-1 focus-visible:ap-ring-ring disabled:ap-pointer-events-none disabled:ap-opacity-50',
  {
    variants: {
      variant: {
        default: 'ap-bg-gradient ap-text-white ap-shadow hover:ap-bg-primary/90',
        destructive:
          'ap-bg-destructive ap-text-destructive-foreground ap-shadow-sm hover:ap-bg-destructive/90',
        outline:
          'ap-border ap-border-input ap-bg-background ap-shadow-sm hover:bg-accent hover:ap-text-accent-foreground',
        secondary:
          'ap-bg-secondary ap-text-secondary-foreground ap-shadow-sm hover:ap-bg-secondary/80',
        ghost: 'hover:ap-bg-accent hover:ap-text-accent-foreground',
        link: 'ap-text-primary ap-underline-offset-4 hover:ap-underline',
      },
      size: {
        default: 'ap-h-9 ap-px-4 ap-py-2',
        xs: 'ap-h-7 ap-rounded ap-px-2',
        sm: 'ap-h-8 ap-rounded-md ap-px-3 ap-text-xs',
        lg: 'ap-h-10 ap-rounded-2xl ap-px-8',
        icon: 'ap-h-9 ap-w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
