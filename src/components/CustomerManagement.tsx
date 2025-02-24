
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
      id: crypto.randomUUID(),
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
      createdAt: new Date(),
    };

    setCustomers([...customers, customer]);
    setNewCustomer({
      name: "",
      area: "",
      mobile: "",
      jar: false,
      thermos: false,
      jarRate: "0",
      thermosRate: "0",
    });

    toast({
      title: "Success",
      description: "Customer added successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
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
            <Button onClick={handleAddCustomer}>Add Customer</Button>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
