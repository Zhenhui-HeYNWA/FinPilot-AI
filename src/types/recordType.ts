import { ComponentType, SVGProps } from 'react';

export type RecordType = 'income' | 'expense';

export interface CategoryOption {
  label: string;
  value: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}
import {
  Utensils,
  ShoppingCart,
  Gift,
  Home,
  Heart,
  Book,
  Banknote,
  Bus,
  Drama,
  ReceiptText,
  BookmarkMinus,
  BadgeDollarSign,
  SquareActivity,
  BookmarkPlus,
  Receipt,
} from 'lucide-react';

export const RecordCategory: Record<RecordType, CategoryOption[]> = {
  expense: [
    { label: 'Food', value: 'food', icon: Utensils },
    { label: 'Shopping', value: 'shopping', icon: ShoppingCart },
    { label: 'Transport', value: 'transport', icon: Bus },
    { label: 'Entertainment', value: 'entertainment', icon: Drama },
    { label: 'Housing', value: 'housing', icon: Home },
    { label: 'Bill', value: 'bill', icon: Receipt },
    { label: 'Health', value: 'health', icon: Heart },
    { label: 'Education', value: 'education', icon: Book },
    { label: 'Other', value: 'other', icon: BookmarkMinus },
  ],
  income: [
    { label: 'Salary', value: 'salary', icon: Banknote },
    { label: 'Bonus', value: 'bonus', icon: BadgeDollarSign },
    { label: 'Investment', value: 'investment', icon: SquareActivity },
    { label: 'Gift', value: 'gift', icon: Gift },
    { label: 'Refund', value: 'refund', icon: ReceiptText },
    { label: 'Other', value: 'other', icon: BookmarkPlus },
  ],
};

export const recordTypeOptions = [
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
];
export const categoryOptions = [
  { label: 'Salary', value: 'salary', icon: Banknote },
  { label: 'Bonus', value: 'bonus', icon: BadgeDollarSign },
  { label: 'Investment', value: 'investment', icon: SquareActivity },
  { label: 'Gift', value: 'gift', icon: Gift },
  { label: 'Refund', value: 'refund', icon: ReceiptText },

  { label: 'Food', value: 'food', icon: Utensils },
  { label: 'Shopping', value: 'shopping', icon: ShoppingCart },
  { label: 'Transport', value: 'transport', icon: Bus },
  { label: 'Entertainment', value: 'entertainment', icon: Drama },
  { label: 'Housing', value: 'housing', icon: Home },
  { label: 'Bill', value: 'bill', icon: Receipt },
  { label: 'Health', value: 'health', icon: Heart },
  { label: 'Education', value: 'education', icon: Book },
  { label: 'Other', value: 'other', icon: BookmarkMinus },
];

export type RecordProps = {
  id: string;
  userId: string;
  recordType: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
};
