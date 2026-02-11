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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// 1. Journal Voucher
const journalVoucherSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  debitAccount: z.string().min(1, "Debit account is required."),
  creditAccount: z.string().min(1, "Credit account is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  narration: z.string().min(1, "Narration is required."),
});
type JournalVoucherFormValues = z.infer<typeof journalVoucherSchema>;

function JournalVoucherForm() {
  const { toast } = useToast();
  const form = useForm<JournalVoucherFormValues>({
    resolver: zodResolver(journalVoucherSchema),
    defaultValues: {
      date: new Date(),
      debitAccount: '',
      creditAccount: '',
      amount: 0,
      narration: '',
    },
  });

  function onSubmit(data: JournalVoucherFormValues) {
    console.log(data);
    toast({
      title: "Journal Voucher Saved",
      description: "The new journal voucher has been successfully saved.",
    });
    form.reset();
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>New Journal Voucher</CardTitle>
            <CardDescription>Create an adjustment entry for your accounts.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label>Journal No</Label>
                <Input disabled placeholder="Auto-generated" />
              </div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Date</FormLabel>
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
            </div>
            <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="debitAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Debit Account</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Rent Expense" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creditAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Account</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Cash" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FormField
                control={form.control}
                name="narration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Narration</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a brief description of the transaction"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Save Journal Voucher</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// 2. Voucher Payment & Receipt
const paymentReceiptSchema = z.object({
  voucherType: z.enum(["Payment", "Receipt"]),
  date: z.date({ required_error: "A date is required." }),
  partyName: z.string().min(1, "Party name is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  mode: z.enum(["Cheque", "NEFT", "Cash"]),
  refNo: z.string().optional(),
});
type PaymentReceiptFormValues = z.infer<typeof paymentReceiptSchema>;

function PaymentReceiptForm() {
  const { toast } = useToast();
  const form = useForm<PaymentReceiptFormValues>({
    resolver: zodResolver(paymentReceiptSchema),
    defaultValues: {
      voucherType: 'Payment',
      date: new Date(),
      partyName: '',
      amount: 0,
      mode: 'Cheque',
    },
  });

  function onSubmit(data: PaymentReceiptFormValues) {
    console.log(data);
    toast({
      title: "Voucher Saved",
      description: `The ${data.voucherType} voucher has been successfully saved.`,
    });
    form.reset();
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>New Payment / Receipt Voucher</CardTitle>
            <CardDescription>Record a bank or cash transaction.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="voucherType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Voucher Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Payment" />
                        </FormControl>
                        <FormLabel className="font-normal">Payment</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Receipt" />
                        </FormControl>
                        <FormLabel className="font-normal">Receipt</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Party Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode of payment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="NEFT">NEFT</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="refNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference No.</FormLabel>
                    <FormControl>
                      <Input placeholder="Cheque or transaction ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Save Voucher</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

// 3. Contra Voucher
const contraVoucherSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  fromAccount: z.string().min(1, "From account is required."),
  toAccount: z.string().min(1, "To account is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
});
type ContraVoucherFormValues = z.infer<typeof contraVoucherSchema>;

function ContraVoucherForm() {
    const { toast } = useToast();
    const form = useForm<ContraVoucherFormValues>({
        resolver: zodResolver(contraVoucherSchema),
        defaultValues: { date: new Date(), fromAccount: '', toAccount: '', amount: 0 }
    });
    function onSubmit(data: ContraVoucherFormValues) {
        console.log(data);
        toast({ title: "Contra Voucher Saved" });
        form.reset();
    }
    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>New Contra Voucher</CardTitle>
                        <CardDescription>Record a cash deposit or withdrawal.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                       <div className="grid md:grid-cols-4 gap-4">
                            <FormField
                                control={form.control} name="date"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField control={form.control} name="fromAccount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>From Account</FormLabel>
                                    <FormControl><Input placeholder="e.g. Cash" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="toAccount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>To Account</FormLabel>
                                    <FormControl><Input placeholder="e.g. Bank" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit">Save Contra Voucher</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

// 4. GST Journal Voucher
const gstJournalSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  gstLedger: z.enum(["Input", "Output"]),
  adjustmentType: z.string().min(1, "Adjustment type is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
});
type GstJournalFormValues = z.infer<typeof gstJournalSchema>;

function GstJournalForm() {
    const { toast } = useToast();
    const form = useForm<GstJournalFormValues>({
        resolver: zodResolver(gstJournalSchema),
        defaultValues: { date: new Date(), gstLedger: 'Input', adjustmentType: '', amount: 0 }
    });
    function onSubmit(data: GstJournalFormValues) {
        console.log(data);
        toast({ title: "GST Journal Saved" });
        form.reset();
    }
    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>New GST Journal Voucher</CardTitle>
                        <CardDescription>Record a tax adjustment.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid md:grid-cols-4 gap-4">
                            <FormField
                                control={form.control} name="date"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control} name="gstLedger"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GST Ledger</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Input">Input</SelectItem>
                                        <SelectItem value="Output">Output</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField control={form.control} name="adjustmentType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adjustment Type</FormLabel>
                                    <FormControl><Input placeholder="e.g. Reversal" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit">Save GST Journal</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

// 5. Bank Reconciliation
const bankReconciliationSchema = z.object({
  bankAccount: z.string().min(1, "Bank account is required."),
  statementDate: z.date({ required_error: "Statement date is required." }),
  systemBalance: z.coerce.number(),
  bankBalance: z.coerce.number(),
});
type BankReconciliationFormValues = z.infer<typeof bankReconciliationSchema>;

function BankReconciliationForm() {
    const { toast } = useToast();
    const form = useForm<BankReconciliationFormValues>({
        resolver: zodResolver(bankReconciliationSchema),
        defaultValues: { bankAccount: '', statementDate: new Date(), systemBalance: 0, bankBalance: 0 }
    });
    const unreconciledAmount = form.watch('systemBalance') - form.watch('bankBalance');

    function onSubmit(data: BankReconciliationFormValues) {
        console.log(data);
        toast({ title: "Bank Reconciliation Saved" });
        form.reset();
    }
    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Bank Reconciliation</CardTitle>
                        <CardDescription>Match your books with the bank statement.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="bankAccount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Account</FormLabel>
                                    <FormControl><Input placeholder="Select Bank Account" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField
                                control={form.control} name="statementDate"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Statement Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                             <FormField control={form.control} name="systemBalance" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System Balance</FormLabel>
                                    <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="bankBalance" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Balance</FormLabel>
                                    <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <div className="grid gap-2">
                                <Label>Unreconciled Amount</Label>
                                <Input disabled value={unreconciledAmount.toFixed(2)} />
                             </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit">Save Reconciliation</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

// 6. Credit Card Statement
const creditCardStatementSchema = z.object({
  cardNumber: z.string().min(1, "Card number is required."),
  statementMonth: z.date({ required_error: "Statement month is required." }),
  transactionDate: z.date({ required_error: "Transaction date is required." }),
  merchant: z.string().min(1, "Merchant is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  expenseHead: z.string().min(1, "Expense head is required."),
});
type CreditCardStatementFormValues = z.infer<typeof creditCardStatementSchema>;

function CreditCardStatementForm() {
    const { toast } = useToast();
    const form = useForm<CreditCardStatementFormValues>({
        resolver: zodResolver(creditCardStatementSchema),
        defaultValues: { cardNumber: '', statementMonth: new Date(), transactionDate: new Date(), merchant: '', amount: 0, expenseHead: '' }
    });
    function onSubmit(data: CreditCardStatementFormValues) {
        console.log(data);
        toast({ title: "Credit Card Transaction Saved" });
        form.reset();
    }
    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Log Credit Card Expense</CardTitle>
                        <CardDescription>Record a single transaction from a credit card statement.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid md:grid-cols-3 gap-4">
                             <FormField control={form.control} name="cardNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl><Input placeholder="Last 4 digits" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField
                                control={form.control} name="statementMonth"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Statement Month</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "MMM yyyy") : <span>Pick a month</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                             <FormField
                                control={form.control} name="transactionDate"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Transaction Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                              <FormField control={form.control} name="merchant" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Merchant</FormLabel>
                                    <FormControl><Input placeholder="e.g. Amazon" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                              <FormField control={form.control} name="expenseHead" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expense Head</FormLabel>
                                    <FormControl><Input placeholder="e.g. Office Supplies" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit">Save Transaction</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}


export default function FinancePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Finance Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="journal-voucher">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="journal-voucher">Journal Voucher</TabsTrigger>
            <TabsTrigger value="payment-receipt">Payment/Receipt</TabsTrigger>
            <TabsTrigger value="contra">Contra</TabsTrigger>
            <TabsTrigger value="gst-journal">GST Journal</TabsTrigger>
            <TabsTrigger value="bank-reconciliation">Bank Reconciliation</TabsTrigger>
            <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
          </TabsList>
          <TabsContent value="journal-voucher" className="mt-4">
            <JournalVoucherForm />
          </TabsContent>
          <TabsContent value="payment-receipt" className="mt-4">
            <PaymentReceiptForm />
          </TabsContent>
          <TabsContent value="contra" className="mt-4">
            <ContraVoucherForm />
          </TabsContent>
          <TabsContent value="gst-journal" className="mt-4">
            <GstJournalForm />
          </TabsContent>
          <TabsContent value="bank-reconciliation" className="mt-4">
            <BankReconciliationForm />
          </TabsContent>
          <TabsContent value="credit-card" className="mt-4">
            <CreditCardStatementForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

    
