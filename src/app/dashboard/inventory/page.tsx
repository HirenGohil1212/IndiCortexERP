'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// 10.1 Warehouse Master
const warehouseMasterSchema = z.object({
  name: z.string().min(1, "Warehouse name is required."),
  address: z.string().min(1, "Address is required."),
  managerName: z.string().min(1, "Manager name is required."),
});
type WarehouseMasterValues = z.infer<typeof warehouseMasterSchema>;

function WarehouseMasterForm() {
    const { toast } = useToast();
    const form = useForm<WarehouseMasterValues>({
        resolver: zodResolver(warehouseMasterSchema),
        defaultValues: { name: '', address: '', managerName: '' }
    });
    function onSubmit(data: WarehouseMasterValues) {
        console.log(data);
        toast({ title: "Warehouse Saved" });
        form.reset();
    }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Warehouse</CardTitle><CardDescription>Add a new warehouse to the master list.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="grid gap-2"><Label>Warehouse ID</Label><Input disabled placeholder="Auto-generated" /></div>
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g. Main Warehouse" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="managerName" render={({ field }) => (<FormItem><FormLabel>Manager Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Textarea placeholder="Enter full address" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Warehouse</Button></CardFooter>
        </form></Form></Card>
    )
}

// 10.2 Warehouse Opening
const warehouseOpeningSchema = z.object({
  itemName: z.string().min(1, "Item name is required."),
  openingQty: z.coerce.number().min(0, "Quantity cannot be negative."),
  value: z.coerce.number().min(0, "Value cannot be negative."),
  date: z.date(),
});
type WarehouseOpeningValues = z.infer<typeof warehouseOpeningSchema>;

function WarehouseOpeningForm() {
    const { toast } = useToast();
    const form = useForm<WarehouseOpeningValues>({
        resolver: zodResolver(warehouseOpeningSchema),
        defaultValues: { itemName: '', openingQty: 0, value: 0, date: new Date() }
    });
    function onSubmit(data: WarehouseOpeningValues) { console.log(data); toast({ title: "Opening Stock Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Warehouse Opening Stock</CardTitle><CardDescription>Set up the initial stock for an item.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <FormField control={form.control} name="itemName" render={({ field }) => (<FormItem><FormLabel>Item Name</FormLabel><FormControl><Input placeholder="Select Item" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="openingQty" render={({ field }) => (<FormItem><FormLabel>Opening Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="value" render={({ field }) => (<FormItem><FormLabel>Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Opening Stock</Button></CardFooter>
        </form></Form></Card>
    );
}

// 10.3 Dispatch SRV (Service Voucher)
const dispatchSrvSchema = z.object({
  date: z.date(),
  partyName: z.string().min(1, "Party name is required."),
  item: z.string().min(1, "Item name is required."),
  qty: z.coerce.number().min(1, "Quantity must be at least 1."),
  returnExpected: z.enum(["Yes", "No"]),
});
type DispatchSrvValues = z.infer<typeof dispatchSrvSchema>;

function DispatchSrvForm() {
    const { toast } = useToast();
    const form = useForm<DispatchSrvValues>({
        resolver: zodResolver(dispatchSrvSchema),
        defaultValues: { date: new Date(), partyName: '', item: '', qty: 1, returnExpected: 'Yes' }
    });
    function onSubmit(data: DispatchSrvValues) { console.log(data); toast({ title: "SRV Created" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Dispatch SRV (Service Voucher)</CardTitle><CardDescription>Create a non-sales dispatch, like a returnable gate pass.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="grid gap-2"><Label>SRV No</Label><Input disabled placeholder="Auto-generated" /></div>
                    <FormField control={form.control} name="date" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="partyName" render={({ field }) => (<FormItem><FormLabel>Party Name</FormLabel><FormControl><Input placeholder="Recipient's Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="item" render={({ field }) => (<FormItem><FormLabel>Item</FormLabel><FormControl><Input placeholder="Item being dispatched" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="qty" render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="returnExpected" render={({ field }) => (
                        <FormItem><FormLabel>Return Expected?</FormLabel><FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Create SRV</Button></CardFooter>
        </form></Form></Card>
    );
}

// 10.4 Store/Warehouse Stock Transfer
const stockTransferSchema = z.object({
  fromWarehouse: z.string().min(1, "Source warehouse is required."),
  toWarehouse: z.string().min(1, "Destination warehouse is required."),
  item: z.string().min(1, "Item is required."),
  qty: z.coerce.number().min(1, "Quantity must be at least 1."),
});
type StockTransferValues = z.infer<typeof stockTransferSchema>;

function StockTransferForm() {
    const { toast } = useToast();
    const form = useForm<StockTransferValues>({ resolver: zodResolver(stockTransferSchema), defaultValues: { fromWarehouse: '', toWarehouse: '', item: '', qty: 1 }});
    function onSubmit(data: StockTransferValues) { console.log(data); toast({ title: "Stock Transfer Initiated" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Warehouse Stock Transfer</CardTitle><CardDescription>Move stock between two warehouses.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="grid gap-2"><Label>Transfer ID</Label><Input disabled placeholder="Auto-generated" /></div>
                <FormField control={form.control} name="fromWarehouse" render={({ field }) => (<FormItem><FormLabel>From Warehouse</FormLabel><FormControl><Input placeholder="Select Source" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="toWarehouse" render={({ field }) => (<FormItem><FormLabel>To Warehouse</FormLabel><FormControl><Input placeholder="Select Destination" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="item" render={({ field }) => (<FormItem><FormLabel>Item</FormLabel><FormControl><Input placeholder="Item to Transfer" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="qty" render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Initiate Transfer</Button></CardFooter>
        </form></Form></Card>
    );
}

// 10.5 Warehouse Material Receipt
const warehouseMaterialReceiptSchema = z.object({
  sourceDocRef: z.string().min(1, "Source document is required."),
  item: z.string().min(1, "Item is required."),
  qtyReceived: z.coerce.number().min(1, "Quantity must be at least 1."),
});
type WarehouseMaterialReceiptValues = z.infer<typeof warehouseMaterialReceiptSchema>;

function WarehouseMaterialReceiptForm() {
    const { toast } = useToast();
    const form = useForm<WarehouseMaterialReceiptValues>({ resolver: zodResolver(warehouseMaterialReceiptSchema), defaultValues: { sourceDocRef: '', item: '', qtyReceived: 1 }});
    function onSubmit(data: WarehouseMaterialReceiptValues) { console.log(data); toast({ title: "Material Received" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Warehouse Material Receipt</CardTitle><CardDescription>Receive transferred or returned material.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="grid gap-2"><Label>Receipt ID</Label><Input disabled placeholder="Auto-generated" /></div>
                <FormField control={form.control} name="sourceDocRef" render={({ field }) => (<FormItem><FormLabel>Source Doc Ref</FormLabel><FormControl><Input placeholder="e.g. Transfer ID, SRV No" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="item" render={({ field }) => (<FormItem><FormLabel>Item</FormLabel><FormControl><Input placeholder="Item Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="qtyReceived" render={({ field }) => (<FormItem><FormLabel>Qty Received</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Receive Material</Button></CardFooter>
        </form></Form></Card>
    );
}


export default function InventoryPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Warehouse Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="warehouse-master">
          <ScrollArea>
            <TabsList>
              <TabsTrigger value="warehouse-master">Warehouse Master</TabsTrigger>
              <TabsTrigger value="opening-stock">Opening Stock</TabsTrigger>
              <TabsTrigger value="dispatch-srv">Dispatch SRV</TabsTrigger>
              <TabsTrigger value="stock-transfer">Stock Transfer</TabsTrigger>
              <TabsTrigger value="material-receipt">Material Receipt</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="warehouse-master" className="mt-4">
            <WarehouseMasterForm />
          </TabsContent>
          <TabsContent value="opening-stock" className="mt-4">
            <WarehouseOpeningForm />
          </TabsContent>
          <TabsContent value="dispatch-srv" className="mt-4">
            <DispatchSrvForm />
          </TabsContent>
          <TabsContent value="stock-transfer" className="mt-4">
            <StockTransferForm />
          </TabsContent>
          <TabsContent value="material-receipt" className="mt-4">
            <WarehouseMaterialReceiptForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
