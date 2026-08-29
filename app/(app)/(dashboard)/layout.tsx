"use client";

import React, { useState } from "react";
import { PlusIcon } from "lucide-react";

import TransactionForm from "@/components/transactions/transaction-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
      {children}

      <Dialog
        open={isOpen}
        onOpenChange={setOpen}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <DialogTrigger
                render={
                  <Button
                    type="button"
                    size="icon-lg"
                    className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
                  >
                    <PlusIcon className="size-5" />
                    <span className="sr-only">
                      Add Transaction
                    </span>
                  </Button>
                }
              />
            }
          />

          <TooltipContent>
            Add Transaction
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Add Transaction
            </DialogTitle>
          </DialogHeader>

          <TransactionForm
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
