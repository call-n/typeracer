import React from 'react'
import { useRouter } from 'next/router'

const MultiplayerRoom = () => {
    const router = useRouter()
    const { id } = router.query

  return (
    <>
        <div>MultiplayerRoom</div>
        <div>{id}</div>
    </>
  )
}

export default MultiplayerRoom