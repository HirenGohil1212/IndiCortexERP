import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Reports" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Reporting & Analytics</CardTitle>
            <CardDescription>Generate comprehensive reports and gain insights from your ERP data.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Reports module content will be displayed here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
