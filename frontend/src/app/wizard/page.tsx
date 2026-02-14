'use client'

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WizardResults } from '@/components/shared/wizard-results'
import { WizardStep } from '@/components/shared/wizard-step'
import { useWizard } from '@/hooks/use-wizard'
import { classifyBusiness } from '@/lib/api'
import type {
  BusinessRole,
  EstablishmentLocation,
  ExistingLicense,
  Jurisdiction,
  ServiceType,
  TokenType,
  WizardAnswers,
} from '@/types'

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: 'custody', label: 'Custody & administration of crypto-assets' },
  { value: 'exchange', label: 'Exchange of crypto-assets for funds/other crypto' },
  { value: 'trading_platform', label: 'Operation of a trading platform' },
  { value: 'execution', label: 'Execution of orders' },
  { value: 'advice', label: 'Advice on crypto-assets' },
  { value: 'portfolio_management', label: 'Portfolio management' },
  { value: 'transfer', label: 'Transfer services for crypto-assets' },
  { value: 'order_reception', label: 'Reception & transmission of orders' },
]

const LOCATION_OPTIONS: { value: EstablishmentLocation; label: string }[] = [
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IE', label: 'Ireland' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'MT', label: 'Malta' },
  { value: 'EU', label: 'Other EU Member State' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CH', label: 'Switzerland' },
]

const LICENSE_OPTIONS: { value: ExistingLicense; label: string }[] = [
  { value: 'credit_institution', label: 'Credit institution' },
  { value: 'mifid_firm', label: 'MiFID investment firm' },
  { value: 'emi', label: 'E-money institution (EMI)' },
  { value: 'pi', label: 'Payment institution (PI)' },
  { value: 'national_crypto', label: 'National crypto license' },
  { value: 'none', label: 'None' },
]

export default function WizardPage() {
  const wizard = useWizard()
  const { currentStep, answers, effectiveStep, totalSteps } = wizard

  if (wizard.result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <WizardResults result={wizard.result} onReset={wizard.reset} />
      </div>
    )
  }

  const progress = (effectiveStep / totalSteps) * 100

  const canProceed = isStepValid(currentStep, answers)

  async function handleSubmit() {
    if (!isComplete(answers)) return
    wizard.setSubmitting(true)
    try {
      const result = await classifyBusiness(answers as WizardAnswers)
      localStorage.setItem('classificationResult', JSON.stringify(result))
      wizard.setResult(result)
    } catch (err) {
      wizard.setError(
        err instanceof Error ? err.message : 'Classification failed',
      )
    }
  }

  const isLastStep = currentStep === 7

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto mb-8 max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold">Classify Your Business</h1>
        <p className="text-muted-foreground mb-4 text-sm">
          Step {effectiveStep} of {totalSteps}
        </p>
        <Progress value={progress} className="h-2" />
      </div>

      {currentStep === 1 && (
        <WizardStep
          title="What is your business role?"
          description="Select the primary role of your crypto business."
        >
          <RadioGroup
            value={answers.businessRole || ''}
            onValueChange={(v) =>
              wizard.setAnswer('businessRole', v as BusinessRole)
            }
            className="space-y-3"
          >
            {[
              { value: 'issuer', label: 'Issuing tokens' },
              { value: 'service_provider', label: 'Providing crypto services' },
              { value: 'both', label: 'Both issuing and providing services' },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center gap-3">
                <RadioGroupItem value={opt.value} id={opt.value} />
                <Label htmlFor={opt.value}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </WizardStep>
      )}

      {currentStep === 2 && (
        <WizardStep
          title="What type of token are you issuing?"
          description="Select the token classification that best describes your offering."
        >
          <RadioGroup
            value={answers.tokenType || ''}
            onValueChange={(v) =>
              wizard.setAnswer('tokenType', v as TokenType)
            }
            className="space-y-3"
          >
            {[
              { value: 'ART', label: 'Asset-Referenced Token (ART)' },
              { value: 'EMT', label: 'E-Money Token (EMT)' },
              { value: 'other_crypto', label: 'Other crypto-asset (utility token)' },
              { value: 'NFT', label: 'Non-Fungible Token (NFT)' },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center gap-3">
                <RadioGroupItem value={opt.value} id={`token-${opt.value}`} />
                <Label htmlFor={`token-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </WizardStep>
      )}

      {currentStep === 3 && (
        <WizardStep
          title="What services do you provide?"
          description="Select all crypto-asset services your business offers."
        >
          <div className="space-y-3">
            {SERVICE_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-3">
                <Checkbox
                  id={`svc-${opt.value}`}
                  checked={answers.serviceTypes?.includes(opt.value) || false}
                  onCheckedChange={(checked) => {
                    const current = answers.serviceTypes || []
                    wizard.setAnswer(
                      'serviceTypes',
                      checked
                        ? [...current, opt.value]
                        : current.filter((s) => s !== opt.value),
                    )
                  }}
                />
                <Label htmlFor={`svc-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </div>
        </WizardStep>
      )}

      {currentStep === 4 && (
        <WizardStep
          title="Does your business handle fiat currency?"
          description="Fiat handling affects licensing requirements, especially for e-money tokens."
        >
          <RadioGroup
            value={
              answers.handlesFiat === undefined
                ? ''
                : answers.handlesFiat
                  ? 'yes'
                  : 'no'
            }
            onValueChange={(v) =>
              wizard.setAnswer('handlesFiat', v === 'yes')
            }
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="yes" id="fiat-yes" />
              <Label htmlFor="fiat-yes">Yes, we handle fiat currency</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="no" id="fiat-no" />
              <Label htmlFor="fiat-no">No, crypto-only operations</Label>
            </div>
          </RadioGroup>
        </WizardStep>
      )}

      {currentStep === 5 && (
        <WizardStep
          title="Target jurisdictions"
          description="Select the jurisdictions where you plan to operate."
        >
          <div className="space-y-3">
            {[
              { value: 'EU' as Jurisdiction, label: 'European Union (MiCAR)' },
              { value: 'UK' as Jurisdiction, label: 'United Kingdom (FCA)' },
              { value: 'CH' as Jurisdiction, label: 'Switzerland (FINMA)' },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center gap-3">
                <Checkbox
                  id={`jur-${opt.value}`}
                  checked={
                    answers.targetJurisdictions?.includes(opt.value) || false
                  }
                  onCheckedChange={(checked) => {
                    const current = answers.targetJurisdictions || []
                    wizard.setAnswer(
                      'targetJurisdictions',
                      checked
                        ? [...current, opt.value]
                        : current.filter((j) => j !== opt.value),
                    )
                  }}
                />
                <Label htmlFor={`jur-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </div>
        </WizardStep>
      )}

      {currentStep === 6 && (
        <WizardStep
          title="Where is your business established?"
          description="Your establishment location determines the primary regulatory authority."
        >
          <Select
            value={answers.establishmentLocation || ''}
            onValueChange={(v) =>
              wizard.setAnswer(
                'establishmentLocation',
                v as EstablishmentLocation,
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </WizardStep>
      )}

      {currentStep === 7 && (
        <WizardStep
          title="Do you hold any existing licenses?"
          description="Existing authorizations may exempt you from certain requirements."
        >
          <div className="space-y-3">
            {LICENSE_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-3">
                <Checkbox
                  id={`lic-${opt.value}`}
                  checked={
                    answers.existingLicenses?.includes(opt.value) || false
                  }
                  onCheckedChange={(checked) => {
                    const current = answers.existingLicenses || []
                    if (opt.value === 'none') {
                      wizard.setAnswer(
                        'existingLicenses',
                        checked ? ['none'] : [],
                      )
                    } else {
                      wizard.setAnswer(
                        'existingLicenses',
                        checked
                          ? [...current.filter((l) => l !== 'none'), opt.value]
                          : current.filter((l) => l !== opt.value),
                      )
                    }
                  }}
                />
                <Label htmlFor={`lic-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </div>
        </WizardStep>
      )}

      {wizard.error && (
        <div className="mx-auto mt-4 max-w-2xl">
          <p className="text-destructive text-sm">{wizard.error}</p>
        </div>
      )}

      <div className="mx-auto mt-6 flex max-w-2xl justify-between">
        <Button
          variant="outline"
          onClick={wizard.back}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed || wizard.isSubmitting}
          >
            {wizard.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Classifying...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        ) : (
          <Button onClick={wizard.next} disabled={!canProceed}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function isStepValid(
  step: number,
  answers: Partial<WizardAnswers>,
): boolean {
  switch (step) {
    case 1:
      return !!answers.businessRole
    case 2:
      return !!answers.tokenType
    case 3:
      return !!answers.serviceTypes && answers.serviceTypes.length > 0
    case 4:
      return answers.handlesFiat !== undefined
    case 5:
      return (
        !!answers.targetJurisdictions &&
        answers.targetJurisdictions.length > 0
      )
    case 6:
      return !!answers.establishmentLocation
    case 7:
      return !!answers.existingLicenses && answers.existingLicenses.length > 0
    default:
      return false
  }
}

function isComplete(answers: Partial<WizardAnswers>): boolean {
  return (
    !!answers.businessRole &&
    answers.handlesFiat !== undefined &&
    !!answers.targetJurisdictions &&
    answers.targetJurisdictions.length > 0 &&
    !!answers.establishmentLocation &&
    !!answers.existingLicenses &&
    answers.existingLicenses.length > 0
  )
}
