import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useSubscribe } from 'nostr-hooks'
import { addArticle } from '../../redux/features/nostrapedia/slice'
import { makeEventSerializable } from '..'
import { addNewPubkey } from '../../redux/features/profiles/slice'

const WikiListener = () => {
  const dispatch = useDispatch()

  const processEventNS = useCallback(async (eventNS) => {
    const event = makeEventSerializable(eventNS)
    const pubkey = event.pubkey
    dispatch(addNewPubkey(pubkey))
    dispatch(addArticle(event))
  }, [])

  const filter = {
    kinds: [30818],
  }

  const filters = useMemo(() => [filter], [])
  const { events } = useSubscribe({ filters })

  useEffect(() => {
    if (events.length > 0) {
      const num = events.length - 1
      const eventNS = events[num]
      processEventNS(eventNS)
    }
  }, [events])

  return (
    <>
      <div
        style={{
          border: '2px solid orange',
          padding: '5px',
          textAlign: 'center',
        }}
      >
        Downloading wiki content (kind 30818) ** nostr hooks ** ; num events downloaded:{' '}
        {events.length}
      </div>
    </>
  )
}

export default WikiListener
