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

// 6.1 Transport Master
const transportMasterSchema = z.object({
  transporterName: z.string().min(1, "Transporter name is required."),
  ownerName: z.string().min(1, "Owner name is required."),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits."),
  gstin: z.string().min(15, "GSTIN must be 15 characters.").max(15, "GSTIN must be 15 characters."),
});
type TransportMasterValues = z.infer<typeof transportMasterSchema>;

function TransportMasterForm() {
    const { toast } = useToast();
    const form = useForm<TransportMasterValues>({
        resolver: zodResolver(transportMasterSchema),
        defaultValues: { transporterName: '', ownerName: '', mobile: '', gstin: '' }
    });
    function onSubmit(data: TransportMasterValues) {
        console.log(data);
        toast({ title: "Transporter Saved" });
        form.reset();
    }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Transporter</CardTitle><CardDescription>Add a new transporter to the master list.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                <FormField control={form.control} name="transporterName" render={({ field }) => (<FormItem><FormLabel>Transporter Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="ownerName" render={({ field }) => (<FormItem><FormLabel>Owner Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="mobile" render={({ field }) => (<FormItem><FormLabel>Mobile</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="gstin" render={({ field }) => (<FormItem><FormLabel>GSTIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Transporter</Button></CardFooter>
        </form></Form></Card>
    )
}

// 6.2 Transport Order
const transportOrderSchema = z.object({
  transporter: z.string().min(1, "Transporter is required."),
  pickupDate: z.date(),
  destination: z.string().min(1, "Destination is required."),
  vehicleType: z.string().min(1, "Vehicle type is required."),
});
type TransportOrderValues = z.infer<typeof transportOrderSchema>;

function TransportOrderForm() {
    const { toast } = useToast();
    const form = useForm<TransportOrderValues>({
        resolver: zodResolver(transportOrderSchema),
        defaultValues: { transporter: '', pickupDate: new Date(), destination: '', vehicleType: '' }
    });
    function onSubmit(data: TransportOrderValues) { console.log(data); toast({ title: "Transport Order Created" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Transport Order</CardTitle><CardDescription>Book a truck for a shipment.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                 <div className="grid gap-2"><Label>Order No</Label><Input disabled placeholder="Auto-generated" /></div>
                 <FormField control={form.control} name="transporter" render={({ field }) => (<FormItem><FormLabel>Transporter</FormLabel><FormControl><Input placeholder="Select Transporter" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="pickupDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Pickup Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="destination" render={({ field }) => (<FormItem><FormLabel>Destination</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="vehicleType" render={({ field }) => (<FormItem><FormLabel>Vehicle Type</FormLabel><FormControl><Input placeholder="e.g. 20ft Container" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Create Order</Button></CardFooter>
        </form></Form></Card>
    );
}

// 6.3 Challan Out (Logistics)
const challanItemSchema = z.object({
    itemName: z.string().min(1, "Item name is required."),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
});
const challanOutLogisticsSchema = z.object({
  transportOrderRef: z.string().min(1, "Transport order reference is required."),
  items: z.array(challanItemSchema).min(1, "Please add at least one item."),
});
type ChallanOutLogisticsValues = z.infer<typeof challanOutLogisticsSchema>;

function ChallanOutForm() {
    const { toast } = useToast();
    const form = useForm<ChallanOutLogisticsValues>({
        resolver: zodResolver(challanOutLogisticsSchema),
        defaultValues: {
            transportOrderRef: '',
            items: [{ itemName: '', quantity: 1 }]
        }
    });
    const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
    function onSubmit(data: ChallanOutLogisticsValues) { console.log(data); toast({ title: "Challan Created" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Challan Out</CardTitle><CardDescription>Create a delivery document.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="grid gap-2"><Label>Challan No</Label><Input disabled placeholder="Auto-generated" /></div>
                    <FormField control={form.control} name="transportOrderRef" render={({ field }) => (<FormItem><FormLabel>Transport Order Ref</FormLabel><FormControl><Input placeholder="TO-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <div>
                    <h3 className="text-lg font-medium mb-2">Item List</h3>
                    <div className="rounded-md border">
                        <Table>
                        <TableHeader><TableRow><TableHead>Item Name</TableHead><TableHead>Quantity</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
                        <TableBody>{fields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell><FormField control={form.control} name={`items.${index}.itemName`} render={({ field }) => (<FormItem><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /></TableCell>
                                <TableCell><FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<FormItem><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} /></TableCell>
                                <TableCell>{fields.length > 1 && (<Button variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>)}</TableCell>
                            </TableRow>
                        ))}</TableBody>
                        </Table>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ itemName: '', quantity: 1 })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Create Challan</Button></CardFooter>
        </form></Form></Card>
    );
}

// 6.4 Freight Billbook
const freightBillbookSchema = z.object({
    date: z.date(),
    lrNo: z.string().min(1, "LR No is required."),
    freightAmount: z.coerce.number().min(0),
    gst: z.coerce.number().min(0),
});
type FreightBillbookValues = z.infer<typeof freightBillbookSchema>;

function FreightBillbookForm() {
    const { toast } = useToast();
    const form = useForm<FreightBillbookValues>({
        resolver: zodResolver(freightBillbookSchema),
        defaultValues: { date: new Date(), lrNo: '', freightAmount: 0, gst: 0 }
    });
    const totalPayable = (form.watch('freightAmount') || 0) + (form.watch('gst') || 0);

    function onSubmit(data: FreightBillbookValues) { console.log(data); toast({ title: "Freight Bill Logged" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Freight Billbook</CardTitle><CardDescription>Log an invoice from a transporter.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-5 gap-4">
                <div className="grid gap-2"><Label>Bill No</Label><Input disabled placeholder="Auto-generated" /></div>
                <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="lrNo" render={({ field }) => (<FormItem><FormLabel>LR No</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="freightAmount" render={({ field }) => (<FormItem><FormLabel>Freight Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="gst" render={({ field }) => (<FormItem><FormLabel>GST</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid gap-2"><Label>Total Payable</Label><Input disabled value={totalPayable.toFixed(2)} /></div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Log Bill</Button></CardFooter>
        </form></Form></Card>
    );
}

export default function LogisticsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Logistics Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="transport-master">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transport-master">Transport Master</TabsTrigger>
            <TabsTrigger value="transport-order">Transport Order</TabsTrigger>
            <TabsTrigger value="challan-out">Challan Out</TabsTrigger>
            <TabsTrigger value="freight-billbook">Freight Billbook</TabsTrigger>
          </TabsList>
          <TabsContent value="transport-master" className="mt-4">
            <TransportMasterForm />
          </TabsContent>
          <TabsContent value="transport-order" className="mt-4">
            <TransportOrderForm />
          </TabsContent>
          <TabsContent value="challan-out" className="mt-4">
            <ChallanOutForm />
          </TabsContent>
          <TabsContent value="freight-billbook" className="mt-4">
            <FreightBillbookForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
