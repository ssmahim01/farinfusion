"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TrendingUp, Users } from "lucide-react";
import type { IStaffEarning } from "@/types/dashboard-overview";

interface StaffEarningsTableProps {
  staffEarnings: IStaffEarning[];
}

export function StaffEarningsTable({ staffEarnings }: StaffEarningsTableProps) {
  if (!staffEarnings || staffEarnings.length === 0) {
    return (
      <Card className="border-amber-200/40 bg-linear-to-br from-card via-card to-card/70 dark:border-amber-900/40 dark:from-card dark:via-card dark:to-card/50 p-6">
        <h3 className="mb-6 text-lg font-semibold text-foreground">
          Staff Earnings (Admin Only)
        </h3>
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-amber-200/40 bg-amber-50/30 py-12 dark:border-amber-900/30 dark:bg-amber-950/10">
          <Users className="mb-3 h-10 w-10 text-amber-600/60 dark:text-amber-400/60" />
          <p className="text-foreground font-medium">No staff data available</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Staff earnings will appear here once they process orders
          </p>
        </div>
      </Card>
    );
  }

  const sortedEarnings = [...staffEarnings].sort(
    (a, b) => b.totalEarnings - a.totalEarnings,
  );

  return (
    <Card className="border-amber-200/40 bg-linear-to-br from-card via-card to-card/70 dark:border-amber-900/40 dark:from-card dark:via-card dark:to-card/50 p-6 overflow-hidden">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Staff Earnings (Admin Only)
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Performance and earnings by staff member
          </p>
        </div>
        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
      </div>

      <ScrollArea className="w-full">
        <Table>
          <TableHeader className="bg-amber-50/50 dark:bg-amber-950/20">
            <TableRow className="border-b border-amber-200/30 hover:bg-transparent dark:border-amber-900/30">
              <TableHead className="font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">
                Staff Name
              </TableHead>
              <TableHead className="font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">
                Email
              </TableHead>
              <TableHead className="text-center font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">
                Total Orders
              </TableHead>
              <TableHead className="text-right font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">
                Total Earnings
              </TableHead>
              <TableHead className="text-right font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">
                Avg. per Order
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEarnings.map((earning) => {
              const avgPerOrder =
                earning.totalOrders > 0
                  ? earning.totalEarnings / earning.totalOrders
                  : 0;

              return (
                <TableRow
                  key={earning.sellerId}
                  className="border-b border-amber-100/50 hover:bg-amber-50/40 dark:border-amber-900/20 dark:hover:bg-amber-950/20 transition-all duration-200"
                >
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-amber-600">
                        <span className="text-xs font-bold text-white">
                          {earning.sellerName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">
                        {earning.sellerName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground truncate max-w-50">
                    {earning.email}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap font-semibold text-foreground">
                    {earning.totalOrders}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap font-bold text-green-600 dark:text-green-400">
                    ৳{earning.totalEarnings}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap font-semibold text-amber-700 dark:text-amber-400">
                    ৳{avgPerOrder}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <ScrollBar
          orientation="horizontal"
          className="bg-amber-200/30 dark:bg-amber-900/30"
        />
      </ScrollArea>
    </Card>
  );
}
