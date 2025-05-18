'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Edit, X } from 'lucide-react';
import { useDeleteRecord } from '@/hooks/useRecord';

import Loading from '../ui/loading';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';

import EditRecord from './data-table-editRecord';
import { RecordProps } from '@/types/recordType';
import toast from 'react-hot-toast';

type Props = {
  record: RecordProps;
};

const DataTableRowActions = ({ record }: Props) => {
  const { deleteRecord, isPending } = useDeleteRecord();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
  const dropdownTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const focusRef = React.useRef<HTMLElement | null>(null);

  const handleDialogItemSelect = () => {
    focusRef.current = dropdownTriggerRef.current;
  };

  const handleDialogItemOpenChange = (open: boolean) => {
    setHasOpenDialog(open);
    if (!open) {
      setDropdownOpen(false);
    }
  };

  const handleDelete = (recordId: string) => {
    deleteRecord(recordId, {
      onSuccess: () => {
        toast.success('The record has been deleted successfully.');
      },
      onError: () => {
        toast('There was an error deleting the record.');
      },
    });
  };

  if (isPending) return <Loading />;

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-8 w-8 p-0'
          ref={dropdownTriggerRef}>
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        hidden={hasOpenDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus();
            focusRef.current = null;
            event.preventDefault();
          }
        }}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Edit Dialog Item */}
        <DialogItem
          triggerChildren={
            <>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </>
          }
          onSelect={handleDialogItemSelect}
          onOpenChange={handleDialogItemOpenChange}>
          <DialogHeader>
            <DialogTitle>Edit record</DialogTitle>
            <DialogDescription>
              Make changes to this record. Click save when done.
            </DialogDescription>
          </DialogHeader>

          <EditRecord record={record} />
        </DialogItem>

        {/* Delete Dialog Item */}
        <DialogItem
          triggerChildren={
            <>
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </>
          }
          onSelect={handleDialogItemSelect}
          onOpenChange={handleDialogItemOpenChange}>
          <DialogHeader>
            <DialogTitle>Delete Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex flex-row justify-between'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button
              variant='destructive'
              onClick={() => handleDelete(record.id)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableRowActions;

// Reusable DialogItem component
const DialogItem = React.forwardRef<
  HTMLDivElement,
  {
    triggerChildren: React.ReactNode;
    children: React.ReactNode;
    onSelect?: () => void;
    onOpenChange?: (open: boolean) => void;
  }
>(({ triggerChildren, children, onSelect, onOpenChange }, ref) => {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          ref={ref}
          className='cursor-pointer'
          onSelect={(event) => {
            event.preventDefault();
            onSelect?.();
          }}>
          {triggerChildren}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className='fixed inset-0 bg-black/10' />
        <DialogContent className='w-96 rounded-lg'>{children}</DialogContent>
      </DialogPortal>
    </Dialog>
  );
});
DialogItem.displayName = 'DialogItem';
