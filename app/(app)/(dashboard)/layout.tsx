import React from "react";

export default function DashboardLayout({children}: {children: React.ReactNode}){
    return <div className="h-screen">
      {children}
      <div>transaction totals</div>
        <div className="relative bottom-1 right-2">add</div>
    </div>
}