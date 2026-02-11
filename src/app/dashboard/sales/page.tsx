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

// 1.1 Inquiry Received
const inquiryItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  targetPrice: z.coerce.number().min(0, "Target price cannot be negative."),
});

const inquirySchema = z.object({
  customerName: z.string().min(1, "Customer name is required."),
  inquiryDate: z.date({
    required_error: "An inquiry date is required.",
  }),
  salesPerson: z.string(),
  status: z.enum(["New", "Processing", "Quoted", "Lost"]),
  items: z.array(inquiryItemSchema).min(1, "Please add at least one item."),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

function InquiryForm() {
  const { toast } = useToast();
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      customerName: '',
      inquiryDate: new Date(),
      salesPerson: "John Doe",
      status: 'New',
      items: [{ itemName: '', quantity: 1, targetPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function onSubmit(data: InquiryFormValues) {
    console.log(data);
    toast({
      title: "Inquiry Saved",
      description: "The new inquiry has been successfully saved.",
    });
    form.reset();
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>New Inquiry</CardTitle>
            <CardDescription>Enter the details for a new sales inquiry.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label>Inquiry No</Label>
                <Input disabled placeholder="Auto-generated" />
              </div>
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inquiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Inquiry Date</FormLabel>
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
              <div className="grid gap-2">
                <Label>Sales Person</Label>
                <Input disabled value={form.watch('salesPerson')} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Items</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-2/5">Item Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Target Price</TableHead>
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
                            name={`items.${index}.quantity`}
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
                          <FormField
                            control={form.control}
                            name={`items.${index}.targetPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" placeholder="0.00" {...field} />
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
                onClick={() => append({ itemName: '', quantity: 1, targetPrice: 0 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
               <FormMessage className="mt-2">{form.formState.errors.items?.message}</FormMessage>
            </div>
            
             <div className="grid md:grid-cols-4 gap-4">
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Quoted">Quoted</SelectItem>
                            <SelectItem value="Lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
             </div>

          </CardContent>
          <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Save Inquiry</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// 1.3 Quotation
const quotationItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  rate: z.coerce.number().min(0, "Rate cannot be negative."),
  gstPercent: z.coerce.number().min(0).max(100),
});
const quotationSchema = z.object({
  inquiryRef: z.string().min(1, "Inquiry reference is required."),
  validUntil: z.date(),
  paymentTerms: z.string().min(1, "Payment terms are required."),
  items: z.array(quotationItemSchema).min(1, "Please add at least one item."),
});
type QuotationFormValues = z.infer<typeof quotationSchema>;

function QuotationForm() {
  const { toast } = useToast();
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      inquiryRef: '',
      validUntil: new Date(),
      paymentTerms: '',
      items: [{ itemName: '', quantity: 1, rate: 0, gstPercent: 18 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
  const items = form.watch('items');
  const totals = items.map(item => {
    const itemTotal = item.quantity * item.rate;
    const gstAmount = itemTotal * (item.gstPercent / 100);
    return itemTotal + gstAmount;
  });

  function onSubmit(data: QuotationFormValues) {
    console.log(data);
    toast({ title: "Quotation Saved" });
    form.reset();
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>New Quotation</CardTitle>
            <CardDescription>Send a proposal to a customer.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-4 gap-4">
                <div className="grid gap-2">
                    <Label>Quote ID</Label>
                    <Input disabled placeholder="Auto-generated" />
                </div>
                <FormField control={form.control} name="inquiryRef" render={({ field }) => (
                    <FormItem><FormLabel>Inquiry Ref</FormLabel><FormControl><Input placeholder="INQ-001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="validUntil" render={({ field }) => (
                    <FormItem className="flex flex-col pt-2"><FormLabel>Valid Until</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="paymentTerms" render={({ field }) => (
                    <FormItem><FormLabel>Payment Terms</FormLabel><FormControl><Input placeholder="e.g. Net 30" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Items</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Rate</TableHead><TableHead>GST %</TableHead><TableHead>Total</TableHead><TableHead className="w-[50px]"></TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell><FormField control={form.control} name={`items.${index}.itemName`} render={({ field }) => (<FormItem><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /></TableCell>
                        <TableCell><FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<FormItem><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} /></TableCell>
                        <TableCell><FormField control={form.control} name={`items.${index}.rate`} render={({ field }) => (<FormItem><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} /></TableCell>
                        <TableCell><FormField control={form.control} name={`items.${index}.gstPercent`} render={({ field }) => (<FormItem><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} /></TableCell>
                        <TableCell><Input disabled value={totals[index]?.toFixed(2) || '0.00'} /></TableCell>
                        <TableCell>{fields.length > 1 && (<Button variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ itemName: '', quantity: 1, rate: 0, gstPercent: 18 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Quotation</Button></CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// 1.4 Receive Customer PO
const customerPOSchema = z.object({
  poNumber: z.string().min(1, "PO Number is required."),
  poDate: z.date(),
  poFile: z.any().optional(), // Using `any` for file uploads
  confirmedDeliveryDate: z.date(),
});
type CustomerPOFormValues = z.infer<typeof customerPOSchema>;

function CustomerPOForm() {
    const { toast } = useToast();
    const form = useForm<CustomerPOFormValues>({
        resolver: zodResolver(customerPOSchema),
        defaultValues: { poNumber: '', poDate: new Date(), confirmedDeliveryDate: new Date() }
    });
    function onSubmit(data: CustomerPOFormValues) {
        console.log(data);
        toast({ title: "Customer PO Received" });
        form.reset();
    }
    return (
        <Card>
            <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Receive Customer PO</CardTitle><CardDescription>Confirm a customer order.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-4 gap-4 items-end">
                    <FormField control={form.control} name="poNumber" render={({ field }) => (
                        <FormItem><FormLabel>PO Number</FormLabel><FormControl><Input placeholder="Customer's PO Number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="poDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>PO Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="poFile" render={({ field }) => (
                        <FormItem><FormLabel>PO File (Upload)</FormLabel><FormControl><Input type="file" onChange={e => field.onChange(e.target.files?.[0])} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="confirmedDeliveryDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Confirmed Delivery Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Confirm Order</Button></CardFooter>
            </form></Form>
        </Card>
    );
}

// 1.5 Sale Order (SO)
const saleOrderSchema = z.object({
  customerPoRef: z.string().min(1, "Customer PO reference is required."),
  billingAddress: z.string().min(1, "Billing address is required."),
  shippingAddress: z.string().min(1, "Shipping address is required."),
  status: z.enum(["Pending", "Dispatched", "Closed"]),
});
type SaleOrderFormValues = z.infer<typeof saleOrderSchema>;

function SaleOrderForm() {
    const { toast } = useToast();
    const form = useForm<SaleOrderFormValues>({
        resolver: zodResolver(saleOrderSchema),
        defaultValues: { customerPoRef: '', billingAddress: '', shippingAddress: '', status: 'Pending' }
    });
    function onSubmit(data: SaleOrderFormValues) { console.log(data); toast({ title: "Sale Order Created" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Sale Order</CardTitle><CardDescription>Lock inventory for a customer order.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="grid gap-2"><Label>SO No</Label><Input disabled placeholder="Auto-generated" /></div>
                    <FormField control={form.control} name="customerPoRef" render={({ field }) => (<FormItem><FormLabel>Customer PO Ref</FormLabel><FormControl><Input placeholder="Customer PO Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Dispatched">Dispatched</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="billingAddress" render={({ field }) => (<FormItem><FormLabel>Billing Address</FormLabel><FormControl><Textarea placeholder="Enter billing address" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="shippingAddress" render={({ field }) => (<FormItem><FormLabel>Shipping Address</FormLabel><FormControl><Textarea placeholder="Enter shipping address" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Create Sale Order</Button></CardFooter>
        </form></Form></Card>
    );
}

// 1.6 Sale Schedule & Dispatch Advice
const dispatchAdviceSchema = z.object({
  soRef: z.string().min(1, "Sale Order reference is required."),
  transporter: z.string().min(1, "Transporter is required."),
  vehicleNo: z.string().min(1, "Vehicle number is required."),
  driverName: z.string().min(1, "Driver name is required."),
});
type DispatchAdviceFormValues = z.infer<typeof dispatchAdviceSchema>;

function DispatchAdviceForm() {
    const { toast } = useToast();
    const form = useForm<DispatchAdviceFormValues>({ resolver: zodResolver(dispatchAdviceSchema), defaultValues: { soRef: '', transporter: '', vehicleNo: '', driverName: '' }});
    function onSubmit(data: DispatchAdviceFormValues) { console.log(data); toast({ title: "Dispatch Advice Created" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Dispatch Advice</CardTitle><CardDescription>Create a warehouse instruction for dispatch.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                <div className="grid gap-2"><Label>Dispatch ID</Label><Input disabled placeholder="Auto-generated" /></div>
                <FormField control={form.control} name="soRef" render={({ field }) => (<FormItem><FormLabel>SO Ref</FormLabel><FormControl><Input placeholder="SO-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="transporter" render={({ field }) => (<FormItem><FormLabel>Transporter</FormLabel><FormControl><Input placeholder="Transporter Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="vehicleNo" render={({ field }) => (<FormItem><FormLabel>Vehicle No</FormLabel><FormControl><Input placeholder="Vehicle Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input placeholder="Driver's Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Create Dispatch Advice</Button></CardFooter>
        </form></Form></Card>
    );
}

// 1.7 Invoice
const saleInvoiceSchema = z.object({
  date: z.date(),
  placeOfSupply: z.string().min(1, "Place of supply is required."),
  ewayBillNo: z.string().optional(),
  taxableValue: z.coerce.number().min(0),
  gstAmount: z.coerce.number().min(0),
  roundOff: z.coerce.number().optional(),
  grandTotal: z.coerce.number().min(0),
});
type SaleInvoiceFormValues = z.infer<typeof saleInvoiceSchema>;

function SaleInvoiceForm() {
    const { toast } = useToast();
    const form = useForm<SaleInvoiceFormValues>({ resolver: zodResolver(saleInvoiceSchema), defaultValues: { date: new Date(), placeOfSupply: '', taxableValue: 0, gstAmount: 0, grandTotal: 0 }});
    function onSubmit(data: SaleInvoiceFormValues) { console.log(data); toast({ title: "Invoice Generated" }); form.reset(); }
    const { taxableValue, gstAmount, roundOff } = form.watch();
    React.useEffect(() => {
        const total = (taxableValue || 0) + (gstAmount || 0) + (roundOff || 0);
        form.setValue('grandTotal', total);
    }, [taxableValue, gstAmount, roundOff, form]);
    
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Invoice</CardTitle><CardDescription>Generate a bill for a sale.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                 <div className="grid md:grid-cols-4 gap-4">
                    <div className="grid gap-2"><Label>Invoice No</Label><Input disabled placeholder="Auto-generated" /></div>
                    <FormField control={form.control} name="date" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="placeOfSupply" render={({ field }) => (<FormItem><FormLabel>Place of Supply</FormLabel><FormControl><Input placeholder="e.g. Mumbai" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="ewayBillNo" render={({ field }) => (<FormItem><FormLabel>E-Way Bill No</FormLabel><FormControl><Input placeholder="E-Way Bill Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 </div>
                 <div className="grid md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="taxableValue" render={({ field }) => (<FormItem><FormLabel>Taxable Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="gstAmount" render={({ field }) => (<FormItem><FormLabel>GST Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="roundOff" render={({ field }) => (<FormItem><FormLabel>Round Off</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="grandTotal" render={({ field }) => (<FormItem><FormLabel>Grand Total</FormLabel><FormControl><Input type="number" disabled {...field} /></FormControl><FormMessage /></FormItem>)} />
                 </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Generate Invoice</Button></CardFooter>
        </form></Form></Card>
    );
}

// 1.8 Automated Collection & Reminder System
const collectionAutomationSchema = z.object({
  reminderSettings: z.enum(["Strict", "Moderate", "Lenient"]),
});
type CollectionAutomationFormValues = z.infer<typeof collectionAutomationSchema>;
const communicationHistory = [
    { sentDate: "2023-05-24", channel: "Email", status: "Read" },
    { sentDate: "2023-05-27", channel: "WhatsApp", status: "Delivered" },
    { sentDate: "2023-05-31", channel: "Email", status: "Read" },
];

function CollectionAutomationForm() {
    const { toast } = useToast();
    const form = useForm<CollectionAutomationFormValues>({ resolver: zodResolver(collectionAutomationSchema), defaultValues: { reminderSettings: "Moderate" }});
    function onSubmit(data: CollectionAutomationFormValues) { console.log(data); toast({ title: "Settings Saved" }); }
    return (
      <div className='grid gap-4'>
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Automated Collection & Reminder</CardTitle><CardDescription>Configure automated payment reminders.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="grid gap-2"><Label>Credit Period (Days)</Label><Input disabled value="30 (from Customer Master)" /></div>
                    <div className="grid gap-2"><Label>Due Date</Label><Input disabled value="Auto-calculated" /></div>
                     <FormField control={form.control} name="reminderSettings" render={({ field }) => (<FormItem><FormLabel>Reminder Settings</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Strict">Strict</SelectItem><SelectItem value="Moderate">Moderate</SelectItem><SelectItem value="Lenient">Lenient</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Settings</Button></CardFooter>
        </form></Form></Card>
        <Card>
            <CardHeader><CardTitle>Communication History</CardTitle></CardHeader>
            <CardContent>
                <Table><TableHeader><TableRow><TableHead>Sent Date</TableHead><TableHead>Channel</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                    {communicationHistory.map((log, i) => <TableRow key={i}><TableCell>{log.sentDate}</TableCell><TableCell>{log.channel}</TableCell><TableCell>{log.status}</TableCell></TableRow>)}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    );
}

// 1.9 Voucher Receipt
const voucherReceiptSchema = z.object({
  date: z.date(),
  customer: z.string().min(1, "Customer is required."),
  amount: z.coerce.number().min(0.01),
  mode: z.enum(["Cheque", "NEFT"]),
  refNo: z.string().optional(),
});
type VoucherReceiptFormValues = z.infer<typeof voucherReceiptSchema>;

function VoucherReceiptForm() {
    const { toast } = useToast();
    const form = useForm<VoucherReceiptFormValues>({ resolver: zodResolver(voucherReceiptSchema), defaultValues: { date: new Date(), customer: '', amount: 0, mode: 'NEFT' }});
    function onSubmit(data: VoucherReceiptFormValues) { console.log(data); toast({ title: "Voucher Receipt Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Voucher Receipt</CardTitle><CardDescription>Record a payment received from a customer.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="grid gap-2"><Label>Receipt No</Label><Input disabled placeholder="Auto-generated" /></div>
                     <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="customer" render={({ field }) => (<FormItem><FormLabel>Customer</FormLabel><FormControl><Input placeholder="Customer Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="amount" render={({ field }) => (<FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                     <FormField control={form.control} name="mode" render={({ field }) => (<FormItem><FormLabel>Mode</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Cheque">Cheque</SelectItem><SelectItem value="NEFT">NEFT</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="refNo" render={({ field }) => (<FormItem><FormLabel>Ref No</FormLabel><FormControl><Input placeholder="Cheque/Transaction ID" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Receipt</Button></CardFooter>
        </form></Form></Card>
    );
}

export default function SalesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Sales Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="inquiry">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="inquiry">Inquiry</TabsTrigger>
            <TabsTrigger value="quotation">Quotation</TabsTrigger>
            <TabsTrigger value="customer-po">Customer PO</TabsTrigger>
            <TabsTrigger value="sale-order">Sale Order</TabsTrigger>
            <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="collection-automation">Collection Automation</TabsTrigger>
            <TabsTrigger value="voucher-receipt">Voucher Receipt</TabsTrigger>
          </TabsList>
          <TabsContent value="inquiry" className="mt-4"><InquiryForm /></TabsContent>
          <TabsContent value="quotation" className="mt-4"><QuotationForm /></TabsContent>
          <TabsContent value="customer-po" className="mt-4"><CustomerPOForm /></TabsContent>
          <TabsContent value="sale-order" className="mt-4"><SaleOrderForm /></TabsContent>
          <TabsContent value="dispatch" className="mt-4"><DispatchAdviceForm /></TabsContent>
          <TabsContent value="invoice" className="mt-4"><SaleInvoiceForm /></TabsContent>
          <TabsContent value="collection-automation" className="mt-4"><CollectionAutomationForm /></TabsContent>
          <TabsContent value="voucher-receipt" className="mt-4"><VoucherReceiptForm /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
