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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

// 9.1 Tool Master
const toolMasterSchema = z.object({
  toolName: z.string().min(1, "Tool name is required."),
  location: z.string().min(1, "Location is required."),
  maintenanceInterval: z.coerce.number().min(1, "Interval must be at least 1 day."),
});
type ToolMasterValues = z.infer<typeof toolMasterSchema>;

function ToolMasterForm() {
    const { toast } = useToast();
    const form = useForm<ToolMasterValues>({
        resolver: zodResolver(toolMasterSchema),
        defaultValues: { toolName: '', location: '', maintenanceInterval: 30 }
    });
    function onSubmit(data: ToolMasterValues) {
        console.log(data);
        toast({ title: "Tool Saved" });
        form.reset();
    }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>New Tool</CardTitle><CardDescription>Add a new tool or asset to the master list.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                <div className="grid gap-2"><Label>Asset Code</Label><Input disabled placeholder="Auto-generated" /></div>
                <FormField control={form.control} name="toolName" render={({ field }) => (<FormItem><FormLabel>Tool Name</FormLabel><FormControl><Input placeholder="e.g. Lathe Machine" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g. Shop Floor 1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="maintenanceInterval" render={({ field }) => (<FormItem><FormLabel>Maintenance Interval (Days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Tool</Button></CardFooter>
        </form></Form></Card>
    )
}

// 9.2 Tool Maintenance Chart
const toolMaintenanceChartSchema = z.object({
  toolRef: z.string().min(1, "Tool reference is required."),
  scheduledDate: z.date(),
  tasks: z.object({
    greasing: z.boolean().default(false),
    cleaning: z.boolean().default(false),
    inspection: z.boolean().default(false),
  }).optional(),
});
type ToolMaintenanceChartValues = z.infer<typeof toolMaintenanceChartSchema>;

function ToolMaintenanceChartForm() {
    const { toast } = useToast();
    const form = useForm<ToolMaintenanceChartValues>({
        resolver: zodResolver(toolMaintenanceChartSchema),
        defaultValues: { toolRef: '', scheduledDate: new Date(), tasks: { greasing: false, cleaning: false, inspection: false } }
    });
    function onSubmit(data: ToolMaintenanceChartValues) { console.log(data); toast({ title: "Maintenance Scheduled" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Tool Maintenance Chart</CardTitle><CardDescription>Schedule a maintenance task for a tool.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="toolRef" render={({ field }) => (<FormItem><FormLabel>Tool Ref</FormLabel><FormControl><Input placeholder="Select Tool" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="scheduledDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Scheduled Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                </div>
                 <div>
                    <Label>Task List</Label>
                    <div className="flex items-center space-x-4 pt-2">
                        <FormField control={form.control} name="tasks.greasing" render={({ field }) => (<FormItem className="flex items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Greasing</FormLabel></FormItem>)} />
                        <FormField control={form.control} name="tasks.cleaning" render={({ field }) => (<FormItem className="flex items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Cleaning</FormLabel></FormItem>)} />
                        <FormField control={form.control} name="tasks.inspection" render={({ field }) => (<FormItem className="flex items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Inspection</FormLabel></FormItem>)} />
                    </div>
                 </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Schedule</Button></CardFooter>
        </form></Form></Card>
    );
}

// 9.3 Tool Calibration Report
const toolCalibrationReportSchema = z.object({
  toolRef: z.string().min(1, "Tool reference is required."),
  calibrationDate: z.date(),
  standardValue: z.coerce.number(),
  actualValue: z.coerce.number(),
  result: z.enum(["Pass", "Fail"]),
});
type ToolCalibrationReportValues = z.infer<typeof toolCalibrationReportSchema>;

function ToolCalibrationReportForm() {
    const { toast } = useToast();
    const form = useForm<ToolCalibrationReportValues>({
        resolver: zodResolver(toolCalibrationReportSchema),
        defaultValues: { toolRef: '', calibrationDate: new Date(), standardValue: 0, actualValue: 0, result: "Pass" }
    });
    function onSubmit(data: ToolCalibrationReportValues) { console.log(data); toast({ title: "Calibration Report Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Tool Calibration Report</CardTitle><CardDescription>Log the results of a tool calibration.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-5 gap-4">
                <FormField control={form.control} name="toolRef" render={({ field }) => (<FormItem><FormLabel>Tool Ref</FormLabel><FormControl><Input placeholder="Select Tool" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="calibrationDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Calibration Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="standardValue" render={({ field }) => (<FormItem><FormLabel>Standard Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="actualValue" render={({ field }) => (<FormItem><FormLabel>Actual Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="result" render={({ field }) => (<FormItem><FormLabel>Result</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Pass">Pass</SelectItem><SelectItem value="Fail">Fail</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Report</Button></CardFooter>
        </form></Form></Card>
    );
}

// 9.4 Tool Maintenance/Rectification Memo
const toolMaintenanceMemoSchema = z.object({
  toolRef: z.string().min(1, "Tool reference is required."),
  issue: z.string().min(1, "Issue description is required."),
  sparesUsed: z.string().optional(),
  cost: z.coerce.number().min(0).optional(),
  technician: z.string().min(1, "Technician name is required."),
});
type ToolMaintenanceMemoValues = z.infer<typeof toolMaintenanceMemoSchema>;

function ToolMaintenanceMemoForm() {
    const { toast } = useToast();
    const form = useForm<ToolMaintenanceMemoValues>({
        resolver: zodResolver(toolMaintenanceMemoSchema),
        defaultValues: { toolRef: '', issue: '', sparesUsed: '', cost: 0, technician: '' }
    });
    function onSubmit(data: ToolMaintenanceMemoValues) { console.log(data); toast({ title: "Maintenance Memo Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Tool Maintenance/Rectification Memo</CardTitle><CardDescription>Log a repair or unscheduled maintenance job.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                 <div className="grid md:grid-cols-4 gap-4">
                    <div className="grid gap-2"><Label>Job ID</Label><Input disabled placeholder="Auto-generated" /></div>
                    <FormField control={form.control} name="toolRef" render={({ field }) => (<FormItem><FormLabel>Tool Ref</FormLabel><FormControl><Input placeholder="Select Tool" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="technician" render={({ field }) => (<FormItem><FormLabel>Technician</FormLabel><FormControl><Input placeholder="Technician Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="issue" render={({ field }) => (<FormItem><FormLabel>Issue / Work Done</FormLabel><FormControl><Textarea placeholder="Describe the issue and the fix" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="sparesUsed" render={({ field }) => (<FormItem><FormLabel>Spares Used</FormLabel><FormControl><Input placeholder="e.g. Bearing, Oil" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="cost" render={({ field }) => (<FormItem><FormLabel>Cost</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Memo</Button></CardFooter>
        </form></Form></Card>
    );
}

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Maintenance Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="tool-master">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tool-master">Tool Master</TabsTrigger>
            <TabsTrigger value="maintenance-chart">Maintenance Chart</TabsTrigger>
            <TabsTrigger value="calibration-report">Calibration Report</TabsTrigger>
            <TabsTrigger value="rectification-memo">Rectification Memo</TabsTrigger>
          </TabsList>
          <TabsContent value="tool-master" className="mt-4">
            <ToolMasterForm />
          </TabsContent>
          <TabsContent value="maintenance-chart" className="mt-4">
            <ToolMaintenanceChartForm />
          </TabsContent>
          <TabsContent value="calibration-report" className="mt-4">
            <ToolCalibrationReportForm />
          </TabsContent>
          <TabsContent value="rectification-memo" className="mt-4">
            <ToolMaintenanceMemoForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
