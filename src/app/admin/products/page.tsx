import { getProducts, createProduct, deleteProduct } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Product Master</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createProduct} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input name="name" id="name" required placeholder="E.g. Cotton Shirt" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    name="description" 
                    id="description" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Detailed description for invoice"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hsn">HSN Code</Label>
                    <Input name="hsn" id="hsn" placeholder="HSN" />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="unit">Unit</Label>
                     <Input name="unit" id="unit" placeholder="e.g. KGS, PCS" />
                  </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="unitPrice">Unit Price (USD)</Label>
                    <Input name="unitPrice" id="unitPrice" type="number" step="0.01" placeholder="0.00" />
                </div>

                <Button type="submit" className="w-full">Save Product</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Existing Products</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="text-muted-foreground text-sm">No products found. Add one to get started.</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{product.name}</span>
                          {product.hsn && <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">HSN: {product.hsn}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          {product.unitPrice && <span>Price: ${product.unitPrice}</span>}
                          {product.unit && <span>Unit: {product.unit}</span>}
                        </div>
                      </div>
                      <form action={deleteProduct.bind(null, product.id)}>
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
