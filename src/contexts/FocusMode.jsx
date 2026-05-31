import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const Ctx = createContext({ active: false, enter: () => {}, exit: () => {} })

export function FocusModeProvider({ children }) {
  const [active, setActive] = useState(false)

  // Stable refs — never recreated, safe in useEffect deps arrays
  const enter = useCallback(() => setActive(true), [])
  const exit  = useCallback(() => setActive(false), [])

  const value = useMemo(() => ({ active, enter, exit }), [active, enter, exit])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useFocusMode() { return useContext(Ctx) }
