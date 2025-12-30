"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Plus } from "lucide-react"
import { useState } from "react"
import { AddJobDialog } from "@/components/add-job-dialog"
import { AIJobAnalyzer } from "@/components/ai-job-analyzer" // 👈 AI Component Import kiya

export function DashboardHeader({ onJobAdded }: { onJobAdded: () => void }) {
  const [showAddJob, setShowAddJob] = useState(false)
  const [showAiAnalyzer, setShowAiAnalyzer] = useState(false) // 👈 AI Popup ke liye state

  return (
    <>
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">Track and manage your job applications</p>
          </div>

          <div className="flex gap-3">
            {/* 🤖 AI Button Wapas Aa Gaya */}
            <Button 
              variant="outline"
              onClick={() => setShowAiAnalyzer(true)}
              className="gap-2 hidden sm:flex border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Resume
            </Button>

            {/* ➕ Add Job Button */}
            <Button 
              onClick={() => setShowAddJob(true)} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Job
            </Button>
          </div>
        </div>
      </header>

      {/* 👇 Dono Popups Yahan Hain */}
      <AddJobDialog 
        open={showAddJob} 
        onOpenChange={setShowAddJob} 
        onSaved={onJobAdded} 
      />
      
      <AIJobAnalyzer 
        open={showAiAnalyzer} 
        onOpenChange={setShowAiAnalyzer} 
      />
    </>
  )
}