'use client';

import { useState } from 'react';
import { Truck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { SteadfastDeliveryInfo } from './SteadfastDeliveryInfo';
import type { Order } from '@/types/orders';
import { CourierProvider } from '@/types/courier';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ConfirmOrderModalProps {
  open: boolean;
  order: Order | null;
  loading: boolean;
  error: string | null;
  onConfirm: (courierName: CourierProvider) => void;
  onOpenChange: (open: boolean) => void;
}

export function ConfirmOrderModal({
  open,
  order,
  loading,
  error,
  onConfirm,
  onOpenChange,
}: ConfirmOrderModalProps) {
  const [step, setStep] = useState<'confirm' | 'courier'>('confirm');
  const [selectedCourier, setSelectedCourier] = useState<CourierProvider | null>(null);

  // Only render if order exists and dialog is open
  if (!order || !open) return null;

  const handleConfirmOrder = () => {
    setStep('courier');
  };

  const handleConfirmWithCourier = () => {
    if (selectedCourier && order) {
      onConfirm(selectedCourier as CourierProvider);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      onOpenChange(newOpen);
      setStep('confirm');
      setSelectedCourier(null);
    }
  };

  const handleBack = () => {
    if (step === 'courier') {
      setStep('confirm');
      setSelectedCourier(null);
    } else {
      handleOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'confirm' ? 'Confirm Order' : 'Setup Delivery'}
          </DialogTitle>
          <DialogDescription>
            {step === 'confirm'
              ? `Confirm order ${order?._id} for processing`
              : `Choose a delivery method for order ${order?._id}`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

       <ScrollArea className='max-h-[70vh] overflow-y-auto pr-4'>
         <div className="space-y-4 py-4">
          {step === 'confirm' ? (
            <>
              {/* Order Summary */}
              <div className="space-y-2 rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">Order Summary</p>
                <div className="grid gap-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium text-foreground">{order?.billingDetails?.fullName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium text-foreground">৳{order?.total?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-medium text-foreground">{Array.isArray(order?.products) ? order.products.length : (order?.products ? 1 : 0)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-xs text-blue-900 dark:text-blue-300">
                  After confirming, you&apos;ll have the option to setup Steadfast delivery with automatic tracking and real-time updates.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Courier Selection Step */}
              <SteadfastDeliveryInfo showDetails={true} />

              <Separator className="my-2" />

              <div className="space-y-2">
                <p className="text-sm font-medium">Choose Delivery Method</p>
                <button
                  onClick={() => setSelectedCourier('STEADFAST')}
                  className={`w-full rounded-lg border-2 p-3 text-left transition-colors ${
                    selectedCourier === 'STEADFAST'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <p className="font-medium">Steadfast Courier</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Express delivery with real-time tracking and automatic pickup
                  </p>
                </button>
              </div>

              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  Steadfast will handle automatic pickup within 24 hours and provide live tracking updates to customers.
                </p>
              </div>
            </>
          )}
        </div>
        <ScrollBar orientation='vertical' />
       </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={loading}
            className="hover:cursor-pointer hover:scale-105 transition-transform ease-in-out duration-500"
          >
            {step === 'courier' ? 'Back' : 'Cancel'}
          </Button>
          <Button
            onClick={step === 'confirm' ? handleConfirmOrder : handleConfirmWithCourier}
            disabled={step === 'courier' && !selectedCourier ? true : loading}
            className="min-w-30 hover:cursor-pointer hover:scale-105 transition-transform ease-in-out duration-500"
          >
            {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
            {loading
              ? 'Processing...'
              : step === 'confirm'
              ? 'Continue to Delivery'
              : 'Confirm with Delivery'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
