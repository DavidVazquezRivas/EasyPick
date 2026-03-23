import React, { createContext, useContext, useMemo, useState } from 'react'
import { CompleteGarment } from '@/core/api/garment/models/CompleteGarment'
import { AppError } from '@/core/api/global/errors'

type ConfirmationFlowState = {
  garments: CompleteGarment[]
  currentIndex: number
}

type ConfirmationFlowProgress = {
  current: number
  total: number
}

type ConfirmationFlowContextType = {
  flow: ConfirmationFlowState | null
  currentGarment: CompleteGarment | null
  progress: ConfirmationFlowProgress | null
  setConfirmationFlow: (garments: CompleteGarment[]) => void
  advanceConfirmationFlow: () => void
  clearConfirmationFlow: () => void
}

const ConfirmationFlowContext = createContext<ConfirmationFlowContextType | undefined>(undefined)

export const ConfirmationFlowProvider = ({ children }: { children: React.ReactNode }) => {
  const [flow, setFlow] = useState<ConfirmationFlowState | null>(null)

  const setConfirmationFlow = (garments: CompleteGarment[]) => {
    setFlow({
      garments,
      currentIndex: 0,
    })
  }

  const advanceConfirmationFlow = () => {
    setFlow((currentFlow) => {
      if (!currentFlow) {
        return currentFlow
      }

      const hasNext = currentFlow.currentIndex < currentFlow.garments.length - 1

      if (!hasNext) {
        return currentFlow
      }

      return {
        ...currentFlow,
        currentIndex: currentFlow.currentIndex + 1,
      }
    })
  }

  const clearConfirmationFlow = () => {
    setFlow(null)
  }

  const currentGarment = useMemo(() => {
    if (!flow) {
      return null
    }

    return flow.garments[flow.currentIndex] ?? null
  }, [flow])

  const progress = useMemo(() => {
    if (!flow) {
      return null
    }

    return {
      current: flow.currentIndex + 1,
      total: flow.garments.length,
    }
  }, [flow])

  const contextValue = useMemo(
    () => ({
      flow,
      currentGarment,
      progress,
      setConfirmationFlow,
      advanceConfirmationFlow,
      clearConfirmationFlow,
    }),
    [flow, currentGarment, progress],
  )

  return <ConfirmationFlowContext.Provider value={contextValue}>{children}</ConfirmationFlowContext.Provider>
}

export const useConfirmationFlow = () => {
  const context = useContext(ConfirmationFlowContext)

  if (!context) {
    throw new AppError('garment.errors.confirmationFlowProviderMissing')
  }

  return context
}
