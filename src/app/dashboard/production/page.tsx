import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProductionPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Production" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Production Planning</CardTitle>
            <CardDescription>Automate production with Bill of Materials (BOM), Routecards, and real-time shop floor data collection.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Production module content will be displayed here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
