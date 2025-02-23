
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerManagement from "@/components/CustomerManagement";
import SupplySheet from "@/components/SupplySheet";
import BillingSection from "@/components/BillingSection";
import { Customer, Supply } from "@/types";

export default function Index() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);

  return (
    <div className="container mx-auto py-6 px-4 min-h-screen bg-background animate-fadeIn">
      <Card className="w-full shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Aqua Thermos Management System
          </CardTitle>
          <CardDescription className="text-center">
            Manage your water jar and thermos distribution efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="customers" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="supply">Supply Sheet</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="customers">
              <CustomerManagement
                customers={customers}
                setCustomers={setCustomers}
              />
            </TabsContent>
            <TabsContent value="supply">
              <SupplySheet
                customers={customers}
                supplies={supplies}
                setSupplies={setSupplies}
              />
            </TabsContent>
            <TabsContent value="billing">
              <BillingSection customers={customers} supplies={supplies} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
