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

export default function FinancePage() {
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
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Finance Management" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
      </main>
    </div>
  );
}
