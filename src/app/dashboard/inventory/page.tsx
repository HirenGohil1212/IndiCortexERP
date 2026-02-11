import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function InventoryPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Inventory" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>Track stock levels, manage warehouses, and oversee inventory movements.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Inventory module content will be displayed here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
