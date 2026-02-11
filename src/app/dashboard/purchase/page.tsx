'use client';

import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const indentItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required."),
  currentStock: z.coerce.number().nonnegative("Stock cannot be negative."),
  requestedQty: z.coerce.number().min(1, "Quantity must be at least 1."),
});

const indentSchema = z.object({
  requestDate: z.date({
    required_error: "A request date is required.",
  }),
  department: z.string().min(1, "Department is required."),
  priority: z.enum(["High", "Medium", "Low"]),
  items: z.array(indentItemSchema).min(1, "Please add at least one item."),
});

type IndentFormValues = z.infer<typeof indentSchema>;

export default function PurchasePage() {
  const { toast } = useToast();
  const form = useForm<IndentFormValues>({
    resolver: zodResolver(indentSchema),
    defaultValues: {
      requestDate: new Date(),
      department: '',
      priority: 'Medium',
      items: [{ itemName: '', currentStock: 0, requestedQty: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function onSubmit(data: IndentFormValues) {
    console.log(data);
    toast({
      title: "Indent Saved",
      description: "The new material indent has been successfully saved.",
    });
    form.reset();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Purchase Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>New Material Indent</CardTitle>
                <CardDescription>Create an internal request for materials.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label>Indent No</Label>
                    <Input disabled placeholder="Auto-generated" />
                  </div>
                  <FormField
                    control={form.control}
                    name="requestDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col pt-2">
                        <FormLabel>Request Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Production" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                             <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Items</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-2/5">Item Name</TableHead>
                          <TableHead>Current Stock</TableHead>
                          <TableHead>Requested Qty</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.itemName`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input placeholder="Product Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                               <FormField
                                control={form.control}
                                name={`items.${index}.currentStock`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input type="number" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.requestedQty`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input type="number" placeholder="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              {fields.length > 1 && (
                                <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => append({ itemName: '', currentStock: 0, requestedQty: 1 })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                   <FormMessage className="mt-2">{form.formState.errors.items?.message}</FormMessage>
                </div>

              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                  <Button type="submit">Save Indent</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}
