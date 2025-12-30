"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Loader2, Trash2, Edit } from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

// 👇 2 props le rahe hain: 1. Refresh sunne ke liye, 2. Refresh karne ke liye
export function ApplicationsTable({ refreshTrigger, onDataChange }: { refreshTrigger?: number, onDataChange?: () => void }) {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    // setLoading(true) // Silent refresh ke liye loading hata diya
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setApplications(data || [])
    setLoading(false)
  }

  // 👇 Jab bhi refreshTrigger badle, Table data wapas layegi
  useEffect(() => {
    fetchApplications()
  }, [refreshTrigger])

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this job?")) return;
    await supabase.from('job_applications').delete().eq('id', id)
    fetchApplications()
    onDataChange?.() 
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    await supabase.from('job_applications').update({ status: newStatus }).eq('id', id)
    fetchApplications()
    onDataChange?.()
  }

  // Status Colors Config
  const statusConfig: any = {
    applied: { label: "Applied", className: "bg-blue-100 text-blue-700 border-blue-200" },
    interview: { label: "Interview", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    rejected: { label: "Rejected", className: "bg-rose-100 text-rose-700 border-rose-200" },
    Applied: { label: "Applied", className: "bg-blue-100 text-blue-700 border-blue-200" },
    Interview: { label: "Interview", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    Rejected: { label: "Rejected", className: "bg-rose-100 text-rose-700 border-rose-200" },
  }

  if (loading && applications.length === 0) {
    return <div className="p-8 flex justify-center text-muted-foreground"><Loader2 className="animate-spin" /></div>
  }

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader><CardTitle className="text-xl font-bold text-foreground">Job Applications</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-bold text-foreground uppercase">Company</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-foreground uppercase">Role</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-foreground uppercase">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-foreground uppercase">Status</th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-foreground uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => {
                  const config = statusConfig[app.status] || statusConfig['Applied'];
                  return (
                    <tr key={app.id} className="hover:bg-muted transition-colors">
                      <td className="py-4 px-4 font-bold text-foreground">{app.company_name}</td>
                      <td className="py-4 px-4 text-foreground">{app.job_role}</td>
                      <td className="py-4 px-4 text-muted-foreground">{new Date(app.date_applied).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={config.className}>{app.status}</Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-popover border-border text-popover-foreground">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="hover:bg-muted cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" /> Update Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="bg-popover border-border text-popover-foreground">
                                <DropdownMenuRadioGroup value={app.status} onValueChange={(val) => handleStatusUpdate(app.id, val)}>
                                  <DropdownMenuRadioItem value="Applied">Applied</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Interview">Interview</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="Rejected">Rejected</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer" onClick={() => handleDelete(app.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
        </div>
      </CardContent>
    </Card>
  )
}