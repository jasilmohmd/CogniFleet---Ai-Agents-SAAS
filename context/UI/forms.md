# Form Patterns

## Stack
- React Hook Form (form state)
- Zod (validation)
- @hookform/resolvers/zod (integration)
- Radix UI Form components (UI)

## Basic Setup
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { schema } from "@/modules/module/schema"

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { field1: "", field2: "" }
})
```

## Form Components (shadcn/ui)
```tsx
<Form {...form}>
  <FormField
    name="field1"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input placeholder="..." {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    name="field2"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Select</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
          <SelectContent>
            <SelectItem value="opt1">Option 1</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
  <Button type="submit" disabled={form.formState.isSubmitting}>
    Submit
  </Button>
</Form>
```

## Dialog Form Pattern
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader><DialogTitle>Create</DialogTitle></DialogHeader>
    <Form {...form}>
      {/* fields */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>Create</Button>
      </DialogFooter>
    </Form>
  </DialogContent>
</Dialog>
```

## Submission Handling
```tsx
const mutation = trpc.module.create.useMutation({
  onSuccess: () => {
    setOpen(false)
    form.reset()
    queryClient.invalidateQueries({ queryKey: trpc.module.getMany.queryKey() })
  }
})

const onSubmit = (values) => mutation.mutate(values)

<Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
```

## Common Fields
| Field Type | Component |
|------------|-----------|
| Text | `<Input {...field} />` |
| Textarea | `<Textarea {...field} />` |
| Select | `<Select>...</Select>` |
| Checkbox | `<Checkbox checked={field.value} onCheckedChange={field.onChange} />` |
| Switch | `<Switch checked={field.value} onCheckedChange={field.onChange} />` |
| Date | `<DatePicker />` (react-day-picker) |

## Validation
- Schema defined in `module/schema.ts`
- Reused for tRPC input validation + form validation
- Error messages in Zod schema: `{ message: "..." }`
- Displayed via `<FormMessage />`

## Patterns
- Co-locate schema with module
- Reuse schema for API + form
- Dialog forms for create/edit
- Reset form on success
- Invalidate queries on mutation success
- Disable submit during mutation