# UI Component Patterns

## Radix UI + Tailwind (shadcn/ui Style)

### Component Structure
```
src/components/ui/
├── avatar.tsx
├── button.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── form.tsx
├── input.tsx
├── label.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── sidebar.tsx
├── table.tsx
├── tabs.tsx
├── toast.tsx (sonner)
├── tooltip.tsx
└── ... 40+ components
```

### Common Patterns

#### Compound Components (Radix)
```tsx
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader>
    <DialogContent>...</DialogContent>
    <DialogFooter>...</DialogFooter>
  </DialogContent>
</Dialog>
```

#### ClassName Merging
```tsx
import { cn } from "@/lib/utils"

<Button className={cn("base-classes", condition && "conditional-classes")} />
```

#### Forward Ref for Composition
```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn(buttonStyles, className)} {...props} />
  )
)
Button.displayName = "Button"
```

#### Variants with CVA
```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva("inline-flex items-center justify-center", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      outline: "border border-input bg-background",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
})
```

## Table Pattern (TanStack Table)
```tsx
const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.getValue("status")}</Badge> },
]

const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

<table>
  <thead>{table.getHeaderGroups().map(hg => <tr>{hg.headers.map(h => <th>{h.render()}</th>)}</tr>)}</thead>
  <tbody>{table.getRowModel().rows.map(row => <tr>{row.getVisibleCells().map(cell => <td>{cell.render()}</td>)}</tr>)}</tbody>
</table>
```

## Form Pattern (React Hook Form + Zod)
```tsx
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: "", agentId: "" }
})

<Form {...form}>
  <FormField name="name" render={({ field }) => (
    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
  )} />
  <Button type="submit" disabled={form.formState.isSubmitting}>Save</Button>
</Form>
```

## Sheet (Mobile Drawer)
```tsx
<Sheet>
  <SheetTrigger asChild><Button>Open</Button></SheetTrigger>
  <SheetContent side="right">Content</SheetContent>
</Sheet>
```

## Tooltip
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild><Button>Hover me</Button></TooltipTrigger>
    <TooltipContent>Tooltip text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Icons
- Lucide React: `import { VideoIcon, BotIcon } from "lucide-react"`
- Used in sidebar, buttons, headers

## Styling
- Tailwind CSS 4 (CSS variables in `globals.css`)
- `cn()` utility: `clsx` + `tailwind-merge`
- Dark mode via `next-themes` + CSS variables
- Radix CSS variables for component theming