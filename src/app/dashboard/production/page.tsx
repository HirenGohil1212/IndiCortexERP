'use client';

import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import * as React from 'react';

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';

// 3.1 Production Flow Details (BOM)
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

function ProductionFlowForm() {
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
  )
}

// 3.2 Production Routecard
const routecardSchema = z.object({
  batchNo: z.string().min(1),
  product: z.string().min(1),
  planQty: z.coerce.number().min(1),
  startDate: z.date(),
  endDate: z.date(),
});
type RoutecardValues = z.infer<typeof routecardSchema>;
function ProductionRoutecardForm() {
    const { toast } = useToast();
    const form = useForm<RoutecardValues>({ resolver: zodResolver(routecardSchema), defaultValues: { batchNo: '', product: '', planQty: 1, startDate: new Date(), endDate: new Date() }});
    function onSubmit(data: RoutecardValues) { console.log(data); toast({ title: "Routecard Created" }); form.reset(); }
    return <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader><CardTitle>New Production Routecard</CardTitle><CardDescription>Track the progress of a production batch.</CardDescription></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="grid gap-2"><Label>Route Card No</Label><Input disabled placeholder="Auto-generated" /></div>
            <FormField control={form.control} name="batchNo" render={({ field }) => (<FormItem><FormLabel>Batch No</FormLabel><FormControl><Input placeholder="Batch-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="product" render={({ field }) => (<FormItem><FormLabel>Product</FormLabel><FormControl><Input placeholder="Product Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="planQty" render={({ field }) => (<FormItem><FormLabel>Plan Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="startDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="endDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit">Create Routecard</Button></CardFooter>
    </form></Form></Card>
}

// 3.3 Material Issue
const materialIssueSchema = z.object({
    routeCardRef: z.string().min(1),
    item: z.string().min(1),
    qtyRequested: z.coerce.number().min(1),
    qtyIssued: z.coerce.number().min(1),
});
type MaterialIssueValues = z.infer<typeof materialIssueSchema>;
function MaterialIssueForm() {
    const { toast } = useToast();
    const form = useForm<MaterialIssueValues>({ resolver: zodResolver(materialIssueSchema), defaultValues: { routeCardRef: '', item: '', qtyRequested: 1, qtyIssued: 1 }});
    function onSubmit(data: MaterialIssueValues) { console.log(data); toast({ title: "Material Issued" }); form.reset(); }
    return <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader><CardTitle>Material Issue</CardTitle><CardDescription>Issue materials from inventory to the production floor.</CardDescription></CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4">
            <div className="grid gap-2"><Label>Issue ID</Label><Input disabled placeholder="Auto-generated" /></div>
            <FormField control={form.control} name="routeCardRef" render={({ field }) => (<FormItem><FormLabel>Route Card Ref</FormLabel><FormControl><Input placeholder="RC-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="item" render={({ field }) => (<FormItem><FormLabel>Item</FormLabel><FormControl><Input placeholder="Item Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="qtyRequested" render={({ field }) => (<FormItem><FormLabel>Qty Requested</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="qtyIssued" render={({ field }) => (<FormItem><FormLabel>Qty Issued</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit">Issue Material</Button></CardFooter>
    </form></Form></Card>
}

// 3.4 MTA (Material Transfer Acknowledgement)
const mtaSchema = z.object({
    fromDept: z.string().min(1),
    toDept: z.string().min(1),
    item: z.string().min(1),
    qty: z.coerce.number().min(1),
    receivedBy: z.string().min(1),
});
type MTAValues = z.infer<typeof mtaSchema>;
function MTAForm() {
    const { toast } = useToast();
    const form = useForm<MTAValues>({ resolver: zodResolver(mtaSchema), defaultValues: { fromDept: '', toDept: '', item: '', qty: 1, receivedBy: '' }});
    function onSubmit(data: MTAValues) { console.log(data); toast({ title: "MTA Created" }); form.reset(); }
    return <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader><CardTitle>Material Transfer Acknowledgement</CardTitle><CardDescription>Record inter-departmental material movement.</CardDescription></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="grid gap-2"><Label>MTA No</Label><Input disabled placeholder="Auto-generated" /></div>
            <FormField control={form.control} name="fromDept" render={({ field }) => (<FormItem><FormLabel>From Dept</FormLabel><FormControl><Input placeholder="e.g. Stores" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="toDept" render={({ field }) => (<FormItem><FormLabel>To Dept</FormLabel><FormControl><Input placeholder="e.g. Assembly" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="item" render={({ field }) => (<FormItem><FormLabel>Item</FormLabel><FormControl><Input placeholder="Item Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="qty" render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="receivedBy" render={({ field }) => (<FormItem><FormLabel>Received By</FormLabel><FormControl><Input placeholder="Employee Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit">Acknowledge Transfer</Button></CardFooter>
    </form></Form></Card>
}

// 3.5 Production Report
const productionReportSchema = z.object({
    date: z.date(),
    shift: z.string().min(1),
    machineNo: z.string().min(1),
    operator: z.string().min(1),
    productionQty: z.coerce.number().min(0),
    rejectionQty: z.coerce.number().min(0),
});
type ProductionReportValues = z.infer<typeof productionReportSchema>;
function ProductionReportForm() {
    const { toast } = useToast();
    const form = useForm<ProductionReportValues>({ resolver: zodResolver(productionReportSchema), defaultValues: { date: new Date(), shift: 'A', machineNo: '', operator: '', productionQty: 0, rejectionQty: 0 }});
    function onSubmit(data: ProductionReportValues) { console.log(data); toast({ title: "Production Logged" }); form.reset(); }
    return <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader><CardTitle>Daily Production Report</CardTitle><CardDescription>Log daily output and rejections.</CardDescription></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
            <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="shift" render={({ field }) => (<FormItem><FormLabel>Shift</FormLabel><FormControl><Input placeholder="e.g. A" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="machineNo" render={({ field }) => (<FormItem><FormLabel>Machine No</FormLabel><FormControl><Input placeholder="Machine ID" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="operator" render={({ field }) => (<FormItem><FormLabel>Operator</FormLabel><FormControl><Input placeholder="Operator Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="productionQty" render={({ field }) => (<FormItem><FormLabel>Production Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="rejectionQty" render={({ field }) => (<FormItem><FormLabel>Rejection Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Report</Button></CardFooter>
    </form></Form></Card>
}

// 3.6 Job Order (External)
const jobOrderSchema = z.object({
    contractor: z.string().min(1),
    itemSent: z.string().min(1),
    processRequired: z.string().min(1),
    rate: z.coerce.number().min(0),
});
type JobOrderValues = z.infer<typeof jobOrderSchema>;
function JobOrderForm() {
    const { toast } = useToast();
    const form = useForm<JobOrderValues>({ resolver: zodResolver(jobOrderSchema), defaultValues: { contractor: '', itemSent: '', processRequired: '', rate: 0 }});
    function onSubmit(data: JobOrderValues) { console.log(data); toast({ title: "Job Order Created" }); form.reset(); }
    return <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader><CardTitle>External Job Order</CardTitle><CardDescription>Outsource work to an external contractor.</CardDescription></CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4">
            <div className="grid gap-2"><Label>Job Order No</Label><Input disabled placeholder="Auto-generated" /></div>
            <FormField control={form.control} name="contractor" render={({ field }) => (<FormItem><FormLabel>Contractor</FormLabel><FormControl><Input placeholder="Contractor Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="itemSent" render={({ field }) => (<FormItem><FormLabel>Item Sent</FormLabel><FormControl><Input placeholder="Item Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="processRequired" render={({ field }) => (<FormItem><FormLabel>Process Required</FormLabel><FormControl><Input placeholder="e.g. Plating" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="rate" render={({ field }) => (<FormItem><FormLabel>Rate</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit">Create Job Order</Button></CardFooter>
    </form></Form></Card>
}

// 3.7 Challan Out
const challanOutSchema = z.object({
    jobOrderRef: z.string().min(1),
    item: z.string().min(1),
    qty: z.coerce.number().min(1),
    vehicleNo: z.string().min(1),
});
type ChallanOutValues = z.infer<typeof challanOutSchema>;
function ChallanOutForm() {
    const { toast } = useToast();
    const form = useForm<ChallanOutValues>({ resolver: zodResolver(challanOutSchema), defaultValues: { jobOrderRef: '', item: '', qty: 1, vehicleNo: '' }});
    function onSubmit(data: ChallanOutValues) { console.log(data); toast({ title: "Challan Created" }); form.reset(); }
    return <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader><CardTitle>Challan Out</CardTitle><CardDescription>Send materials out for external job work.</CardDescription></CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4">
            <div className="grid gap-2"><Label>Challan No</Label><Input disabled placeholder="Auto-generated" /></div>
            <FormField control={form.control} name="jobOrderRef" render={({ field }) => (<FormItem><FormLabel>Job Order Ref</FormLabel><FormControl><Input placeholder="JO-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="item" render={({ field }) => (<FormItem><FormLabel>Item</FormLabel><FormControl><Input placeholder="Item Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="qty" render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="vehicleNo" render={({ field }) => (<FormItem><FormLabel>Vehicle No</FormLabel><FormControl><Input placeholder="Vehicle Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit">Create Challan</Button></CardFooter>
    </form></Form></Card>
}

// 3.8 External GRN & IQC
const externalGRNSchema = z.object({
    challanRef: z.string().min(1),
    receivedQty: z.coerce.number().min(0),
    passedQty: z.coerce.number().min(0),
    rejectedQty: z.coerce.number().min(0),
});
type ExternalGRNValues = z.infer<typeof externalGRNSchema>;
function ExternalGRNForm() {
    const { toast } = useToast();
    const form = useForm<ExternalGRNValues>({ resolver: zodResolver(externalGRNSchema), defaultValues: { challanRef: '', receivedQty: 0, passedQty: 0, rejectedQty: 0 }});
    function onSubmit(data: ExternalGRNValues) { console.log(data); toast({ title: "External GRN Created" }); form.reset(); }
    return <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader><CardTitle>External GRN & IQC</CardTitle><CardDescription>Receive and inspect goods from external job work.</CardDescription></CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4">
            <div className="grid gap-2"><Label>GRN No</Label><Input disabled placeholder="Auto-generated" /></div>
            <FormField control={form.control} name="challanRef" render={({ field }) => (<FormItem><FormLabel>Challan Ref</FormLabel><FormControl><Input placeholder="CHN-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="receivedQty" render={({ field }) => (<FormItem><FormLabel>Received Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="passedQty" render={({ field }) => (<FormItem><FormLabel>Passed Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="rejectedQty" render={({ field }) => (<FormItem><FormLabel>Rejected Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit">Receive Goods</Button></CardFooter>
    </form></Form></Card>
}

// 3.9 Job Work Billbook
const jobWorkBillbookSchema = z.object({
    jobOrderRef: z.string().min(1),
    laborCharges: z.coerce.number().min(0),
    gst: z.coerce.number().min(0),
});
type JobWorkBillbookValues = z.infer<typeof jobWorkBillbookSchema>;
function JobWorkBillbookForm() {
    const { toast } = useToast();
    const form = useForm<JobWorkBillbookValues>({ resolver: zodResolver(jobWorkBillbookSchema), defaultValues: { jobOrderRef: '', laborCharges: 0, gst: 0 }});
    function onSubmit(data: JobWorkBillbookValues) { console.log(data); toast({ title: "Bill Logged" }); form.reset(); }
    return <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader><CardTitle>Job Work Billbook</CardTitle><CardDescription>Log a bill received from a contractor.</CardDescription></CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4">
            <div className="grid gap-2"><Label>Bill No</Label><Input disabled placeholder="Auto-generated" /></div>
            <FormField control={form.control} name="jobOrderRef" render={({ field }) => (<FormItem><FormLabel>Job Order Ref</FormLabel><FormControl><Input placeholder="JO-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="laborCharges" render={({ field }) => (<FormItem><FormLabel>Labor Charges</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="gst" render={({ field }) => (<FormItem><FormLabel>GST</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit">Log Bill</Button></CardFooter>
    </form></Form></Card>
}

// 3.10 Routecard Closure
const routecardClosureSchema = z.object({
    routeCardRef: z.string().min(1),
    finalFgQty: z.coerce.number().min(0),
    scrapGenerated: z.coerce.number().min(0),
    closureDate: z.date(),
});
type RoutecardClosureValues = z.infer<typeof routecardClosureSchema>;
function RoutecardClosureForm() {
    const { toast } = useToast();
    const form = useForm<RoutecardClosureValues>({ resolver: zodResolver(routecardClosureSchema), defaultValues: { routeCardRef: '', finalFgQty: 0, scrapGenerated: 0, closureDate: new Date() }});
    function onSubmit(data: RoutecardClosureValues) { console.log(data); toast({ title: "Routecard Closed" }); form.reset(); }
    return <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader><CardTitle>Routecard Closure</CardTitle><CardDescription>Finish a production batch and record final quantities.</CardDescription></CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4">
            <FormField control={form.control} name="routeCardRef" render={({ field }) => (<FormItem><FormLabel>Route Card Ref</FormLabel><FormControl><Input placeholder="RC-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="finalFgQty" render={({ field }) => (<FormItem><FormLabel>Final FG Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="scrapGenerated" render={({ field }) => (<FormItem><FormLabel>Scrap Generated</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="closureDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Closure Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Button type="submit">Close Routecard</Button></CardFooter>
    </form></Form></Card>
}


export default function ProductionPage() {

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Production Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="bom">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-10">
                <TabsTrigger value="bom">BOM</TabsTrigger>
                <TabsTrigger value="routecard">Routecard</TabsTrigger>
                <TabsTrigger value="material-issue">Material Issue</TabsTrigger>
                <TabsTrigger value="mta">MTA</TabsTrigger>
                <TabsTrigger value="prod-report">Prod. Report</TabsTrigger>
                <TabsTrigger value="job-order">Job Order</TabsTrigger>
                <TabsTrigger value="challan-out">Challan Out</TabsTrigger>
                <TabsTrigger value="external-grn">External GRN</TabsTrigger>
                <TabsTrigger value="job-bill">Job Bill</TabsTrigger>
                <TabsTrigger value="routecard-closure">Closure</TabsTrigger>
            </TabsList>
            <TabsContent value="bom" className="mt-4"><ProductionFlowForm /></TabsContent>
            <TabsContent value="routecard" className="mt-4"><ProductionRoutecardForm /></TabsContent>
            <TabsContent value="material-issue" className="mt-4"><MaterialIssueForm /></TabsContent>
            <TabsContent value="mta" className="mt-4"><MTAForm /></TabsContent>
            <TabsContent value="prod-report" className="mt-4"><ProductionReportForm /></TabsContent>
            <TabsContent value="job-order" className="mt-4"><JobOrderForm /></TabsContent>
            <TabsContent value="challan-out" className="mt-4"><ChallanOutForm /></TabsContent>
            <TabsContent value="external-grn" className="mt-4"><ExternalGRNForm /></TabsContent>
            <TabsContent value="job-bill" className="mt-4"><JobWorkBillbookForm /></TabsContent>
            <TabsContent value="routecard-closure" className="mt-4"><RoutecardClosureForm /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
