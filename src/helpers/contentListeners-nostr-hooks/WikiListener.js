import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ndk } from '../ndk'
import { validateEvent, verifyEvent } from 'nostr-tools'
import { useSubscribe } from 'nostr-hooks'
import { addArticle } from '../../redux/features/nostrapedia/slice'
import { makeEventSerializable } from '..'
import { addNewPubkey } from '../../redux/features/profiles/slice'

const WikiListener = () => {
  const dispatch = useDispatch()
  const [subState, setSubState] = useState('working ...')
  const [subStateColor, setSubStateColor] = useState('yellow')

  /*
  const processEventNS = (eventNS) => {
    const event = makeEventSerializable(eventNS)
    const pubkey = event.pubkey
    dispatch(addNewPubkey(pubkey))
    dispatch(addArticle(event))
  }
  */

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
  const { events, eose } = useSubscribe({ filters })

  useEffect(() => {
    if (events.length > 0) {
      const num = events.length - 1
      const eventNS = events[num]
      processEventNS(eventNS)
    }
  }, [events])

  /*
  const sub11 = ndk.subscribe(filter)
  sub11.on('event', async (eventNS) => {
    // const author = eventNS.author
    // const profile = await author.fetchProfile()
    // console.log(`${profile.name}: ${eventNS.content}`)
    const event = makeEventSerializable(eventNS)
    const pubkey = event.pubkey
    dispatch(addNewPubkey(pubkey))
    dispatch(addArticle(event))
  })
  */

  return (
    <>
      <div
        style={{
          display: 'inline-block',
          border: '2px solid orange',
          padding: '5px',
          textAlign: 'center',
        }}
      >
        Download wiki content (kind 30818) ** nostr hooks ** :{' '}
        <div style={{ display: 'inline-block', color: subStateColor }}>{subState}</div> num events
        downloaded: {events.length}
      </div>
    </>
  )
}

export default WikiListener
