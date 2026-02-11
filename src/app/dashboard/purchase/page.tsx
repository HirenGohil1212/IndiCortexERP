import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PurchasePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Purchase" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Management</CardTitle>
            <CardDescription>Streamline purchasing with automated barcode tracking, invoice upload and integrated quality control (IQC) processes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Purchase module content will be displayed here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
