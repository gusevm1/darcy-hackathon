'use client'

import { useCallback, useState } from 'react'

import type {
  BusinessRole,
  ClassificationResult,
  EstablishmentLocation,
  ExistingLicense,
  Jurisdiction,
  ServiceType,
  TokenType,
  WizardAnswers,
} from '@/types'

export interface WizardState {
  currentStep: number
  answers: Partial<WizardAnswers>
  result: ClassificationResult | null
  isSubmitting: boolean
  error: string | null
}

const TOTAL_STEPS = 7

function getStepCount(answers: Partial<WizardAnswers>): number {
  let count = TOTAL_STEPS
  if (answers.businessRole === 'service_provider') count -= 1
  if (answers.businessRole === 'issuer') count -= 1
  return count
}

function shouldSkipStep(
  step: number,
  answers: Partial<WizardAnswers>,
): boolean {
  if (step === 2 && answers.businessRole === 'service_provider') return true
  if (step === 3 && answers.businessRole === 'issuer') return true
  return false
}

export function useWizard() {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    answers: {},
    result: null,
    isSubmitting: false,
    error: null,
  })

  const totalSteps = getStepCount(state.answers)
  const effectiveStep = getEffectiveStep(state.currentStep, state.answers)

  const setAnswer = useCallback(
    <K extends keyof WizardAnswers>(key: K, value: WizardAnswers[K]) => {
      setState((prev) => ({
        ...prev,
        answers: { ...prev.answers, [key]: value },
        error: null,
      }))
    },
    [],
  )

  const next = useCallback(() => {
    setState((prev) => {
      let nextStep = prev.currentStep + 1
      while (nextStep <= TOTAL_STEPS && shouldSkipStep(nextStep, prev.answers)) {
        nextStep++
      }
      return { ...prev, currentStep: Math.min(nextStep, TOTAL_STEPS) }
    })
  }, [])

  const back = useCallback(() => {
    setState((prev) => {
      let prevStep = prev.currentStep - 1
      while (prevStep >= 1 && shouldSkipStep(prevStep, prev.answers)) {
        prevStep--
      }
      return { ...prev, currentStep: Math.max(prevStep, 1) }
    })
  }, [])

  const setResult = useCallback((result: ClassificationResult) => {
    setState((prev) => ({ ...prev, result, isSubmitting: false }))
  }, [])

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState((prev) => ({ ...prev, isSubmitting }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isSubmitting: false }))
  }, [])

  const reset = useCallback(() => {
    setState({
      currentStep: 1,
      answers: {},
      result: null,
      isSubmitting: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    totalSteps,
    effectiveStep,
    setAnswer,
    next,
    back,
    setResult,
    setSubmitting,
    setError,
    reset,
  }
}

function getEffectiveStep(
  step: number,
  answers: Partial<WizardAnswers>,
): number {
  let effective = 0
  for (let i = 1; i <= step; i++) {
    if (!shouldSkipStep(i, answers)) effective++
  }
  return effective
}

