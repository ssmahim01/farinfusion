"use client";

import * as React from "react";
import {
    format,
    subDays,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type DateFilterProps = {
    onChange?: (range: { startDate?: string; endDate?: string }) => void;
};

export default function DateFilter({ onChange }: DateFilterProps) {
    const [date, setDate] = React.useState<DateRange | undefined>();

    const update = (range: DateRange | undefined) => {
        setDate(range);

        if (range?.from) {
            onChange?.({
                startDate: range.from.toISOString(),
                endDate: range.to?.toISOString() ?? range.from.toISOString(),
            });
        }
    };

    const setRange = (type: string) => {
        const now = new Date();
        let from: Date;
        let to: Date;

        switch (type) {
            case "today":
                from = now;
                to = now;
                break;
            case "yesterday":
                from = subDays(now, 1);
                to = subDays(now, 1);
                break;
            case "week":
                from = startOfWeek(now);
                to = endOfWeek(now);
                break;
            case "month":
                from = startOfMonth(now);
                to = endOfMonth(now);
                break;
            default:
                from = subDays(now, 30);
                to = now;
        }

        update({ from, to });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from
                        ? `${format(date.from, "LLL dd")} - ${
                            date.to ? format(date.to, "LLL dd") : ""
                        }`
                        : "Filter by date"}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 grid grid-cols-2 w-auto">
                {/* Quick */}
                <div className="p-2 border-r space-y-1">
                    <Button variant="ghost" onClick={() => setRange("today")}>
                        Today
                    </Button>
                    <Button variant="ghost" onClick={() => setRange("yesterday")}>
                        Yesterday
                    </Button>
                    <Button variant="ghost" onClick={() => setRange("week")}>
                        This Week
                    </Button>
                    <Button variant="ghost" onClick={() => setRange("month")}>
                        This Month
                    </Button>
                </div>

                {/* Calendar */}
                <Calendar mode="range" selected={date} onSelect={update} />
            </PopoverContent>
        </Popover>
    );
}