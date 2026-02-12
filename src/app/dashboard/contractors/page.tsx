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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// 8.1 Employee Master (Contractor Staff)
const contractorEmployeeSchema = z.object({
  contractorFirm: z.string().min(1, "Contractor firm name is required."),
  workerName: z.string().min(1, "Worker name is required."),
  skillLevel: z.enum(["Skilled", "Unskilled"]),
  aadharNo: z.string().min(12, "Aadhar number must be 12 digits.").max(12, "Aadhar number must be 12 digits."),
});
type ContractorEmployeeValues = z.infer<typeof contractorEmployeeSchema>;

function ContractorEmployeeForm() {
    const { toast } = useToast();
    const form = useForm<ContractorEmployeeValues>({
        resolver: zodResolver(contractorEmployeeSchema),
        defaultValues: { contractorFirm: '', workerName: '', skillLevel: 'Unskilled', aadharNo: '' }
    });
    function onSubmit(data: ContractorEmployeeValues) {
        console.log(data);
        toast({ title: "Contractor Employee Saved" });
        form.reset();
    }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Contractor Employee</CardTitle><CardDescription>Register a new contract labor worker.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="grid gap-2"><Label>Worker ID</Label><Input disabled placeholder="Auto-generated" /></div>
                    <FormField control={form.control} name="contractorFirm" render={({ field }) => (<FormItem><FormLabel>Contractor Firm</FormLabel><FormControl><Input placeholder="Contractor Firm Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="workerName" render={({ field }) => (<FormItem><FormLabel>Worker Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="aadharNo" render={({ field }) => (<FormItem><FormLabel>Aadhar No</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <div className="grid md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="skillLevel" render={({ field }) => (
                        <FormItem><FormLabel>Skill Level</FormLabel><FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Skilled" /></FormControl><FormLabel className="font-normal">Skilled</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Unskilled" /></FormControl><FormLabel className="font-normal">Unskilled</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Worker</Button></CardFooter>
        </form></Form></Card>
    )
}

// 8.2 Salary Head Master (Contractor)
const contractorSalaryHeadSchema = z.object({
  role: z.string().min(1, "Role is required."),
  dailyRate: z.coerce.number().min(0, "Rate must be positive."),
  overtimeRate: z.coerce.number().min(0, "Rate must be positive."),
});
type ContractorSalaryHeadValues = z.infer<typeof contractorSalaryHeadSchema>;

function ContractorSalaryHeadForm() {
    const { toast } = useToast();
    const form = useForm<ContractorSalaryHeadValues>({ resolver: zodResolver(contractorSalaryHeadSchema), defaultValues: { role: '', dailyRate: 0, overtimeRate: 0 }});
    function onSubmit(data: ContractorSalaryHeadValues) { console.log(data); toast({ title: "Contractor Salary Head Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Contractor Salary Head Master</CardTitle><CardDescription>Define daily and overtime rates for contract roles.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
                <FormField control={form.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><FormControl><Input placeholder="e.g. Helper, Welder" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="dailyRate" render={({ field }) => (<FormItem><FormLabel>Daily Rate</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="overtimeRate" render={({ field }) => (<FormItem><FormLabel>Overtime Rate</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Rate</Button></CardFooter>
        </form></Form></Card>
    )
}


// 8.3 Employee Salary Structure (Contractor)
const contractorSalaryStructureSchema = z.object({
  workerName: z.string().min(1, "Worker name is required."),
  role: z.string().min(1, "Role is required."),
  applicableDailyRate: z.coerce.number().min(0),
});
type ContractorSalaryStructureValues = z.infer<typeof contractorSalaryStructureSchema>;

function ContractorSalaryStructureForm() {
    const { toast } = useToast();
    const form = useForm<ContractorSalaryStructureValues>({ resolver: zodResolver(contractorSalaryStructureSchema), defaultValues: { workerName: '', role: '', applicableDailyRate: 0 }});
    function onSubmit(data: ContractorSalaryStructureValues) { console.log(data); toast({ title: "Salary Structure Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Contractor Salary Structure</CardTitle><CardDescription>Map a worker to their role and pay rate.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
                <FormField control={form.control} name="workerName" render={({ field }) => (<FormItem><FormLabel>Worker Name</FormLabel><FormControl><Input placeholder="Select Worker" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><FormControl><Input placeholder="Select Role" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="applicableDailyRate" render={({ field }) => (<FormItem><FormLabel>Applicable Daily Rate</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Structure</Button></CardFooter>
        </form></Form></Card>
    )
}

// 8.4 Employee Salary Sheet (Contractor)
const contractorSalarySheetSchema = z.object({
  contractorName: z.string().min(1),
  month: z.date(),
  workerName: z.string().min(1),
  daysWorked: z.coerce.number().min(0),
  overtimeHours: z.coerce.number().min(0),
});
type ContractorSalarySheetValues = z.infer<typeof contractorSalarySheetSchema>;

function ContractorSalarySheetForm() {
    const { toast } = useToast();
    const form = useForm<ContractorSalarySheetValues>({
        resolver: zodResolver(contractorSalarySheetSchema),
        defaultValues: { contractorName: '', month: new Date(), workerName: '', daysWorked: 0, overtimeHours: 0 }
    });
    // Dummy rate values for calculation
    const dailyRate = 500;
    const otRate = 100;
    const daysWorked = form.watch('daysWorked');
    const overtimeHours = form.watch('overtimeHours');
    const totalPayable = (daysWorked * dailyRate) + (overtimeHours * otRate);

    function onSubmit(data: ContractorSalarySheetValues) { console.log(data); toast({ title: "Salary Sheet Processed" }); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Contractor Salary Sheet</CardTitle><CardDescription>Calculate monthly payout for a contractor.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="contractorName" render={({ field }) => (<FormItem><FormLabel>Contractor Name</FormLabel><FormControl><Input placeholder="Select Contractor" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="month" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Month</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "MMM yyyy") : <span>Pick a month</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="workerName" render={({ field }) => (<FormItem><FormLabel>Worker Name</FormLabel><FormControl><Input placeholder="Select Worker" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="daysWorked" render={({ field }) => (<FormItem><FormLabel>Days Worked</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="overtimeHours" render={({ field }) => (<FormItem><FormLabel>Overtime Hours</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="grid gap-2"><Label>Total Payable</Label><Input disabled value={totalPayable.toFixed(2)} /></div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Process Sheet</Button></CardFooter>
        </form></Form></Card>
    )
}

// 8.5 Employee Advance Memo (Contractor)
const contractorAdvanceMemoSchema = z.object({
  contractorName: z.string().min(1, "Contractor name is required."),
  date: z.date(),
  amount: z.coerce.number().min(1),
  remarks: z.string().optional(),
});
type ContractorAdvanceMemoValues = z.infer<typeof contractorAdvanceMemoSchema>;

function ContractorAdvanceMemoForm() {
    const { toast } = useToast();
    const form = useForm<ContractorAdvanceMemoValues>({
        resolver: zodResolver(contractorAdvanceMemoSchema),
        defaultValues: { contractorName: '', date: new Date(), amount: 0, remarks: '' }
    });
    function onSubmit(data: ContractorAdvanceMemoValues) {
        console.log(data);
        toast({ title: "Advance Memo Saved" });
        form.reset();
    }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Contractor Advance Memo</CardTitle><CardDescription>Record an advance given to a contractor for their labor.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="contractorName" render={({ field }) => (<FormItem><FormLabel>Contractor Name</FormLabel><FormControl><Input placeholder="Select Contractor" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="date" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="amount" render={({ field }) => (<FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <FormField control={form.control} name="remarks" render={({ field }) => (<FormItem><FormLabel>Remarks</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Memo</Button></CardFooter>
        </form></Form></Card>
    )
}

// 8.6 Voucher Payment
const contractorVoucherPaymentSchema = z.object({
  contractorName: z.string().min(1, "Contractor is required."),
  salarySheetRef: z.string().min(1, "Salary Sheet Ref is required."),
  netAmountPaid: z.coerce.number().min(0.01),
  tdsDeducted: z.coerce.number().min(0),
});
type ContractorVoucherPaymentValues = z.infer<typeof contractorVoucherPaymentSchema>;

function ContractorVoucherPaymentForm() {
    const { toast } = useToast();
    const form = useForm<ContractorVoucherPaymentValues>({ resolver: zodResolver(contractorVoucherPaymentSchema), defaultValues: { contractorName: '', salarySheetRef: '', netAmountPaid: 0, tdsDeducted: 0 }});
    function onSubmit(data: ContractorVoucherPaymentValues) { console.log(data); toast({ title: "Contractor Payment Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Contractor Payment</CardTitle><CardDescription>Record a payment made to a contractor.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="grid gap-2"><Label>Voucher No</Label><Input disabled placeholder="Auto-generated" /></div>
                <FormField control={form.control} name="contractorName" render={({ field }) => (<FormItem><FormLabel>Contractor Name</FormLabel><FormControl><Input placeholder="Contractor Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="salarySheetRef" render={({ field }) => (<FormItem><FormLabel>Salary Sheet Ref</FormLabel><FormControl><Input placeholder="Sheet ID" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="netAmountPaid" render={({ field }) => (<FormItem><FormLabel>Net Amount Paid</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="tdsDeducted" render={({ field }) => (<FormItem><FormLabel>TDS Deducted</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Payment</Button></CardFooter>
        </form></Form></Card>
    );
}


export default function ContractorsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Contractors Employee Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="employee-master">
          <ScrollArea>
            <TabsList>
              <TabsTrigger value="employee-master">Employee Master</TabsTrigger>
              <TabsTrigger value="salary-head">Salary Head</TabsTrigger>
              <TabsTrigger value="salary-structure">Salary Structure</TabsTrigger>
              <TabsTrigger value="salary-sheet">Salary Sheet</TabsTrigger>
              <TabsTrigger value="advance-memo">Advance Memo</TabsTrigger>
              <TabsTrigger value="voucher-payment">Voucher Payment</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="employee-master" className="mt-4">
            <ContractorEmployeeForm />
          </TabsContent>
          <TabsContent value="salary-head" className="mt-4">
            <ContractorSalaryHeadForm />
          </TabsContent>
          <TabsContent value="salary-structure" className="mt-4">
            <ContractorSalaryStructureForm />
          </TabsContent>
          <TabsContent value="salary-sheet" className="mt-4">
            <ContractorSalarySheetForm />
          </TabsContent>
          <TabsContent value="advance-memo" className="mt-4">
            <ContractorAdvanceMemoForm />
          </TabsContent>
           <TabsContent value="voucher-payment" className="mt-4">
            <ContractorVoucherPaymentForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
