
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface Props {
  customers: Customer[];
  supplies: Supply[];
  setSupplies: (supplies: Supply[]) => void;
}

export default function SupplySheet({ customers, supplies, setSupplies }: Props) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [supplyData, setSupplyData] = useState<
    Record<
      string,
      {
        delivered: { jars: string; thermos: string };
        returned: { jars: string; thermos: string };
        payment: string;
      }
    >
  >({});

  const areas = Array.from(new Set(customers.map((c) => c.area)));

  const handleSaveSupplies = () => {
    const newSupplies: Supply[] = Object.entries(supplyData).map(
      ([customerId, data]) => ({
        id: crypto.randomUUID(),
        customerId,
        date: date,
        delivered: {
          jars: parseInt(data.delivered.jars || "0"),
          thermos: parseInt(data.delivered.thermos || "0"),
        },
        returned: {
          jars: parseInt(data.returned.jars || "0"),
          thermos: parseInt(data.returned.thermos || "0"),
        },
        payment: parseFloat(data.payment || "0"),
      })
    );

    setSupplies([...supplies, ...newSupplies]);
    setSupplyData({});
    toast({
      title: "Success",
      description: "Supply data saved successfully",
    });
  };

  const updateSupplyData = (
    customerId: string,
    field: string,
    subField: string,
    value: string
  ) => {
    setSupplyData((prev) => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [field]: {
          ...prev[customerId]?.[field],
          [subField]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <select
          className="flex h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          <option value="">Select Area</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        <Button onClick={handleSaveSupplies}>Save Supplies</Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Customer</TableHead>
              <TableHead className="w-[100px]">Jars Del.</TableHead>
              <TableHead className="w-[100px]">Jars Ret.</TableHead>
              <TableHead className="w-[100px]">Thermos Del.</TableHead>
              <TableHead className="w-[100px]">Thermos Ret.</TableHead>
              <TableHead className="w-[100px]">Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers
              .filter((c) => !selectedArea || c.area === selectedArea)
              .map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    {customer.preferences.jar && (
                      <Input
                        type="number"
                        value={
                          supplyData[customer.id]?.delivered?.jars || ""
                        }
                        onChange={(e) =>
                          updateSupplyData(
                            customer.id,
                            "delivered",
                            "jars",
                            e.target.value
                          )
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.preferences.jar && (
                      <Input
                        type="number"
                        value={
                          supplyData[customer.id]?.returned?.jars || ""
                        }
                        onChange={(e) =>
                          updateSupplyData(
                            customer.id,
                            "returned",
                            "jars",
                            e.target.value
                          )
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.preferences.thermos && (
                      <Input
                        type="number"
                        value={
                          supplyData[customer.id]?.delivered?.thermos || ""
                        }
                        onChange={(e) =>
                          updateSupplyData(
                            customer.id,
                            "delivered",
                            "thermos",
                            e.target.value
                          )
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.preferences.thermos && (
                      <Input
                        type="number"
                        value={
                          supplyData[customer.id]?.returned?.thermos || ""
                        }
                        onChange={(e) =>
                          updateSupplyData(
                            customer.id,
                            "returned",
                            "thermos",
                            e.target.value
                          )
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={supplyData[customer.id]?.payment || ""}
                      onChange={(e) =>
                        setSupplyData((prev) => ({
                          ...prev,
                          [customer.id]: {
                            ...prev[customer.id],
                            payment: e.target.value,
                          },
                        }))
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
