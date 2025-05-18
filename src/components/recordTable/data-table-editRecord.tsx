import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RecordCategory, RecordProps, RecordType } from '@/types/recordType';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { formSchema } from '@/lib/zod/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Minus, Plus } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { DialogClose } from '../ui/dialog';
import toast from 'react-hot-toast';
import { useUpdateRecord } from '@/hooks/useRecord';
type Props = {
  record: RecordProps;
};
const EditRecord = ({ record }: Props) => {
  const [recordType, setRecordType] = useState(record.recordType as RecordType);

  const { updateRecord, isPending } = useUpdateRecord();

  const categoryOptions = RecordCategory[recordType];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recordType,
      amount: record.amount,
      description: record.description || '',
      category: record.category || '',
      date: new Date(record.date),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateRecord(
      {
        data: values,
        recordId: record.id,
      },

      {
        onSuccess: () => {
          toast.success('Record updated successfully');
        },
        onError: () => {
          toast.error('Failed to update record');
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Record Type */}
        <FormField
          control={form.control}
          name='recordType'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='w-full'>Record Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setRecordType(value as RecordType);
                  }}
                  defaultValue={recordType}
                  className='flex space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='income'
                      id='income'
                    />
                    <Label
                      htmlFor='income'
                      className='flex items-center gap-1'>
                      <Plus
                        size={16}
                        className='text-green-600'
                      />
                      Income
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='expense'
                      id='expense'
                    />
                    <Label
                      htmlFor='expense'
                      className='flex items-center gap-1'>
                      <Minus
                        size={16}
                        className='text-red-600'
                      />
                      Expense
                    </Label>
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
              <FormLabel className='mt-2'>Amount ($)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={record.amount.toString()}
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
                  placeholder={record.description || 'No description'}
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
                    <SelectValue placeholder={record.category} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(({ label, value, icon: Icon }) => (
                      <SelectItem
                        // defaultChecked={value === record.category}
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
            <FormItem className='flex flex-col mt-2'>
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
                      {field.value ? format(field.value, 'PPP') : 'Pick a date'}
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

        <DialogClose asChild>
          <Button
            type='submit'
            className='w-full font-bold mt-6 '>
            Edit record
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
};

export default EditRecord;
