import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

export type UserIntent = 'find' | 'offer'

export type AccountRole = 'subleaseSeeker' | 'subletProvider'

export interface AccountDetails {
  role: AccountRole
  fullName: string
  email: string
  isEmailVerified: boolean
}

export interface SeekerProfile {
  avatar?: string
  age?: string
  gender?: string
  major?: string
  year?: string
  bio?: string
  budgetRange?: { min?: number; max?: number }
  distanceFromCampus?: string
  moveInTiming?: string
  leaseDuration?: string
  lifestylePreferences: string[]
  roomPreferences?: {
    roomType?: string
    amenities?: string[]
  }
}

export interface ListingProfile {
  photos: string[]
  headline?: string
  rent?: number
  moveInTiming?: string
  leaseDuration?: string
  distanceFromCampus?: string
  address?: string
  roomsTotal?: number
  roomType?: string
  bio?: string
  lifestylePreferences: string[]
  genderPreference?: string
}

interface AppFlowState {
  intent?: UserIntent
  account?: AccountDetails
  seekerProfile?: SeekerProfile
  listingProfile?: ListingProfile
}

interface AppFlowContextValue extends AppFlowState {
  setIntent: (intent: UserIntent) => void
  saveAccount: (details: AccountDetails) => void
  saveSeekerProfile: (profile: SeekerProfile) => void
  saveListingProfile: (profile: ListingProfile) => void
  reset: () => void
}

const AppFlowContext = createContext<AppFlowContextValue | null>(null)

export const AppFlowProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppFlowState>({
    seekerProfile: { lifestylePreferences: [] },
    listingProfile: { lifestylePreferences: [], photos: [] },
  })

  const value = useMemo(() => {
    const setIntent = (intent: UserIntent) => {
      setState((prev) => ({ ...prev, intent }))
    }

    const saveAccount = (details: AccountDetails) => {
      setState((prev) => ({ ...prev, account: details }))
    }

    const saveSeekerProfile = (profile: SeekerProfile) => {
      setState((prev) => ({ ...prev, seekerProfile: profile }))
    }

    const saveListingProfile = (profile: ListingProfile) => {
      setState((prev) => ({ ...prev, listingProfile: profile }))
    }

    const reset = () => {
      setState({
        seekerProfile: { lifestylePreferences: [] },
        listingProfile: { lifestylePreferences: [], photos: [] },
      })
    }

    return {
      ...state,
      setIntent,
      saveAccount,
      saveSeekerProfile,
      saveListingProfile,
      reset,
    }
  }, [state])

  return <AppFlowContext.Provider value={value}>{children}</AppFlowContext.Provider>
}

export const useAppFlow = () => {
  const ctx = useContext(AppFlowContext)
  if (!ctx) {
    throw new Error('useAppFlow must be used within an AppFlowProvider')
  }
  return ctx
}
