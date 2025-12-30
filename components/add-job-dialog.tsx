"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

interface AddJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: () => void
}

export function AddJobDialog({ open, onOpenChange, onSaved }: AddJobDialogProps) {
  const [companyName, setCompanyName] = useState("")
  const [jobRole, setJobRole] = useState("")
  const [status, setStatus] = useState<"applied" | "interview" | "rejected">("applied")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!companyName.trim() || !jobRole.trim() || saving) {
      return
    }

    setSaving(true)

    // 🛠️ FIX: Status ko Capitalize karein (applied -> Applied) kyunki DB yahi chahta hai
    const dbStatus = status.charAt(0).toUpperCase() + status.slice(1)

    const payload = {
      company_name: companyName.trim(),  // Sahi column name
      job_role: jobRole.trim(),          // Sahi column name
      status: dbStatus,                  // "Applied" instead of "applied"
      date_applied: new Date().toISOString().split("T")[0],
    }

    // Debugging ke liye (Console check karna agar error aaye)
    console.log("Sending Payload:", payload)

    const { error } = await supabase
      .from("job_applications")
      .insert([payload]) // Note: Insert array leta hai usually

    setSaving(false)

    if (error) {
      console.error("Error saving job application:", error.message)
      alert("Error saving: " + error.message) // User ko bhi dikhayega
      return
    }

    // Success! Reset form
    setCompanyName("")
    setJobRole("")
    setStatus("applied")

    // Close dialog & Refresh list
    onOpenChange(false)
    onSaved?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Enter the details of the job you applied for.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              placeholder="e.g. Google"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Job Role</Label>
            <Input
              id="role"
              placeholder="e.g. Frontend Developer"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={status} 
              onValueChange={(val: "applied" | "interview" | "rejected") => setStatus(val)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}