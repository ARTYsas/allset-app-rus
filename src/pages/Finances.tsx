
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import InvoiceForm from '@/components/Invoice/InvoiceForm';
import { Invoice } from '@/types';

// Mock data for the form
const mockClients = [
  { id: 'client-1', name: 'Tech Solutions Inc.' },
  { id: 'client-2', name: 'Digital Marketing Agency' },
  { id: 'client-3', name: 'E-commerce Store' }
];

const mockProjects = [
  { id: 'project-1', name: 'Website Redesign', clientId: 'client-1' },
  { id: 'project-2', name: 'Mobile App Development', clientId: 'client-1' },
  { id: 'project-3', name: 'SEO Optimization', clientId: 'client-2' },
  { id: 'project-4', name: 'Social Media Campaign', clientId: 'client-2' },
  { id: 'project-5', name: 'Product Photography', clientId: 'client-3' }
];

const Finances = () => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  
  const handleCreateInvoice = () => {
    setShowInvoiceForm(true);
  };
  
  const handleInvoiceSubmit = (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    // In a real app, this would send the data to Firebase
    console.log('Invoice created:', invoiceData);
    setShowInvoiceForm(false);
    // You would add the invoice to your state and/or Firestore here
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
          <p className="text-muted-foreground">Manage your invoices and income</p>
        </div>
        <Button onClick={handleCreateInvoice} className="mt-4 md:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
      </div>

      {showInvoiceForm ? (
        <InvoiceForm 
          clients={mockClients}
          projects={mockProjects}
          onSubmit={handleInvoiceSubmit}
        />
      ) : (
        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoice List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice #
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">INV-001</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tech Solutions Inc.</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Apr 10, 2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$2,500.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">INV-002</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Digital Marketing Agency</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Apr 15, 2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$1,800.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">INV-003</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">E-commerce Store</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Apr 22, 2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$3,200.00</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Overdue
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Income Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Monthly income statistics and tax calculations will appear here.
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Total Income (2023)</h3>
                    <p className="text-2xl font-bold">$45,200.00</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Tax Estimate</h3>
                    <p className="text-2xl font-bold">$6,780.00</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Net Profit</h3>
                    <p className="text-2xl font-bold">$38,420.00</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect with "Мой налог" API to automatically calculate and pay your taxes.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="receipts">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate and manage receipts for your clients.
                </p>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Receipt
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Finances;
