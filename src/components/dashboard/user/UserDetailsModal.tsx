"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, User, CheckCircle, XCircle, MapPin, Calendar } from "lucide-react";
import React from "react";

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    isActive?: boolean | string;
    isDeleted?: boolean;
    isVerified?: boolean;
    createdAt?: string;
    location?: string;
  };
}

const UserDetailsModal = ({ open, onOpenChange, user }: UserDetailsModalProps) => {
  if (!user) return null;

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md overflow-hidden">
          <DialogHeader className="text-center py-5">
            <DialogTitle className={"text-xl font-semibold"}>User Details</DialogTitle>
            <DialogDescription>View selected user information.</DialogDescription>
          </DialogHeader>

          <div className="pb-6 space-y-4">
            <Card className="border-0 shadow-sm bg-gray-50/70">
              <div className="p-5 space-y-4">

                {/* Name */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-600" />
                    <span>Name</span>
                  </div>
                  <span>{user.name}</span>
                </div>

                {/* Email */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Email</span>
                  </div>
                  <span>{user.email}</span>
                </div>

                {/* Phone */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>Phone</span>
                  </div>
                  <span>{user.phone}</span>
                </div>

                {/* Role */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-purple-600" />
                    <span>Role</span>
                  </div>
                  <span>{user.role || "CUSTOMER"}</span>
                </div>

                {/* Status / isActive */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Status</span>
                  </div>
                  <span>{user.isActive || "INACTIVE"}</span>
                </div>

                {/* Deleted */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Deleted</span>
                  </div>
                  <span>{user.isDeleted ? "Yes" : "No"}</span>
                </div>

                {/* Verified */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Verified</span>
                  </div>
                  <span>{user.isVerified ? "Yes" : "No"}</span>
                </div>

                {/* Location */}
                {user.location && (
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span>Location</span>
                      </div>
                      <span>{user.location}</span>
                    </div>
                )}

                {/* Created Date */}
                {user.createdAt && (
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-yellow-600" />
                        <span>Joined</span>
                      </div>
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                )}

              </div>
            </Card>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button className={"cursor-pointer"} variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}

export default UserDetailsModal;