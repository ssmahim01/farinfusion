/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateOrderMutation } from '@/redux/features/orders/ordersApi';
import { toast } from 'sonner';
import {
  FilePenLine,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  StickyNote,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/types';

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  address: z.string().min(3, 'Address is required'),
  paymentMethod: z.enum(['COD', 'ONLINE', 'CARD']),
  shippingCost: z.coerce.number().min(0, 'Must be 0 or more'),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function FormField({
  icon: Icon,
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  icon: React.ElementType;
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
      >
        <Icon className="h-3 w-3" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </Label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] font-medium text-red-500 dark:text-red-400">
          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  'h-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm transition-colors placeholder:text-gray-400 focus:border-amber-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800/60 dark:placeholder:text-gray-600 dark:focus:border-amber-500 dark:focus:bg-gray-800';

interface EditOrderModalProps {
  open: boolean;
  order: Order | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditOrderModal({
  open,
  order,
  onOpenChange,
  onSuccess,
}: EditOrderModalProps) {
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as any,
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      paymentMethod: 'COD',
      shippingCost: 0,
      note: '',
    },
  });

  useEffect(() => {
    if (order) {
      reset({
        fullName: order.billingDetails?.fullName ?? '',
        email: order.billingDetails?.email ?? '',
        phone: String(order.billingDetails?.phone) ?? '',
        address: order.billingDetails?.address ?? '',
        paymentMethod: (order.paymentMethod as 'COD' | 'ONLINE' | 'CARD') ?? 'COD',
        shippingCost: (order as any).shippingCost ?? 0,
        note: (order as any).note ?? '',
      });
    }
  }, [order, reset]);

  const onSubmit = async (formData: FormData) => {
    if (!order?._id) return;

    try {
      await updateOrder({
        _id: order._id,
        data: {
          billingDetails: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          },
          paymentMethod: formData.paymentMethod,
          shippingCost: formData.shippingCost ?? 0,
          note: formData.note ?? "",
        },
      }).unwrap();

      toast.success("Order updated");

      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update order");
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        {/* Accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500" />

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <FilePenLine className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
              Edit Order
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400 dark:text-gray-500">
              {order?.customOrderId
                ? `Order ${order.customOrderId}`
                : order?._id
                  ? `ID: ${order?._id.slice(0, 14)}…`
                  : 'Update order details'}
            </DialogDescription>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          
            <form id="edit-order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Order summary pill */}
              {order && (
                <div className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-gray-50/60 px-4 py-3 dark:border-gray-700/60 dark:bg-gray-800/40">
                  <Package className="h-4 w-4 shrink-0 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {order.products?.length ?? 0} item{(order.products?.length ?? 0) !== 1 ? 's' : ''}
                      {' · '}
                      <span className="text-amber-600 dark:text-amber-400">
                        ৳{order.total}
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 capitalize">
                      {order.orderType?.toLowerCase()} · {order.orderStatus}
                    </p>
                  </div>
                </div>
              )}

              {/* Billing: Name + Email */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField icon={User} label="Full Name" htmlFor="fullName" required error={errors.fullName?.message}>
                  <Input id="fullName" placeholder="Customer name" className={inputCls} {...register('fullName')} />
                </FormField>
                <FormField icon={Mail} label="Email" htmlFor="email" required error={errors.email?.message}>
                  <Input id="email" type="email" placeholder="email@example.com" className={inputCls} {...register('email')} />
                </FormField>
              </div>

              {/* Phone + Payment */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField icon={Phone} label="Phone" htmlFor="phone" required error={errors.phone?.message}>
                  <Input id="phone" type="tel" placeholder="01XXXXXXXXX" className={inputCls} {...register('phone')} />
                </FormField>

                <FormField icon={CreditCard} label="Payment Method" htmlFor="paymentMethod" error={errors.paymentMethod?.message}>
                  <Select
                    value={watch('paymentMethod')}
                    onValueChange={(val) => setValue('paymentMethod', val as 'COD' | 'ONLINE' | 'CARD', { shouldDirty: true })}
                  >
                    <SelectTrigger id="paymentMethod" className={cn(inputCls, 'w-full')}>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COD">Cash on Delivery</SelectItem>
                      <SelectItem value="ONLINE">Online Payment</SelectItem>
                      <SelectItem value="CARD">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Address */}
              <FormField icon={MapPin} label="Address" htmlFor="address" required error={errors.address?.message}>
                <Input id="address" placeholder="House, Road, Area, City" className={inputCls} {...register('address')} />
              </FormField>

              {/* Shipping cost */}
              <FormField icon={Truck} label="Shipping Cost" htmlFor="shippingCost" error={errors.shippingCost?.message}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none select-none">
                    ৳
                  </span>
                  <Input
                    id="shippingCost"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    className={cn(inputCls, 'pl-7')}
                    {...register('shippingCost')}
                  />
                </div>
              </FormField>

              {/* Notes */}
              <FormField icon={StickyNote} label="Order Notes" htmlFor="note" error={errors.note?.message}>
                <Textarea
                  id="note"
                  placeholder="Internal notes about this order…"
                  rows={3}
                  className={cn(inputCls, 'h-auto resize-none leading-relaxed')}
                  {...register('note')}
                />
              </FormField>

              {/* Required hint */}
              <p className="text-[11px] text-gray-400 dark:text-gray-600">
                <span className="text-red-400">*</span> Required fields
              </p>
            </form>
        </div>

        {/* Footer */}
        <DialogFooter className="items-center my-1 flex gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>

          <button
            type="submit"
            form="edit-order-form"
            disabled={isUpdating || !isDirty}
            className={cn(
              'hover:cursor-pointer group relative overflow-hidden inline-flex items-center gap-1.5',
              'rounded-lg px-4 py-2 text-sm font-semibold text-white',
              'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600',
              'transition-all duration-200 active:scale-95',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
            />
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <FilePenLine className="h-3.5 w-3.5" />
                Save Changes
              </span>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}