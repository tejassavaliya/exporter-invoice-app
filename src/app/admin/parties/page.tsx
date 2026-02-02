import { getParties, createParty, deleteParty } from "@/actions/party-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CsvUploadDialog } from "@/components/csv-upload-dialog";

export default async function PartiesPage() {
  const parties = await getParties();

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Party Master</h1>
        <CsvUploadDialog 
          entityName="Parties" 
          expectedHeaders={["name", "type", "address", "gstNo", "iec", "pan"]}
          uploadUrl="/api/parties/upload"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Party</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createParty} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Party Type</Label>
                  <select 
                    name="type" 
                    id="type" 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="EXPORTER">Exporter</option>
                    <option value="CONSIGNEE">Consignee</option>
                    <option value="NOTIFY_PARTY">Notify Party</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input name="name" id="name" required placeholder="Name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <textarea 
                    name="address" 
                    id="address" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Full Address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstNo">GST No</Label>
                    <Input name="gstNo" id="gstNo" placeholder="GST" />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="iec">IEC</Label>
                     <Input name="iec" id="iec" placeholder="IEC" />
                  </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pan">PAN</Label>
                    <Input name="pan" id="pan" placeholder="PAN" />
                </div>

                <Button type="submit" className="w-full">Save Party</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Existing Parties</CardTitle>
            </CardHeader>
            <CardContent>
              {parties.length === 0 ? (
                <p className="text-muted-foreground text-sm">No parties found. Add one to get started.</p>
              ) : (
                <div className="space-y-4">
                  {parties.map((party) => (
                    <div key={party.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{party.name}</span>
                          <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{party.type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">{party.address}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          {party.gstNo && <span>GST: {party.gstNo}</span>}
                          {party.iec && <span>IEC: {party.iec}</span>}
                        </div>
                      </div>
                      <form action={deleteParty.bind(null, party.id)}>
                        <Button variant="ghost" size="sm" className="text-destructive h-8 px-2">
                          Delete
                        </Button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
