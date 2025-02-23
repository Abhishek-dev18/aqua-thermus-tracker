
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface Props {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
}

export default function CustomerManagement({ customers, setCustomers }: Props) {
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    area: "",
    mobile: "",
    jar: false,
    thermos: false,
    jarRate: "0",
    thermosRate: "0",
  });

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.area || !newCustomer.mobile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    const customer: Customer = {
      id: selectedCustomer?.id || crypto.randomUUID(),
      name: newCustomer.name,
      area: newCustomer.area,
      mobile: newCustomer.mobile,
      preferences: {
        jar: newCustomer.jar,
        thermos: newCustomer.thermos,
      },
      rates: {
        jar: parseFloat(newCustomer.jarRate),
        thermos: parseFloat(newCustomer.thermosRate),
      },
      createdAt: selectedCustomer?.createdAt || new Date(),
    };

    if (selectedCustomer) {
      setCustomers(
        customers.map((c) => (c.id === selectedCustomer.id ? customer : c))
      );
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
    } else {
      setCustomers([...customers, customer]);
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
    }

    setSelectedCustomer(null);
    setNewCustomer({
      name: "",
      area: "",
      mobile: "",
      jar: false,
      thermos: false,
      jarRate: "0",
      thermosRate: "0",
    });
    setIsDialogOpen(false);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNewCustomer({
      name: customer.name,
      area: customer.area,
      mobile: customer.mobile,
      jar: customer.preferences.jar,
      thermos: customer.preferences.thermos,
      jarRate: customer.rates.jar.toString(),
      thermosRate: customer.rates.thermos.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (customerId: string) => {
    setCustomers(customers.filter((c) => c.id !== customerId));
    toast({
      title: "Success",
      description: "Customer deleted successfully",
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedCustomer(null);
    setNewCustomer({
      name: "",
      area: "",
      mobile: "",
      jar: false,
      thermos: false,
      jarRate: "0",
      thermosRate: "0",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setIsDialogOpen(true)}
            >
              Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedCustomer ? "Edit Customer" : "Add New Customer"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={newCustomer.area}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, area: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  value={newCustomer.mobile}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, mobile: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="jar"
                  checked={newCustomer.jar}
                  onCheckedChange={(checked) =>
                    setNewCustomer({ ...newCustomer, jar: checked as boolean })
                  }
                />
                <Label htmlFor="jar">Water Jar</Label>
                {newCustomer.jar && (
                  <Input
                    type="number"
                    placeholder="Rate"
                    className="w-24 ml-2"
                    value={newCustomer.jarRate}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, jarRate: e.target.value })
                    }
                  />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="thermos"
                  checked={newCustomer.thermos}
                  onCheckedChange={(checked) =>
                    setNewCustomer({
                      ...newCustomer,
                      thermos: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="thermos">Thermos</Label>
                {newCustomer.thermos && (
                  <Input
                    type="number"
                    placeholder="Rate"
                    className="w-24 ml-2"
                    value={newCustomer.thermosRate}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        thermosRate: e.target.value,
                      })
                    }
                  />
                )}
              </div>
            </div>
            <Button onClick={handleAddCustomer}>
              {selectedCustomer ? "Update Customer" : "Add Customer"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Rates</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.area}</TableCell>
                <TableCell>{customer.mobile}</TableCell>
                <TableCell>
                  {[
                    customer.preferences.jar ? "Jar" : "",
                    customer.preferences.thermos ? "Thermos" : "",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {customer.preferences.jar
                    ? `Jar: ₹${customer.rates.jar} `
                    : ""}
                  {customer.preferences.thermos
                    ? `Thermos: ₹${customer.rates.thermos}`
                    : ""}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
