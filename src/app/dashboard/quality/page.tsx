'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';


// 7.1 IQC (Incoming)
const iqcSchema = z.object({
  grnRef: z.string().min(1, "GRN Reference is required."),
  item: z.string().min(1, "Item name is required."),
  sampleQty: z.coerce.number().min(1, "Sample quantity must be at least 1."),
  visualCheck: z.enum(["Pass", "Fail"]),
  dimensionCheck: z.string().min(1, "Dimension check details are required."),
});
type IqcValues = z.infer<typeof iqcSchema>;

function IqcForm() {
    const { toast } = useToast();
    const form = useForm<IqcValues>({
        resolver: zodResolver(iqcSchema),
        defaultValues: { grnRef: '', item: '', sampleQty: 1, visualCheck: 'Pass', dimensionCheck: '' }
    });
    function onSubmit(data: IqcValues) {
        console.log(data);
        toast({ title: "IQC Report Saved" });
        form.reset();
    }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Incoming Quality Control</CardTitle><CardDescription>Perform quality check on incoming materials.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="grnRef" render={({ field }) => (<FormItem><FormLabel>GRN Ref</FormLabel><FormControl><Input placeholder="GRN-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="item" render={({ field }) => (<FormItem><FormLabel>Item</FormLabel><FormControl><Input placeholder="Item Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="sampleQty" render={({ field }) => (<FormItem><FormLabel>Sample Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="visualCheck" render={({ field }) => (
                        <FormItem><FormLabel>Visual Check</FormLabel><FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Pass" /></FormControl><FormLabel className="font-normal">Pass</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Fail" /></FormControl><FormLabel className="font-normal">Fail</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="dimensionCheck" render={({ field }) => (<FormItem><FormLabel>Dimension Check</FormLabel><FormControl><Input placeholder="e.g. 5.01mm, 10.2mm" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save IQC Report</Button></CardFooter>
        </form></Form></Card>
    )
}

// 7.2 MTS (Material Transfer Slip)
const mtsSchema = z.object({
    mtaRef: z.string().min(1, "MTA Ref is required."),
    item: z.string().min(1, "Item is required."),
    qtyChecked: z.coerce.number().min(1, "Quantity must be at least 1."),
    status: z.enum(["OK", "Damaged"]),
});
type MtsValues = z.infer<typeof mtsSchema>;

function MtsForm() {
    const { toast } = useToast();
    const form = useForm<MtsValues>({ resolver: zodResolver(mtsSchema), defaultValues: { mtaRef: '', item: '', qtyChecked: 1, status: 'OK' }});
    function onSubmit(data: MtsValues) { console.log(data); toast({ title: "MTS Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Material Transfer Slip QC</CardTitle><CardDescription>Check materials during inter-departmental movement.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                <FormField control={form.control} name="mtaRef" render={({ field }) => (<FormItem><FormLabel>MTA Ref</FormLabel><FormControl><Input placeholder="MTA-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="item" render={({ field }) => (<FormItem><FormLabel>Item</FormLabel><FormControl><Input placeholder="Item Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="qtyChecked" render={({ field }) => (<FormItem><FormLabel>Qty Checked</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="OK">OK</SelectItem><SelectItem value="Damaged">Damaged</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save MTS Report</Button></CardFooter>
        </form></Form></Card>
    );
}

// 7.3 PQC (Process Quality Control)
const pqcSchema = z.object({
  routeCardRef: z.string().min(1, "Route Card Ref is required."),
  stageName: z.string().min(1, "Stage Name is required."),
  operator: z.string().min(1, "Operator is required."),
  observations: z.string().min(1, "Observations are required."),
});
type PqcValues = z.infer<typeof pqcSchema>;

function PqcForm() {
    const { toast } = useToast();
    const form = useForm<PqcValues>({ resolver: zodResolver(pqcSchema), defaultValues: { routeCardRef: '', stageName: '', operator: '', observations: '' }});
    function onSubmit(data: PqcValues) { console.log(data); toast({ title: "PQC Report Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Process Quality Control</CardTitle><CardDescription>Perform in-process quality checks on the production line.</CardDescription></CardHeader>
            <CardContent className="grid gap-6">
                 <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="routeCardRef" render={({ field }) => (<FormItem><FormLabel>Route Card Ref</FormLabel><FormControl><Input placeholder="RC-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="stageName" render={({ field }) => (<FormItem><FormLabel>Stage Name</FormLabel><FormControl><Input placeholder="e.g. Assembly" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="operator" render={({ field }) => (<FormItem><FormLabel>Operator</FormLabel><FormControl><Input placeholder="Operator Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="observations" render={({ field }) => (<FormItem><FormLabel>Observations</FormLabel><FormControl><Textarea placeholder="Note any quality observations..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save PQC Report</Button></CardFooter>
        </form></Form></Card>
    );
}

// 7.4 PDI (Pre-Dispatch)
const pdiSchema = z.object({
  soRef: z.string().min(1, "SO Ref is required."),
  boxNo: z.string().min(1, "Box No is required."),
  packagingCondition: z.enum(["Good", "Fair", "Poor"]),
  labelAccuracy: z.enum(["Correct", "Incorrect"]),
});
type PdiValues = z.infer<typeof pdiSchema>;

function PdiForm() {
    const { toast } = useToast();
    const form = useForm<PdiValues>({ resolver: zodResolver(pdiSchema), defaultValues: { soRef: '', boxNo: '', packagingCondition: "Good", labelAccuracy: "Correct" }});
    function onSubmit(data: PdiValues) { console.log(data); toast({ title: "PDI Report Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Pre-Dispatch Inspection (PDI)</CardTitle><CardDescription>Conduct a final audit before dispatching goods.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                <FormField control={form.control} name="soRef" render={({ field }) => (<FormItem><FormLabel>SO Ref</FormLabel><FormControl><Input placeholder="SO-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="boxNo" render={({ field }) => (<FormItem><FormLabel>Box No</FormLabel><FormControl><Input placeholder="Box-01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="packagingCondition" render={({ field }) => (
                    <FormItem><FormLabel>Packaging Condition</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="Good">Good</SelectItem><SelectItem value="Fair">Fair</SelectItem><SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="labelAccuracy" render={({ field }) => (
                    <FormItem><FormLabel>Label Accuracy</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="Correct">Correct</SelectItem><SelectItem value="Incorrect">Incorrect</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save PDI Report</Button></CardFooter>
        </form></Form></Card>
    );
}

// 7.5 QRD (Quality Rejection Decision)
const qrdSchema = z.object({
  rejectionId: z.string().min(1, "Rejection ID is required."),
  item: z.string().min(1, "Item is required."),
  qty: z.coerce.number().min(1, "Quantity must be at least 1."),
  action: z.enum(["Scrap", "Return", "Rework", "Downgrade"]),
});
type QrdValues = z.infer<typeof qrdSchema>;

function QrdForm() {
    const { toast } = useToast();
    const form = useForm<QrdValues>({ resolver: zodResolver(qrdSchema), defaultValues: { rejectionId: '', item: '', qty: 1, action: "Scrap" }});
    function onSubmit(data: QrdValues) { console.log(data); toast({ title: "QRD Saved" }); form.reset(); }
    return (
        <Card><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader><CardTitle>Quality Rejection Decision</CardTitle><CardDescription>Decide the course of action for rejected materials.</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
                <FormField control={form.control} name="rejectionId" render={({ field }) => (<FormItem><FormLabel>Rejection ID</FormLabel><FormControl><Input placeholder="e.g. REJ-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="item" render={({ field }) => (<FormItem><FormLabel>Item</FormLabel><FormControl><Input placeholder="Item Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="qty" render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="action" render={({ field }) => (
                    <FormItem><FormLabel>Action</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="Scrap">Scrap</SelectItem>
                        <SelectItem value="Return">Return to Vendor</SelectItem>
                        <SelectItem value="Rework">Rework</SelectItem>
                        <SelectItem value="Downgrade">Downgrade</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4"><Button type="submit">Save Decision</Button></CardFooter>
        </form></Form></Card>
    );
}


export default function QualityPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Quality Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="iqc">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="iqc">Incoming (IQC)</TabsTrigger>
            <TabsTrigger value="mts">Transfer (MTS)</TabsTrigger>
            <TabsTrigger value="pqc">Process (PQC)</TabsTrigger>
            <TabsTrigger value="pdi">Pre-Dispatch (PDI)</TabsTrigger>
            <TabsTrigger value="qrd">Rejection (QRD)</TabsTrigger>
          </TabsList>
          <TabsContent value="iqc" className="mt-4">
            <IqcForm />
          </TabsContent>
          <TabsContent value="mts" className="mt-4">
            <MtsForm />
          </TabsContent>
          <TabsContent value="pqc" className="mt-4">
            <PqcForm />
          </TabsContent>
          <TabsContent value="pdi" className="mt-4">
            <PdiForm />
          </TabsContent>
          <TabsContent value="qrd" className="mt-4">
            <QrdForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
