'use client';

import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// 12.1 GST Taxation Master
const gstTaxationSchema = z.object({
  hsnCode: z.string().min(1, "HSN Code is required."),
  description: z.string().min(1, "Description is required."),
  igst: z.coerce.number().min(0).max(100),
  cgst: z.coerce.number().min(0).max(100),
  sgst: z.coerce.number().min(0).max(100),
});
type GstTaxationValues = z.infer<typeof gstTaxationSchema>;

function GstTaxationMasterForm() {
    const { toast } = useToast();
    const form = useForm<GstTaxationValues>({
        resolver: zodResolver(gstTaxationSchema),
        defaultValues: { hsnCode: '', description: '', igst: 0, cgst: 0, sgst: 0 }
    });
    function onSubmit(data: GstTaxationValues) {
        console.log(data);
        toast({ title: "GST Rule Saved" });
        form.reset();
    }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>GST Taxation Master</CardTitle><CardDescription>Set up tax rules for HSN codes.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-5 gap-4">
                <FormField control={form.control} name="hsnCode" render={({ field }) => (<FormItem><FormLabel>HSN Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="igst" render={({ field }) => (<FormItem><FormLabel>IGST %</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="cgst" render={({ field }) => (<FormItem><FormLabel>CGST %</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sgst" render={({ field }) => (<FormItem><FormLabel>SGST %</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Rule</Button></CardFooter>
        </form></Form></Card>
    );
}

// 12.2 GSTR-1 Upload (Sales)
const gstr1UploadSchema = z.object({
  month: z.date(),
  invoiceNo: z.string().min(1, "Invoice number is required."),
  customerGstin: z.string().length(15, "Must be 15 characters."),
  taxableValue: z.coerce.number().min(0),
  taxAmount: z.coerce.number().min(0),
  state: z.string().min(1, "State is required."),
});
type Gstr1UploadValues = z.infer<typeof gstr1UploadSchema>;

function Gstr1UploadForm() {
    const { toast } = useToast();
    const form = useForm<Gstr1UploadValues>({
        resolver: zodResolver(gstr1UploadSchema),
        defaultValues: { month: new Date(), invoiceNo: '', customerGstin: '', taxableValue: 0, taxAmount: 0, state: '' }
    });
    function onSubmit(data: Gstr1UploadValues) { console.log(data); toast({ title: "GSTR-1 Entry Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>GSTR-1 Sales Upload</CardTitle><CardDescription>Prepare sales data for GSTR-1 filing.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
                <FormField control={form.control} name="month" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Month</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "MMM yyyy") : <span>Pick a month</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="invoiceNo" render={({ field }) => (<FormItem><FormLabel>Invoice No</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="customerGstin" render={({ field }) => (<FormItem><FormLabel>Customer GSTIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="taxableValue" render={({ field }) => (<FormItem><FormLabel>Taxable Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="taxAmount" render={({ field }) => (<FormItem><FormLabel>Tax Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Add to GSTR-1</Button></CardFooter>
        </form></Form></Card>
    );
}

// 12.3 GST2A Reconciliation
const gst2aReconSchema = z.object({
  month: z.date(),
  vendorGstin: z.string().length(15, "Must be 15 characters."),
  totalItc: z.coerce.number().min(0),
  matchedAmount: z.coerce.number().min(0),
});
type Gst2aReconValues = z.infer<typeof gst2aReconSchema>;

function Gst2aReconciliationForm() {
    const { toast } = useToast();
    const form = useForm<Gst2aReconValues>({
        resolver: zodResolver(gst2aReconSchema),
        defaultValues: { month: new Date(), vendorGstin: '', totalItc: 0, matchedAmount: 0 }
    });
    const mismatchAmount = form.watch('totalItc') - form.watch('matchedAmount');
    function onSubmit(data: Gst2aReconValues) { console.log(data); toast({ title: "Reconciliation Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>GST2A Reconciliation</CardTitle><CardDescription>Compare purchase records with the GST portal data.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-5 gap-4">
                <FormField control={form.control} name="month" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Month</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "MMM yyyy") : <span>Pick a month</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="vendorGstin" render={({ field }) => (<FormItem><FormLabel>Vendor GSTIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="totalItc" render={({ field }) => (<FormItem><FormLabel>Total Input Tax Credit (ITC)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="matchedAmount" render={({ field }) => (<FormItem><FormLabel>Matched Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid gap-2"><Label>Mismatch Amount</Label><Input disabled value={mismatchAmount.toFixed(2)} /></div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Reconciliation</Button></CardFooter>
        </form></Form></Card>
    );
}

// 12.4 GST Deposit Challan
const gstDepositChallanSchema = z.object({
  cpin: z.string().min(1, "CPIN is required."),
  date: z.date(),
  bank: z.string().min(1, "Bank is required."),
  taxType: z.enum(["CGST", "SGST", "IGST"]),
  amount: z.coerce.number().min(0.01),
});
type GstDepositChallanValues = z.infer<typeof gstDepositChallanSchema>;

function GstDepositChallanForm() {
    const { toast } = useToast();
    const form = useForm<GstDepositChallanValues>({ resolver: zodResolver(gstDepositChallanSchema), defaultValues: { cpin: '', date: new Date(), bank: '', taxType: 'CGST', amount: 0 }});
    function onSubmit(data: GstDepositChallanValues) { console.log(data); toast({ title: "Challan Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>GST Deposit Challan</CardTitle><CardDescription>Record a GST payment challan.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                <div className="grid gap-2"><Label>Challan No</Label><Input disabled placeholder="Auto-generated" /></div>
                <FormField control={form.control} name="cpin" render={({ field }) => (<FormItem><FormLabel>CPIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bank" render={({ field }) => (<FormItem><FormLabel>Bank</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="taxType" render={({ field }) => (<FormItem><FormLabel>Tax Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="CGST">CGST</SelectItem><SelectItem value="SGST">SGST</SelectItem><SelectItem value="IGST">IGST</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="amount" render={({ field }) => (<FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Challan</Button></CardFooter>
        </form></Form></Card>
    );
}

// 12.5 TDS Trace & Details
const tdsTraceSchema = z.object({
  section: z.string().min(1, "Section is required."),
  deducteeName: z.string().min(1, "Deductee name is required."),
  paymentAmount: z.coerce.number().min(0),
  tdsRate: z.coerce.number().min(0).max(100),
  certificateNo: z.string().optional(),
});
type TdsTraceValues = z.infer<typeof tdsTraceSchema>;

function TdsTraceForm() {
    const { toast } = useToast();
    const form = useForm<TdsTraceValues>({ resolver: zodResolver(tdsTraceSchema), defaultValues: { section: '194C', deducteeName: '', paymentAmount: 0, tdsRate: 1, certificateNo: '' }});
    const tdsAmount = (form.watch('paymentAmount') * form.watch('tdsRate')) / 100;
    function onSubmit(data: TdsTraceValues) { console.log(data); toast({ title: "TDS Record Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>TDS Trace & Details</CardTitle><CardDescription>Track tax deducted at source.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                <FormField control={form.control} name="section" render={({ field }) => (<FormItem><FormLabel>Section</FormLabel><FormControl><Input placeholder="e.g., 194C" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="deducteeName" render={({ field }) => (<FormItem><FormLabel>Deductee Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="paymentAmount" render={({ field }) => (<FormItem><FormLabel>Payment Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="tdsRate" render={({ field }) => (<FormItem><FormLabel>TDS Rate %</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid gap-2"><Label>TDS Amount</Label><Input disabled value={tdsAmount.toFixed(2)} /></div>
                <FormField control={form.control} name="certificateNo" render={({ field }) => (<FormItem><FormLabel>Certificate No</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save TDS Record</Button></CardFooter>
        </form></Form></Card>
    );
}

// 12.6 TCS Details
const tcsDetailsSchema = z.object({
  customerName: z.string().min(1, "Customer name is required."),
  saleValue: z.coerce.number().min(0),
  tcsRate: z.coerce.number().min(0).max(100),
});
type TcsDetailsValues = z.infer<typeof tcsDetailsSchema>;

function TcsDetailsForm() {
    const { toast } = useToast();
    const form = useForm<TcsDetailsValues>({ resolver: zodResolver(tcsDetailsSchema), defaultValues: { customerName: '', saleValue: 0, tcsRate: 0.1 }});
    const tcsAmount = (form.watch('saleValue') * form.watch('tcsRate')) / 100;
    function onSubmit(data: TcsDetailsValues) { console.log(data); toast({ title: "TCS Record Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>TCS Details</CardTitle><CardDescription>Track tax collected at source.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                <FormField control={form.control} name="customerName" render={({ field }) => (<FormItem><FormLabel>Customer Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="saleValue" render={({ field }) => (<FormItem><FormLabel>Sale Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="tcsRate" render={({ field }) => (<FormItem><FormLabel>TCS Rate %</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid gap-2"><Label>TCS Amount</Label><Input disabled value={tcsAmount.toFixed(2)} /></div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save TCS Record</Button></CardFooter>
        </form></Form></Card>
    );
}

// 12.7 GSTR1 & GSTR2 Register
const gstrRegisterSchema = z.object({
  dateRange: z.object({ from: z.date(), to: z.date() }),
  transactionType: z.enum(["B2B", "B2C"]),
});
type GstrRegisterValues = z.infer<typeof gstrRegisterSchema>;

function GstrRegisterForm() {
    const { toast } = useToast();
    const form = useForm<GstrRegisterValues>({ resolver: zodResolver(gstrRegisterSchema), defaultValues: { transactionType: "B2B" }});
    function onSubmit(data: GstrRegisterValues) { console.log(data); toast({ title: "Register Generated" }); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>GSTR1 & GSTR2 Register</CardTitle><CardDescription>View a detailed tax ledger.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                 <FormField
                    control={form.control} name="dateRange"
                    render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Date range</FormLabel><Popover><PopoverTrigger asChild><Button id="date" variant={"outline"} className={cn("justify-start text-left font-normal", !field.value.from && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value.from ? ( field.value.to ? (<>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</>) : (format(field.value.from, "LLL dd, y"))) : (<span>Pick a date</span>)}
                    </Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar initialFocus mode="range" defaultMonth={field.value.from} selected={{from: field.value.from, to: field.value.to}} onSelect={field.onChange} numberOfMonths={2}/></PopoverContent></Popover><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="transactionType" render={({ field }) => (<FormItem><FormLabel>Transaction Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="B2B">B2B</SelectItem><SelectItem value="B2C">B2C</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <div className="grid gap-2"><Label>Total Tax Liability</Label><Input disabled value={"12,345.67"} /></div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Generate Register</Button></CardFooter>
        </form></Form></Card>
    );
}

// 12.8 Cheque Book Management
const chequeBookSchema = z.object({
  bankAccount: z.string().min(1),
  startLeafNo: z.coerce.number().min(1),
  endLeafNo: z.coerce.number().min(1),
});
type ChequeBookValues = z.infer<typeof chequeBookSchema>;

function ChequeBookManagementForm() {
    const { toast } = useToast();
    const form = useForm<ChequeBookValues>({ resolver: zodResolver(chequeBookSchema) });
    function onSubmit(data: ChequeBookValues) { console.log(data); toast({ title: "Cheque Book Added" }); }
    return (
      <div className="grid gap-4">
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Add New Cheque Book</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
                <FormField control={form.control} name="bankAccount" render={({ field }) => (<FormItem><FormLabel>Bank Account</FormLabel><FormControl><Input placeholder="Select Account" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="startLeafNo" render={({ field }) => (<FormItem><FormLabel>Start Leaf No</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="endLeafNo" render={({ field }) => (<FormItem><FormLabel>End Leaf No</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Add Cheque Book</Button></CardFooter>
        </form></Form></Card>
        <Card>
            <CardHeader><CardTitle>Cheque Status Tracker</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Leaf No</TableHead><TableHead>Status</TableHead><TableHead>Issued To</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                    <TableBody>
                        <TableRow><TableCell>1001</TableCell><TableCell>Used</TableCell><TableCell>ABC Corp</TableCell><TableCell>2023-05-15</TableCell></TableRow>
                        <TableRow><TableCell>1002</TableCell><TableCell>Cancelled</TableCell><TableCell>-</TableCell><TableCell>2023-05-16</TableCell></TableRow>
                        <TableRow><TableCell>1003</TableCell><TableCell>Blank</TableCell><TableCell>-</TableCell><TableCell>-</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    );
}

// 12.9 Balance Sheet
const balanceSheetSchema = z.object({
  asOnDate: z.date(),
});
type BalanceSheetValues = z.infer<typeof balanceSheetSchema>;

function BalanceSheetForm() {
    const { toast } = useToast();
    const form = useForm<BalanceSheetValues>({ resolver: zodResolver(balanceSheetSchema), defaultValues: { asOnDate: new Date() }});
    function onSubmit(data: BalanceSheetValues) { console.log(data); toast({ title: "Balance Sheet Generated" }); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Balance Sheet</CardTitle><CardDescription>Generate a financial statement.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <FormField control={form.control} name="asOnDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>As On Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="grid gap-2"><Label>Assets Total</Label><Input disabled value="5,000,000.00" /></div>
                    <div className="grid gap-2"><Label>Liabilities Total</Label><Input disabled value="2,500,000.00" /></div>
                    <div className="grid gap-2"><Label>Capital Account</Label><Input disabled value="2,000,000.00" /></div>
                    <div className="grid gap-2"><Label>Current Assets</Label><Input disabled value="500,000.00" /></div>
                </div>
            </CardContent>
             <CardFooter className="border-t px-6 py-4"><Button type="submit">Generate</Button></CardFooter>
        </form></Form></Card>
    );
}

export default function StatutoryPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Statutory Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="gst-taxation">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-9">
            <TabsTrigger value="gst-taxation">GST Master</TabsTrigger>
            <TabsTrigger value="gstr1-upload">GSTR-1</TabsTrigger>
            <TabsTrigger value="gst2a-recon">GST2A Recon</TabsTrigger>
            <TabsTrigger value="gst-challan">GST Challan</TabsTrigger>
            <TabsTrigger value="tds-trace">TDS</TabsTrigger>
            <TabsTrigger value="tcs-details">TCS</TabsTrigger>
            <TabsTrigger value="gstr-register">GSTR Register</TabsTrigger>
            <TabsTrigger value="cheque-book">Cheque Book</TabsTrigger>
            <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          </TabsList>
          <TabsContent value="gst-taxation" className="mt-4"><GstTaxationMasterForm /></TabsContent>
          <TabsContent value="gstr1-upload" className="mt-4"><Gstr1UploadForm /></TabsContent>
          <TabsContent value="gst2a-recon" className="mt-4"><Gst2aReconciliationForm /></TabsContent>
          <TabsContent value="gst-challan" className="mt-4"><GstDepositChallanForm /></TabsContent>
          <TabsContent value="tds-trace" className="mt-4"><TdsTraceForm /></TabsContent>
          <TabsContent value="tcs-details" className="mt-4"><TcsDetailsForm /></TabsContent>
          <TabsContent value="gstr-register" className="mt-4"><GstrRegisterForm /></TabsContent>
          <TabsContent value="cheque-book" className="mt-4"><ChequeBookManagementForm /></TabsContent>
          <TabsContent value="balance-sheet" className="mt-4"><BalanceSheetForm /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
