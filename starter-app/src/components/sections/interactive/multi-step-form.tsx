'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Check, User, Briefcase, Settings } from 'lucide-react'

export interface MultiStepFormProps {
  /** Form title */
  title?: string
  /** Submit callback */
  onSubmit?: (data: Record<string, any>) => void | Promise<void>
}

/**
 * MultiStepForm - Wizard-style form with progress indicator
 *
 * @example
 * ```tsx
 * <MultiStepForm
 *   title="Complete Your Profile"
 *   onSubmit={handleComplete}
 * />
 * ```
 */
export function MultiStepForm({ title = 'Complete Your Profile', onSubmit }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Step 2: Professional Info
    company: '',
    position: '',
    experience: '',
    // Step 3: Preferences
    newsletter: false,
    updates: false,
    marketing: false,
  })

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: <User className="w-5 h-5" />,
      description: 'Tell us about yourself',
    },
    {
      id: 'professional',
      title: 'Professional Details',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Your work information',
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: <Settings className="w-5 h-5" />,
      description: 'Customize your experience',
    },
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log('Form submitted:', formData)
        alert('Profile completed successfully!')
      }
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-heading mb-4">{title}</h3>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    idx < currentStep
                      ? 'bg-primary border-primary text-primary-foreground'
                      : idx === currentStep
                      ? 'border-primary text-primary'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {idx < currentStep ? <Check className="w-5 h-5" /> : step.icon}
                </div>
                <div className="text-center hidden sm:block">
                  <p
                    className={`text-sm font-medium ${idx === currentStep ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${idx < currentStep ? 'bg-primary' : 'bg-border'}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Step 1: Personal Information */}
        {currentStep === 0 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  First Name <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Professional Details */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Company <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={(e) => updateFormData('company', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Position <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Software Engineer"
                value={formData.position}
                onChange={(e) => updateFormData('position', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Years of Experience</label>
              <select
                value={formData.experience}
                onChange={(e) => updateFormData('experience', e.target.value)}
                className="select-mm w-full"
              >
                <option value="">Select...</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-sm text-muted-foreground mb-4">
              Choose what you'd like to receive from us
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <Checkbox
                  checked={formData.newsletter}
                  onCheckedChange={(checked) => updateFormData('newsletter', checked)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label className="text-sm font-medium cursor-pointer">Newsletter</label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Weekly newsletter with the latest updates and insights
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <Checkbox
                  checked={formData.updates}
                  onCheckedChange={(checked) => updateFormData('updates', checked)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label className="text-sm font-medium cursor-pointer">Product Updates</label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified about new features and improvements
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <Checkbox
                  checked={formData.marketing}
                  onCheckedChange={(checked) => updateFormData('marketing', checked)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label className="text-sm font-medium cursor-pointer">Marketing</label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Occasional emails about special offers and promotions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            className="btn-secondary"
            type="button"
            
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={handleNext} className="btn-mm">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="btn-mm">
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Submitting...
                </>
              ) : (
                <>
                  Complete
                  <Check className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </EnhancedCard>
  )
}
