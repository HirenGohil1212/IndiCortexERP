import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function FinancePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Finance" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Financial Accounting</CardTitle>
            <CardDescription>Full financial suite with GST compliance and double-entry accounting.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Finance module content will be displayed here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
