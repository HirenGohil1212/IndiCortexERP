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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';

// 2.1 Material Indent
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

function IndentForm() {
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
  );
}

// 2.2 Purchase Order
const poItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required."),
  quantity: z.coerce.number().min(1),
  rate: z.coerce.number().min(0),
  expectedDeliveryDate: z.date(),
});
const poSchema = z.object({
  vendorName: z.string().min(1, "Vendor name is required."),
  poDate: z.date(),
  validUntil: z.date(),
  items: z.array(poItemSchema).min(1),
});
type POFormValues = z.infer<typeof poSchema>;

function PurchaseOrderForm() {
  const { toast } = useToast();
  const form = useForm<POFormValues>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      vendorName: '',
      poDate: new Date(),
      validUntil: new Date(),
      items: [{ itemName: '', quantity: 1, rate: 0, expectedDeliveryDate: new Date() }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
  function onSubmit(data: POFormValues) { console.log(data); toast({ title: "Purchase Order Saved" }); form.reset(); }

  return (
    <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
      <CardHeader><CardTitle>New Purchase Order</CardTitle><CardDescription>Create an order to send to a vendor.</CardDescription></CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="grid gap-2"><Label>PO No</Label><Input disabled placeholder="Auto-generated" /></div>
          <FormField control={form.control} name="vendorName" render={({ field }) => (<FormItem><FormLabel>Vendor Name</FormLabel><FormControl><Input placeholder="Vendor Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="poDate" render={({ field }) => (<FormItem className="flex flex-col pt-2"><FormLabel>PO Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="validUntil" render={({ field }) => (<FormItem className="flex flex-col pt-2"><FormLabel>Valid Until</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Items</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Rate</TableHead><TableHead>Expected Delivery</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
              <TableBody>{fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell><FormField control={form.control} name={`items.${index}.itemName`} render={({ field }) => (<FormItem><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /></TableCell>
                  <TableCell><FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<FormItem><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} /></TableCell>
                  <TableCell><FormField control={form.control} name={`items.${index}.rate`} render={({ field }) => (<FormItem><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} /></TableCell>
                  <TableCell><FormField control={form.control} name={`items.${index}.expectedDeliveryDate`} render={({ field }) => (<FormItem><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} size="sm" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} /></TableCell>
                  <TableCell>{fields.length > 1 && (<Button variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>)}</TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ itemName: '', quantity: 1, rate: 0, expectedDeliveryDate: new Date() })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Purchase Order</Button></CardFooter>
    </form></Form></Card>
  )
}

// 2.3 Purchase Schedule
const purchaseScheduleSchema = z.object({
  poRef: z.string().min(1, "PO reference is required."),
  expectedDate: z.date(),
  followUpStatus: z.enum(["On-Time", "Delayed"]),
  remarks: z.string().optional(),
});
type PurchaseScheduleValues = z.infer<typeof purchaseScheduleSchema>;

function PurchaseScheduleForm() {
    const { toast } = useToast();
    const form = useForm<PurchaseScheduleValues>({
        resolver: zodResolver(purchaseScheduleSchema),
        defaultValues: { poRef: '', expectedDate: new Date(), followUpStatus: "On-Time", remarks: '' },
    });
    function onSubmit(data: PurchaseScheduleValues) { console.log(data); toast({ title: "Schedule Updated" }); form.reset(); }

    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Purchase Schedule</CardTitle><CardDescription>Track expected deliveries from vendors.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-4 gap-4 items-end">
                    <FormField control={form.control} name="poRef" render={({ field }) => (<FormItem><FormLabel>PO Reference</FormLabel><FormControl><Input placeholder="PO-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="expectedDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Expected Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="followUpStatus" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="On-Time">On-Time</SelectItem><SelectItem value="Delayed">Delayed</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="remarks" render={({ field }) => (<FormItem><FormLabel>Remarks</FormLabel><FormControl><Textarea placeholder="Add any follow-up notes..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Update Schedule</Button></CardFooter>
        </form></Form></Card>
    );
}

// 2.4 GRN (Goods Receipt Note)
const grnSchema = z.object({
    poRef: z.string().min(1, "PO reference is required."),
    vendorChallanNo: z.string().min(1, "Vendor challan no is required."),
    gateEntryDate: z.date(),
    vehicleNo: z.string().min(1, "Vehicle no is required."),
});
type GRNFormValues = z.infer<typeof grnSchema>;

function GoodsReceiptNoteForm() {
    const { toast } = useToast();
    const form = useForm<GRNFormValues>({ resolver: zodResolver(grnSchema), defaultValues: { poRef: '', vendorChallanNo: '', gateEntryDate: new Date(), vehicleNo: '' }});
    function onSubmit(data: GRNFormValues) { console.log(data); toast({ title: "GRN Created" }); form.reset(); }

    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Goods Receipt Note (GRN)</CardTitle><CardDescription>Record materials received at the gate.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4 items-end">
                <div className="grid gap-2"><Label>GRN No</Label><Input disabled placeholder="Auto-generated" /></div>
                <FormField control={form.control} name="poRef" render={({ field }) => (<FormItem><FormLabel>PO Reference</FormLabel><FormControl><Input placeholder="PO-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="vendorChallanNo" render={({ field }) => (<FormItem><FormLabel>Vendor Challan No</FormLabel><FormControl><Input placeholder="Vendor's Challan Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="gateEntryDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Gate Entry Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="vehicleNo" render={({ field }) => (<FormItem><FormLabel>Vehicle No</FormLabel><FormControl><Input placeholder="Vehicle Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Create GRN</Button></CardFooter>
        </form></Form></Card>
    );
}

// 2.5 IQC (Incoming Quality Control)
const iqcSchema = z.object({
  grnRef: z.string().min(1, "GRN Reference is required"),
  item: z.string().min(1, "Item is required"),
  totalQty: z.coerce.number().min(1),
  sampleSize: z.coerce.number().min(1),
  acceptedQty: z.coerce.number().min(0),
}).refine(data => data.acceptedQty <= data.totalQty, {
    message: "Accepted quantity cannot exceed total quantity.",
    path: ["acceptedQty"],
});
type IQCFormValues = z.infer<typeof iqcSchema>;

function IQCForm() {
    const { toast } = useToast();
    const form = useForm<IQCFormValues>({
        resolver: zodResolver(iqcSchema),
        defaultValues: { grnRef: '', item: '', totalQty: 1, sampleSize: 1, acceptedQty: 1 }
    });
    const totalQty = form.watch('totalQty');
    const acceptedQty = form.watch('acceptedQty');
    const rejectedQty = totalQty - acceptedQty;

    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Incoming Quality Control (IQC)</CardTitle><CardDescription>Perform quality check on received goods.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                     <FormField control={form.control} name="grnRef" render={({ field }) => (<FormItem><FormLabel>GRN Reference</FormLabel><FormControl><Input placeholder="GRN-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="item" render={({ field }) => (<FormItem><FormLabel>Item</FormLabel><FormControl><Input placeholder="Item Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <div className="grid md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="totalQty" render={({ field }) => (<FormItem><FormLabel>Total Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="sampleSize" render={({ field }) => (<FormItem><FormLabel>Sample Size</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="acceptedQty" render={({ field }) => (<FormItem><FormLabel>Accepted Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="grid gap-2"><Label>Rejected Qty</Label><Input disabled value={rejectedQty >= 0 ? rejectedQty : 0} /></div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save QC Report</Button></CardFooter>
        </form></Form></Card>
    );
}

// 2.6 Material Receipt
const materialReceiptSchema = z.object({
  grnRef: z.string().min(1, "GRN Reference is required."),
  storageLocation: z.string().min(1, "Storage location is required."),
  batchNo: z.string().min(1, "Batch number is required."),
});
type MaterialReceiptValues = z.infer<typeof materialReceiptSchema>;

function MaterialReceiptForm() {
    const { toast } = useToast();
    const form = useForm<MaterialReceiptValues>({ resolver: zodResolver(materialReceiptSchema), defaultValues: { grnRef: '', storageLocation: '', batchNo: '' }});
    function onSubmit(data: MaterialReceiptValues) { console.log(data); toast({ title: "Material Added to Stock" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Material Receipt</CardTitle><CardDescription>Add accepted goods into inventory stock.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                <div className="grid gap-2"><Label>Receipt ID</Label><Input disabled placeholder="Auto-generated" /></div>
                <FormField control={form.control} name="grnRef" render={({ field }) => (<FormItem><FormLabel>GRN Reference</FormLabel><FormControl><Input placeholder="GRN-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="storageLocation" render={({ field }) => (<FormItem><FormLabel>Storage Location</FormLabel><FormControl><Input placeholder="Rack A, Bin 1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="batchNo" render={({ field }) => (<FormItem><FormLabel>Batch No</FormLabel><FormControl><Input placeholder="Enter Batch Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Add to Stock</Button></CardFooter>
        </form></Form></Card>
    );
}

// 2.7 Purchase Billbook
const purchaseBillbookSchema = z.object({
  vendorInvoiceNo: z.string().min(1, "Invoice number is required."),
  invoiceDate: z.date(),
  taxableValue: z.coerce.number().min(0),
  gstAmount: z.coerce.number().min(0),
});
type PurchaseBillbookValues = z.infer<typeof purchaseBillbookSchema>;

function PurchaseBillbookForm() {
    const { toast } = useToast();
    const form = useForm<PurchaseBillbookValues>({ resolver: zodResolver(purchaseBillbookSchema), defaultValues: { vendorInvoiceNo: '', invoiceDate: new Date(), taxableValue: 0, gstAmount: 0 }});
    const { taxableValue, gstAmount } = form.watch();
    const total = (taxableValue || 0) + (gstAmount || 0);
    function onSubmit(data: PurchaseBillbookValues) { console.log(data); toast({ title: "Bill Logged" }); form.reset(); }

    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Purchase Billbook</CardTitle><CardDescription>Log a new invoice received from a vendor.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                 <div className="grid md:grid-cols-3 gap-4">
                    <div className="grid gap-2"><Label>Bill ID</Label><Input disabled placeholder="Auto-generated" /></div>
                    <FormField control={form.control} name="vendorInvoiceNo" render={({ field }) => (<FormItem><FormLabel>Vendor Invoice No.</FormLabel><FormControl><Input placeholder="Invoice Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="invoiceDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Invoice Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="taxableValue" render={({ field }) => (<FormItem><FormLabel>Taxable Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="gstAmount" render={({ field }) => (<FormItem><FormLabel>GST Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="grid gap-2"><Label>Total</Label><Input disabled value={total.toFixed(2)} /></div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Log Invoice</Button></CardFooter>
        </form></Form></Card>
    );
}

// 2.8 Voucher Payment
const voucherPaymentSchema = z.object({
  paymentDate: z.date(),
  vendor: z.string().min(1, "Vendor is required."),
  amount: z.coerce.number().min(0.01),
  bankAccount: z.string().min(1, "Bank account is required."),
});
type VoucherPaymentValues = z.infer<typeof voucherPaymentSchema>;

function VoucherPaymentForm() {
    const { toast } = useToast();
    const form = useForm<VoucherPaymentValues>({ resolver: zodResolver(voucherPaymentSchema), defaultValues: { paymentDate: new Date(), vendor: '', amount: 0, bankAccount: '' }});
    function onSubmit(data: VoucherPaymentValues) { console.log(data); toast({ title: "Payment Voucher Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Voucher Payment</CardTitle><CardDescription>Record a payment made to a vendor.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4 items-end">
                <div className="grid gap-2"><Label>Voucher No</Label><Input disabled placeholder="Auto-generated" /></div>
                <FormField control={form.control} name="paymentDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Payment Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="vendor" render={({ field }) => (<FormItem><FormLabel>Vendor</FormLabel><FormControl><Input placeholder="Vendor Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="amount" render={({ field }) => (<FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bankAccount" render={({ field }) => (<FormItem><FormLabel>Bank Account</FormLabel><FormControl><Input placeholder="Bank Name / Account" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Payment</Button></CardFooter>
        </form></Form></Card>
    );
}

export default function PurchasePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Purchase Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="material-indent">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-8">
            <TabsTrigger value="material-indent">Material Indent</TabsTrigger>
            <TabsTrigger value="purchase-order">Purchase Order</TabsTrigger>
            <TabsTrigger value="purchase-schedule">Purchase Schedule</TabsTrigger>
            <TabsTrigger value="grn">GRN</TabsTrigger>
            <TabsTrigger value="iqc">IQC</TabsTrigger>
            <TabsTrigger value="material-receipt">Material Receipt</TabsTrigger>
            <TabsTrigger value="billbook">Purchase Billbook</TabsTrigger>
            <TabsTrigger value="voucher-payment">Voucher Payment</TabsTrigger>
          </TabsList>
          <TabsContent value="material-indent" className="mt-4"><IndentForm /></TabsContent>
          <TabsContent value="purchase-order" className="mt-4"><PurchaseOrderForm /></TabsContent>
          <TabsContent value="purchase-schedule" className="mt-4"><PurchaseScheduleForm /></TabsContent>
          <TabsContent value="grn" className="mt-4"><GoodsReceiptNoteForm /></TabsContent>
          <TabsContent value="iqc" className="mt-4"><IQCForm /></TabsContent>
          <TabsContent value="material-receipt" className="mt-4"><MaterialReceiptForm /></TabsContent>
          <TabsContent value="billbook" className="mt-4"><PurchaseBillbookForm /></TabsContent>
          <TabsContent value="voucher-payment" className="mt-4"><VoucherPaymentForm /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
