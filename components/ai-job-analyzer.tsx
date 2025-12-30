"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { analyzeJobDescription } from "@/app/actions/analyze-job"

interface AIJobAnalyzerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AIJobAnalyzer({ open, onOpenChange }: AIJobAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<{
    score: number
    missingKeywords: string[]
    tips: string[]
  } | null>(null)

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResults(null)

    try {
      const response = await analyzeJobDescription(jobDescription, resumeText)
      setResults({
        score: response.matchScore,
        missingKeywords: response.missingKeywords,
        tips: response.improvementTips
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while analyzing the job description")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClose = () => {
    setJobDescription("")
    setResumeText("")
    setResults(null)
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Analyze Job Description with AI</DialogTitle>
          <DialogDescription>
            Paste a job description and your resume to get AI-powered insights about how well they match.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Job Description</p>
              <Textarea
                placeholder="Paste the Job Description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Paste Your Resume</p>
              <Textarea
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim() || !resumeText.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Analyzing job description...</span>
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Match Score</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${results.score}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold">{results.score}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {results.missingKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Tips</h3>
                <ul className="space-y-2">
                  {results.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

