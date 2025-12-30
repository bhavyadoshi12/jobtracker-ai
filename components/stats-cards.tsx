"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Calendar, XCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

// 👇 Prop receive kar rahe hain refresh ke liye
export function StatsCards({ refreshTrigger }: { refreshTrigger?: number }) {
  const [stats, setStats] = useState({ applied: 0, interviews: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      // setLoading(true) // Loading bar bar dikhana acha nahi lagta, isliye hata diya
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('status')

      if (!error && data) {
        // 🧮 Yahan hum ginti (Calculation) kar rahe hain
        const total = data.length
        const interviews = data.filter(job => job.status === 'Interview').length
        const rejected = data.filter(job => job.status === 'Rejected').length

        setStats({
          applied: total,
          interviews: interviews,
          rejected: rejected
        })
      }
      setLoading(false)
    }

    fetchStats()
  }, [refreshTrigger]) // 👈 Jab bhi yeh number badlega, Stats refresh honge

  const cards = [
    { title: "Total Applied", value: stats.applied, icon: Briefcase, color: "text-blue-600", bgColor: "bg-blue-100", borderColor: "border-blue-200" },
    { title: "Interviews", value: stats.interviews, icon: Calendar, color: "text-emerald-600", bgColor: "bg-emerald-100", borderColor: "border-emerald-200" },
    { title: "Rejections", value: stats.rejected, icon: XCircle, color: "text-rose-600", bgColor: "bg-rose-100", borderColor: "border-rose-200" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.title}</p>
                  <p className="text-4xl font-extrabold text-foreground mt-2">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-xl ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}