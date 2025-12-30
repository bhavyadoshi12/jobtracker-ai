"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { ApplicationsTable } from "@/components/applications-table"

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden md:block h-full">
         <Sidebar />
      </div>
      
      <main className="flex-1 overflow-auto flex flex-col h-full">
        <DashboardHeader onJobAdded={handleRefresh} />
        
        <div className="p-6 space-y-6">
          {/* ✅ FIX: "key={refreshKey}" hata diya. 
             Ab hum "refreshTrigger" prop use kar rahe hain.
             Isse component destroy nahi hoga, bas data naya layega.
          */}
          <StatsCards refreshTrigger={refreshKey} />
          
          <ApplicationsTable 
            refreshTrigger={refreshKey} 
            onDataChange={handleRefresh} 
          />
        </div>
      </main>
    </div>
  )
}