"use client";

import React from "react";
import { CalendarClock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ScheduleType = "INSTANT" | "SCHEDULED";

interface ScheduleOrderProps {
  value: {
    type: ScheduleType;
    scheduledAt?: string;
  };
  onChange: (val: { type: ScheduleType; scheduledAt?: string }) => void;
}

export function ScheduleOrder({ value, onChange }: ScheduleOrderProps) {
  const isScheduled = value.type === "SCHEDULED";

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Order Timing
      </p>

      {/* Toggle buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => onChange({ type: "INSTANT" })}
          className={cn(
            "flex-1 rounded-lg text-xs font-semibold",
            !isScheduled
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800"
          )}
        >
          <Zap className="h-3 w-3 mr-1" />
          Instant
        </Button>

        <Button
          type="button"
          onClick={() =>
            onChange({
              type: "SCHEDULED",
              scheduledAt: value.scheduledAt || "",
            })
          }
          className={cn(
            "flex-1 rounded-lg text-xs font-semibold",
            isScheduled
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800"
          )}
        >
          <CalendarClock className="h-3 w-3 mr-1" />
          Schedule
        </Button>
      </div>

      {/* Date Time Picker */}
      {isScheduled && (
        <div className="space-y-2">
          <Input
            type="datetime-local"
            value={value.scheduledAt || ""}
            onChange={(e) =>
              onChange({
                type: "SCHEDULED",
                scheduledAt: e.target.value,
              })
            }
            className="text-sm"
          />

          <p className="text-[11px] text-gray-400">
            Select when this order should be processed
          </p>
        </div>
      )}
    </div>
  );
}