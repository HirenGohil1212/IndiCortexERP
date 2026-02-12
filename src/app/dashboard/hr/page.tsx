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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// 5.1 Employee Master
const employeeMasterSchema = z.object({
  empCode: z.string().min(1, "Employee code is required."),
  name: z.string().min(1, "Employee name is required."),
  designation: z.string().min(1, "Designation is required."),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits."),
  joiningDate: z.date({ required_error: "Joining date is required." }),
  basicSalary: z.coerce.number().min(0, "Basic salary must be positive."),
  bankDetails: z.string().min(1, "Bank details are required."),
});
type EmployeeMasterValues = z.infer<typeof employeeMasterSchema>;

function EmployeeMasterForm() {
    const { toast } = useToast();
    const form = useForm<EmployeeMasterValues>({
        resolver: zodResolver(employeeMasterSchema),
        defaultValues: { empCode: '', name: '', designation: '', mobile: '', joiningDate: new Date(), basicSalary: 0, bankDetails: '' }
    });
    function onSubmit(data: EmployeeMasterValues) {
        console.log(data);
        toast({ title: "Employee Saved" });
        form.reset();
    }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Employee</CardTitle><CardDescription>Add a new staff member to the system.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="empCode" render={({ field }) => (<FormItem><FormLabel>Emp Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="designation" render={({ field }) => (<FormItem><FormLabel>Designation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="mobile" render={({ field }) => (<FormItem><FormLabel>Mobile</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="joiningDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Joining Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="basicSalary" render={({ field }) => (<FormItem><FormLabel>Basic Salary</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="bankDetails" render={({ field }) => (<FormItem className="col-span-1 lg:col-span-2"><FormLabel>Bank Details</FormLabel><FormControl><Input placeholder="Bank Name, Account No, IFSC" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Employee</Button></CardFooter>
        </form></Form></Card>
    )
}

// 5.2 Salary Head Master
const salaryHeadMasterSchema = z.object({
  headName: z.string().min(1, "Head name is required."),
  type: z.enum(["Earning", "Deduction"]),
});
type SalaryHeadMasterValues = z.infer<typeof salaryHeadMasterSchema>;

function SalaryHeadMasterForm() {
    const { toast } = useToast();
    const form = useForm<SalaryHeadMasterValues>({ resolver: zodResolver(salaryHeadMasterSchema), defaultValues: { headName: '', type: 'Earning' }});
    function onSubmit(data: SalaryHeadMasterValues) { console.log(data); toast({ title: "Salary Head Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Salary Head Master</CardTitle><CardDescription>Define salary components like HRA, PF, etc.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="headName" render={({ field }) => (<FormItem><FormLabel>Head Name</FormLabel><FormControl><Input placeholder="e.g. HRA, PF" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Earning">Earning</SelectItem><SelectItem value="Deduction">Deduction</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Head</Button></CardFooter>
        </form></Form></Card>
    )
}


// 5.3 Employee Salary Structure
const employeeSalaryStructureSchema = z.object({
  empName: z.string().min(1, "Employee name is required."),
  effectiveDate: z.date({ required_error: "Effective date is required." }),
  basic: z.coerce.number().min(0),
  hra: z.coerce.number().min(0),
  da: z.coerce.number().min(0),
  pfPercent: z.coerce.number().min(0).max(100),
});
type EmployeeSalaryStructureValues = z.infer<typeof employeeSalaryStructureSchema>;

function EmployeeSalaryStructureForm() {
    const { toast } = useToast();
    const form = useForm<EmployeeSalaryStructureValues>({ resolver: zodResolver(employeeSalaryStructureSchema), defaultValues: { empName: '', effectiveDate: new Date(), basic: 0, hra: 0, da: 0, pfPercent: 0 }});
    function onSubmit(data: EmployeeSalaryStructureValues) { console.log(data); toast({ title: "Salary Structure Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Employee Salary Structure</CardTitle><CardDescription>Assign pay structure to an employee.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="empName" render={({ field }) => (<FormItem><FormLabel>Employee Name</FormLabel><FormControl><Input placeholder="Select Employee" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="effectiveDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Effective Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="basic" render={({ field }) => (<FormItem><FormLabel>Basic</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="hra" render={({ field }) => (<FormItem><FormLabel>HRA</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="da" render={({ field }) => (<FormItem><FormLabel>DA</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="pfPercent" render={({ field }) => (<FormItem><FormLabel>PF %</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Structure</Button></CardFooter>
        </form></Form></Card>
    )
}

// 5.4 Employee Salary Sheet
const employeeSalarySheetSchema = z.object({
  month: z.date(),
  totalDays: z.coerce.number().min(1).max(31),
  presentDays: z.coerce.number().min(0),
}).refine(data => data.presentDays <= data.totalDays, {
    message: "Present days cannot be more than total days",
    path: ["presentDays"],
});

type EmployeeSalarySheetValues = z.infer<typeof employeeSalarySheetSchema>;

function EmployeeSalarySheetForm() {
    const { toast } = useToast();
    const form = useForm<EmployeeSalarySheetValues>({
        resolver: zodResolver(employeeSalarySheetSchema),
        defaultValues: { month: new Date(), totalDays: 30, presentDays: 30 }
    });
    // Dummy calculated values
    const calculatedGross = 50000;
    const deductions = 5000;
    const netPay = calculatedGross - deductions;

    function onSubmit(data: EmployeeSalarySheetValues) {
        console.log(data);
        toast({ title: "Salary Sheet Processed" });
    }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Employee Salary Sheet</CardTitle><CardDescription>Process monthly payroll.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                     <FormField control={form.control} name="month" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Month</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "MMM yyyy") : <span>Pick a month</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="totalDays" render={({ field }) => (<FormItem><FormLabel>Total Days</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="presentDays" render={({ field }) => (<FormItem><FormLabel>Present Days</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="grid gap-2"><Label>Calculated Gross</Label><Input disabled value={calculatedGross.toFixed(2)} /></div>
                    <div className="grid gap-2"><Label>Deductions</Label><Input disabled value={deductions.toFixed(2)} /></div>
                    <div className="grid gap-2"><Label>Net Pay</Label><Input disabled value={netPay.toFixed(2)} /></div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Process Payroll</Button></CardFooter>
        </form></Form></Card>
    )
}

// 5.5 Employee Advance Memo
const employeeAdvanceMemoSchema = z.object({
  empName: z.string().min(1, "Employee name is required."),
  date: z.date(),
  amount: z.coerce.number().min(1),
  purpose: z.string().min(1, "Purpose is required."),
  recoveryMonth: z.date(),
});
type EmployeeAdvanceMemoValues = z.infer<typeof employeeAdvanceMemoSchema>;

function EmployeeAdvanceMemoForm() {
    const { toast } = useToast();
    const form = useForm<EmployeeAdvanceMemoValues>({
        resolver: zodResolver(employeeAdvanceMemoSchema),
        defaultValues: { empName: '', date: new Date(), amount: 0, purpose: '', recoveryMonth: new Date() }
    });
    function onSubmit(data: EmployeeAdvanceMemoValues) {
        console.log(data);
        toast({ title: "Advance Memo Saved" });
        form.reset();
    }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Employee Advance Memo</CardTitle><CardDescription>Record a loan or advance given to an employee.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField control={form.control} name="empName" render={({ field }) => (<FormItem><FormLabel>Employee Name</FormLabel><FormControl><Input placeholder="Select Employee" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="amount" render={({ field }) => (<FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="purpose" render={({ field }) => (<FormItem><FormLabel>Purpose</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="recoveryMonth" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Recovery Start Month</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "MMM yyyy") : <span>Pick a month</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Memo</Button></CardFooter>
        </form></Form></Card>
    )
}

export default function HRPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="HR Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="employee-master">
          <ScrollArea>
            <TabsList>
              <TabsTrigger value="employee-master">Employee Master</TabsTrigger>
              <TabsTrigger value="salary-head">Salary Head</TabsTrigger>
              <TabsTrigger value="salary-structure">Salary Structure</TabsTrigger>
              <TabsTrigger value="salary-sheet">Salary Sheet</TabsTrigger>
              <TabsTrigger value="advance-memo">Advance Memo</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="employee-master" className="mt-4">
            <EmployeeMasterForm />
          </TabsContent>
          <TabsContent value="salary-head" className="mt-4">
            <SalaryHeadMasterForm />
          </TabsContent>
          <TabsContent value="salary-structure" className="mt-4">
            <EmployeeSalaryStructureForm />
          </TabsContent>
          <TabsContent value="salary-sheet" className="mt-4">
            <EmployeeSalarySheetForm />
          </TabsContent>
          <TabsContent value="advance-memo" className="mt-4">
            <EmployeeAdvanceMemoForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
