'use client'

import { useEffect, useReducer, useState } from 'react'
import { createInitialAccount, demoReducer, type DemoAction } from './demo-account'
import { clearDemoAccount, loadDemoAccount, saveDemoAccount } from './persistence'
import type { DemoAccount } from './types'

type PersistedAction = DemoAction | { type: 'hydrate'; account: DemoAccount }

function persistedReducer(state: DemoAccount, action: PersistedAction): DemoAccount {
  return action.type === 'hydrate' ? action.account : demoReducer(state, action)
}

/**
 * Demo account state backed by the existing reducer, mirrored to localStorage.
 * The first render always uses the initial account so server and client markup match;
 * saved data is restored right after mount, and nothing is written until then.
 */
export function useDemoAccount() {
  const [account, dispatch] = useReducer(persistedReducer, undefined, createInitialAccount)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = loadDemoAccount()
    if (saved) dispatch({ type: 'hydrate', account: saved })
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    // A pristine account (new or just reset) is stored as "no data" rather than as a copy.
    if (account.counter === 0) clearDemoAccount()
    else saveDemoAccount(account)
  }, [account, hydrated])

  return [account, dispatch as (action: DemoAction) => void] as const
}
