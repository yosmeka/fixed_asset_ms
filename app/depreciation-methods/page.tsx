'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DepreciationMethodForm } from '@/components/depreciation/depreciation-method-form';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface DepreciationMethod {
  id: string;
  name: string;
  description: string | null;
  formula: string;
  isActive: boolean;
  createdAt: Date;
}

export default function DepreciationMethodsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [methods, setMethods] = useState<DepreciationMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await fetch('/api/depreciation-methods');
        if (!response.ok) {
          throw new Error('Failed to fetch depreciation methods');
        }
        const data = await response.json();
        setMethods(data);
      } catch (error) {
        console.error('Error fetching depreciation methods:', error);
        toast.error('Failed to fetch depreciation methods');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchMethods();
    }
  }, [session]);

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Depreciation Methods</h1>
        <Button onClick={() => router.push('/depreciation-methods/new')}>
          Add New Method
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Method</h2>
          <DepreciationMethodForm />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Existing Methods</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Formula</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell>{method.name}</TableCell>
                  <TableCell>{method.formula}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        method.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {method.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(method.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 