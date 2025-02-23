import { useState } from "react";
import { Customer, Supply } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrinterIcon } from "lucide-react";

interface Props {
  customers: Customer[];
  supplies: Supply[];
}

export default function BillingSection({ customers, supplies }: Props) {
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );

  const areas = Array.from(new Set(customers.map((c) => c.area)));

  const getCustomerBill = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return null;

    const monthSupplies = supplies.filter(
      (s) =>
        s.customerId === customerId &&
        format(s.date, "yyyy-MM") === selectedMonth
    );

    const totalAmount = monthSupplies.reduce((acc, supply) => {
      const jarAmount =
        supply.delivered.jars * (customer.rates.jar || 0);
      const thermosAmount =
        supply.delivered.thermos * (customer.rates.thermos || 0);
      return acc + jarAmount + thermosAmount;
    }, 0);

    const totalPaid = monthSupplies.reduce(
      (acc, supply) => acc + supply.payment,
      0
    );

    return {
      customer,
      supplies: monthSupplies,
      totalAmount,
      totalPaid,
      balance: totalAmount - totalPaid,
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const bill = selectedCustomer ? getCustomerBill(selectedCustomer) : null;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center flex-wrap">
        <select
          className="flex h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedArea}
          onChange={(e) => {
            setSelectedArea(e.target.value);
            setSelectedCustomer("");
          }}
        >
          <option value="">All Areas</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        <select
          className="flex h-9 w-[240px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers
            .filter((c) => !selectedArea || c.area === selectedArea)
            .map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.area}
              </option>
            ))}
        </select>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="flex h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {bill && (
          <Button onClick={handlePrint} className="print:hidden">
            <PrinterIcon className="h-4 w-4 mr-2" /> Print Bill
          </Button>
        )}
      </div>

      {bill && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Bill - {format(new Date(selectedMonth), "MMMM yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="font-semibold">Customer Details:</p>
                  <p>Name: {bill.customer.name}</p>
                  <p>Area: {bill.customer.area}</p>
                  <p>Mobile: {bill.customer.mobile}</p>
                </div>
                <div className="text-right">
                  <p>Total Amount: ₹{bill.totalAmount}</p>
                  <p>Total Paid: ₹{bill.totalPaid}</p>
                  <p className="font-semibold">
                    Balance Due: ₹{bill.balance}
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Jars</TableHead>
                    <TableHead>Thermos</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bill.supplies.map((supply) => {
                    const amount =
                      supply.delivered.jars * bill.customer.rates.jar +
                      supply.delivered.thermos * bill.customer.rates.thermos;

                    return (
                      <TableRow key={supply.id}>
                        <TableCell>
                          {format(supply.date, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{supply.delivered.jars}</TableCell>
                        <TableCell>{supply.delivered.thermos}</TableCell>
                        <TableCell>₹{amount}</TableCell>
                        <TableCell>₹{supply.payment}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
