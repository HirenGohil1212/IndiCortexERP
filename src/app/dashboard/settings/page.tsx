import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Settings" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Trigger Engine</CardTitle>
              <CardDescription>
                Configure automated notifications via WhatsApp and Email for
                status changes and reminders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp-gateway">
                    WhatsApp Gateway URL
                  </Label>
                  <Input
                    id="whatsapp-gateway"
                    placeholder="https://your-gateway.example.com"
                  />
                </div>
                <div>
                    <Label className="mb-4 block">Notification Events</Label>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="event-new-order" defaultChecked />
                            <label htmlFor="event-new-order">New Sales Order</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="event-po-raised" defaultChecked />
                            <label htmlFor="event-po-raised">Purchase Order Raised</label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="event-prod-complete" />
                            <label htmlFor="event-prod-complete">Production Order Completed</label>
                        </div>
                    </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Users & Roles</CardTitle>
              <CardDescription>
                Manage user access and permissions with Role-Based Access
                Control.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                 <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="user-name">User</Label>
                      <span>Olivia Martin</span>
                    </div>
                    <div className="grid gap-2">
                       <Label htmlFor="role">Role</Label>
                        <Select defaultValue="viewer">
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
              </form>
            </CardContent>
             <CardFooter className="border-t px-6 py-4">
              <Button>Update Role</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
