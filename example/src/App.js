import React from 'react'

import { useMyHook } from 'react-shortcut-hook'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App
