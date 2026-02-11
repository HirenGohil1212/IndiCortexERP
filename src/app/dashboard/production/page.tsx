'use client';

import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2 } from 'lucide-react';

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const rawMaterialSchema = z.object({
  itemName: z.string().min(1, "Item name is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
});

const productionFlowSchema = z.object({
  finishedGood: z.string().min(1, "Finished good name is required."),
  processName: z.string().min(1, "Process name is required."),
  machine: z.string().min(1, "Machine is required."),
  outputQty: z.coerce.number().min(1, "Output quantity must be at least 1."),
  rawMaterials: z.array(rawMaterialSchema).min(1, "Please add at least one raw material."),
});

type ProductionFlowFormValues = z.infer<typeof productionFlowSchema>;

export default function ProductionPage() {
  const { toast } = useToast();
  const form = useForm<ProductionFlowFormValues>({
    resolver: zodResolver(productionFlowSchema),
    defaultValues: {
      finishedGood: '',
      processName: '',
      machine: '',
      outputQty: 1,
      rawMaterials: [{ itemName: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rawMaterials",
  });

  function onSubmit(data: ProductionFlowFormValues) {
    console.log(data);
    toast({
      title: "Production Flow Saved",
      description: "The new production flow has been successfully saved.",
    });
    form.reset();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Production Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Production Flow Details (BOM)</CardTitle>
                <CardDescription>Define a process with its required raw materials (Bill of Materials).</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="finishedGood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Finished Good</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Assembled Widget" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="processName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Process Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cutting" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="machine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Machine</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. CNC Machine" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="outputQty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Output Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Raw Material Input</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-4/5">Raw Material Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`rawMaterials.${index}.itemName`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input placeholder="Component or Material Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                               <FormField
                                control={form.control}
                                name={`rawMaterials.${index}.quantity`}
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
                    onClick={() => append({ itemName: '', quantity: 1 })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Raw Material
                  </Button>
                   <FormMessage className="mt-2">{form.formState.errors.rawMaterials?.message}</FormMessage>
                </div>

              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                  <Button type="submit">Save Production Flow</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}
