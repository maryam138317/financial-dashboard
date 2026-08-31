'use client'
import PieChartComponent from "@/components/charts/pie-chart";
import BarChartComponent from "@/components/charts/stacked-bar-chart";
import Dashboard from "@/components/layout/dashboard";

export default function AnalyticsPage (){
    return <main className="p-6">
        <Dashboard title="Analytics" description="Analize all of your Transactions."/>
        <PieChartComponent />
        <BarChartComponent />

    </main>
}