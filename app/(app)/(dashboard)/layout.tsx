import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusIcon } from "lucide-react";
import React from "react";

export default function DashboardLayout({children}: {children: React.ReactNode}){
    return <div>
      {children}
        <Tooltip>
          <TooltipTrigger render={<div className="fixed w-fit  bottom-10 right-10 bg-black rounded-full p-3 cursor-pointer hover:bg-zinc-900">
          <PlusIcon className="text-white text-9xl scale-130 font-semibold"/>
        </div>}/>
        <TooltipContent>Add Transaction</TooltipContent>
        </Tooltip>
    </div>
}