'use client';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { RecordCategory, RecordType } from '@/types/recordType';
import { formSchema } from '@/lib/zod/validation';

import { useCreateRecord } from '@/hooks/useRecord';
import toast, { Toaster } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function AddNewRecord() {
  const queryClient = useQueryClient();
  const createRecord = useCreateRecord();
  const [recordType, setRecordType] = useState<RecordType>('income');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recordType: 'income',
      amount: 0,
      description: '',
      category: '',
      date: new Date(),
    },
  });

  const categoryOptions = RecordCategory[recordType];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createRecord.mutate(values, {
      onSuccess: async (data) => {
        toast.success('Record created successfully');
        console.log('Record created successfully', data);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['income'] }),
          queryClient.invalidateQueries({ queryKey: ['expense'] }),
        ]);
        form.reset();
      },

      onError: (error) => {
        console.error('Error creating record', error);
      },
    });
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>Add a new record</CardTitle>
        <CardDescription>Record new income or expenses</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6 px-6'>
          {/* Record Type */}
          <FormField
            control={form.control}
            name='recordType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      setRecordType(value as RecordType);
                    }}
                    defaultValue={field.value}
                    className='flex space-x-4'>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value='income'
                        id='income'
                      />
                      <label
                        htmlFor='income'
                        className='flex items-center gap-1'>
                        <Plus
                          size={16}
                          className='text-green-600'
                        />
                        Income
                      </label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value='expense'
                        id='expense'
                      />
                      <label
                        htmlFor='expense'
                        className='flex items-center gap-1'>
                        <Minus
                          size={16}
                          className='text-red-600'
                        />
                        Expense
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount ($)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='0.00'
                    type='number'
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Optional note'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(({ label, value, icon: Icon }) => (
                        <SelectItem
                          key={value}
                          value={value}>
                          <div className='flex items-center gap-2'>
                            <Icon className='w-4 h-4 text-muted-foreground' />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}>
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value
                          ? format(field.value, 'PPP')
                          : 'Pick a date'}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0'
                    align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full font-bold'>
            Add a new record
          </Button>
        </form>
      </Form>
      <CardFooter />
      <Toaster />
    </Card>
  );
}
