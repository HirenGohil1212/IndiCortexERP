'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import * as React from 'react';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// 11.1 Fix Asset Master
const fixAssetMasterSchema = z.object({
  name: z.string().min(1, "Asset name is required."),
  group: z.enum(["IT", "Plant", "Furniture"]),
  purchaseDate: z.date(),
  value: z.coerce.number().min(0, "Value cannot be negative."),
});
type FixAssetMasterValues = z.infer<typeof fixAssetMasterSchema>;

function FixAssetMasterForm() {
    const { toast } = useToast();
    const form = useForm<FixAssetMasterValues>({
        resolver: zodResolver(fixAssetMasterSchema),
        defaultValues: { name: '', group: 'Plant', purchaseDate: new Date(), value: 0 }
    });
    function onSubmit(data: FixAssetMasterValues) {
        console.log(data);
        toast({ title: "Asset Saved" });
        form.reset();
    }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Fixed Asset</CardTitle><CardDescription>Add a new asset to the master list.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="grid gap-2"><Label>Asset Tag</Label><Input disabled placeholder="Auto-generated" /></div>
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g. Dell Laptop" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="group" render={({ field }) => (
                    <FormItem><FormLabel>Group</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="IT">IT</SelectItem><SelectItem value="Plant">Plant & Machinery</SelectItem><SelectItem value="Furniture">Furniture</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="purchaseDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Purchase Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="value" render={({ field }) => (<FormItem><FormLabel>Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Asset</Button></CardFooter>
        </form></Form></Card>
    )
}

// 11.2 Asset Addition Memo
const assetAdditionSchema = z.object({
  assetRef: z.string().min(1, "Asset reference is required."),
  invoiceRef: z.string().min(1, "Invoice reference is required."),
  installationDate: z.date(),
  depreciationRate: z.coerce.number().min(0, "Rate must be positive.").max(100, "Rate cannot exceed 100."),
});
type AssetAdditionValues = z.infer<typeof assetAdditionSchema>;

function AssetAdditionMemoForm() {
    const { toast } = useToast();
    const form = useForm<AssetAdditionValues>({
        resolver: zodResolver(assetAdditionSchema),
        defaultValues: { assetRef: '', invoiceRef: '', installationDate: new Date(), depreciationRate: 15 }
    });
    function onSubmit(data: AssetAdditionValues) { console.log(data); toast({ title: "Asset Addition Memo Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Asset Addition Memo</CardTitle><CardDescription>Log the addition of a new asset.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <FormField control={form.control} name="assetRef" render={({ field }) => (<FormItem><FormLabel>Asset Ref</FormLabel><FormControl><Input placeholder="Select Asset" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="invoiceRef" render={({ field }) => (<FormItem><FormLabel>Invoice Ref</FormLabel><FormControl><Input placeholder="Purchase Invoice No" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="installationDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Installation Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="depreciationRate" render={({ field }) => (<FormItem><FormLabel>Depreciation Rate (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Memo</Button></CardFooter>
        </form></Form></Card>
    );
}

// 11.3 Asset Allocation Master
const assetAllocationSchema = z.object({
  assetTag: z.string().min(1, "Asset tag is required."),
  employeeName: z.string().min(1, "Employee name is required."),
  department: z.string().min(1, "Department is required."),
  dateAssigned: z.date(),
});
type AssetAllocationValues = z.infer<typeof assetAllocationSchema>;

function AssetAllocationMasterForm() {
    const { toast } = useToast();
    const form = useForm<AssetAllocationValues>({
        resolver: zodResolver(assetAllocationSchema),
        defaultValues: { assetTag: '', employeeName: '', department: '', dateAssigned: new Date() }
    });
    function onSubmit(data: AssetAllocationValues) { console.log(data); toast({ title: "Asset Allocated" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Asset Allocation</CardTitle><CardDescription>Assign an asset to a user or department.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <FormField control={form.control} name="assetTag" render={({ field }) => (<FormItem><FormLabel>Asset Tag</FormLabel><FormControl><Input placeholder="Select Asset" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="employeeName" render={({ field }) => (<FormItem><FormLabel>Employee Name</FormLabel><FormControl><Input placeholder="Select Employee" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="department" render={({ field }) => (<FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g. IT, Sales" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="dateAssigned" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Date Assigned</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Allocate Asset</Button></CardFooter>
        </form></Form></Card>
    );
}

// 11.4 Asset Sale Memo
const assetSaleSchema = z.object({
  assetTag: z.string().min(1, "Asset tag is required."),
  saleDate: z.date(),
  saleValue: z.coerce.number().min(0),
  bookValue: z.coerce.number().min(0),
});
type AssetSaleValues = z.infer<typeof assetSaleSchema>;

function AssetSaleMemoForm() {
    const { toast } = useToast();
    const form = useForm<AssetSaleValues>({ resolver: zodResolver(assetSaleSchema), defaultValues: { assetTag: '', saleDate: new Date(), saleValue: 0, bookValue: 0 }});
    function onSubmit(data: AssetSaleValues) { console.log(data); toast({ title: "Asset Sale Recorded" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Asset Sale Memo</CardTitle><CardDescription>Record the disposal or sale of an asset.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <FormField control={form.control} name="assetTag" render={({ field }) => (<FormItem><FormLabel>Asset Tag</FormLabel><FormControl><Input placeholder="Select Asset" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="saleDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Sale Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="saleValue" render={({ field }) => (<FormItem><FormLabel>Sale Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bookValue" render={({ field }) => (<FormItem><FormLabel>Book Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Record Sale</Button></CardFooter>
        </form></Form></Card>
    );
}

// 11.5 Asset Depreciation Voucher
const assetDepreciationSchema = z.object({
  year: z.string().min(4, "Enter a valid year.").max(4, "Enter a valid year."),
  assetTag: z.string().min(1, "Asset tag is required."),
  openingBalance: z.coerce.number(),
  depreciationAmount: z.coerce.number(),
});
type AssetDepreciationValues = z.infer<typeof assetDepreciationSchema>;

function AssetDepreciationVoucherForm() {
    const { toast } = useToast();
    const form = useForm<AssetDepreciationValues>({
        resolver: zodResolver(assetDepreciationSchema),
        defaultValues: { year: new Date().getFullYear().toString(), assetTag: '', openingBalance: 0, depreciationAmount: 0 }
    });
    const openingBalance = form.watch('openingBalance');
    const depreciationAmount = form.watch('depreciationAmount');
    const closingBalance = openingBalance - depreciationAmount;

    function onSubmit(data: AssetDepreciationValues) { console.log(data); toast({ title: "Depreciation Voucher Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Asset Depreciation Voucher</CardTitle><CardDescription>Perform year-end depreciation calculation.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <FormField control={form.control} name="year" render={({ field }) => (<FormItem><FormLabel>Year</FormLabel><FormControl><Input placeholder="YYYY" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="assetTag" render={({ field }) => (<FormItem><FormLabel>Asset Tag</FormLabel><FormControl><Input placeholder="Select Asset" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="openingBalance" render={({ field }) => (<FormItem><FormLabel>Opening Balance</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="depreciationAmount" render={({ field }) => (<FormItem><FormLabel>Depreciation Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid gap-2"><Label>Closing Balance</Label><Input disabled value={closingBalance.toFixed(2)} /></div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Voucher</Button></CardFooter>
        </form></Form></Card>
    );
}

export default function AssetsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Asset Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="asset-master">
          <ScrollArea>
            <TabsList>
              <TabsTrigger value="asset-master">Asset Master</TabsTrigger>
              <TabsTrigger value="asset-addition">Asset Addition</TabsTrigger>
              <TabsTrigger value="asset-allocation">Asset Allocation</TabsTrigger>
              <TabsTrigger value="asset-sale">Asset Sale</TabsTrigger>
              <TabsTrigger value="asset-depreciation">Asset Depreciation</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="asset-master" className="mt-4">
            <FixAssetMasterForm />
          </TabsContent>
          <TabsContent value="asset-addition" className="mt-4">
            <AssetAdditionMemoForm />
          </TabsContent>
          <TabsContent value="asset-allocation" className="mt-4">
            <AssetAllocationMasterForm />
          </TabsContent>
          <TabsContent value="asset-sale" className="mt-4">
            <AssetSaleMemoForm />
          </TabsContent>
          <TabsContent value="asset-depreciation" className="mt-4">
            <AssetDepreciationVoucherForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
