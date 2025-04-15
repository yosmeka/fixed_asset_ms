'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const depreciationMethodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  formula: z.string().min(1, 'Formula is required'),
  isActive: z.boolean().default(true),
});

type DepreciationMethodFormValues = z.infer<typeof depreciationMethodSchema>;

export function DepreciationMethodForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DepreciationMethodFormValues>({
    resolver: zodResolver(depreciationMethodSchema),
    defaultValues: {
      name: '',
      description: '',
      formula: '',
      isActive: true,
    },
  });

  const onSubmit = async (data: DepreciationMethodFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/depreciation-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create depreciation method');
      }

      toast.success('Depreciation method created successfully');
      form.reset();
    } catch (error) {
      console.error('Error creating depreciation method:', error);
      toast.error('Failed to create depreciation method');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter method name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="formula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formula</FormLabel>
              <FormControl>
                <Input placeholder="Enter formula" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'true')}
                defaultValue={field.value ? 'true' : 'false'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Method'}
        </Button>
      </form>
    </Form>
  );
} 