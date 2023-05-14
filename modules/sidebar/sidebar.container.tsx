
import { useBoolean } from 'ahooks'
import { useState } from 'react'
import Pin from './components/pin'
import SideDrawer from './components/drawer/drawer'

function Side () {
  const [isOpen, isOpenActions] = useBoolean(false)

  const [placement, setPlacement] = useState<'left'| 'right'>('right')

  return (
    <>
      <Pin
        onClick={isOpenActions.setTrue}
      />
      {isOpen && <SideDrawer setPlacement={setPlacement} top={0} placement={placement} onClose={isOpenActions.setFalse}/>}
    </>

  )
}

export default Side
