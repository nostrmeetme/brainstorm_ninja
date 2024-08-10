import { ndk } from '../ndk'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateDegreesOfSeparation,
  updateKind0Event,
  processKind3Event,
} from 'src/redux/features/profiles/slice'
import { nip19, validateEvent } from 'nostr-tools'
import { useSubscribe } from 'nostr-hooks'
import { makeEventSerializable } from '..'
import { processKind10000Event } from '../../redux/features/profiles/slice'
import { processMyKind3Event, updateMyProfile } from '../../redux/features/profile/slice'
import { defListener1 } from '../../const'

const ListenerOn = () => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myNpub = nip19.npubEncode(myPubkey)
  const dispatch = useDispatch()
  const [subState, setSubState] = useState('listening ...')
  const [subStateColor, setSubStateColor] = useState('yellow')

  const processEventNS = async (eventNS) => {
    // if (validateEvent(eventNS)) {
      const event = makeEventSerializable(eventNS)
      if (event.kind == 0) {
        dispatch(updateKind0Event(event))
        if (event.pubkey == myPubkey) {
          const oMyProfile = JSON.parse(event.content)
          dispatch(updateMyProfile(oMyProfile))
          const npub_toUpdate = myNpub
          const degreesOfSeparation_new = 0
          dispatch(updateDegreesOfSeparation({ npub_toUpdate, degreesOfSeparation_new }))
        }
      }
      if (event.kind == 3) {
        dispatch(processKind3Event(event))
        if (event.pubkey == myPubkey) {
          dispatch(processMyKind3Event(event))
        }
      }
      if (event.kind == 10000) {
        dispatch(processKind10000Event(event))
      }
    // }
  }

  const filter = {
    authors: [myPubkey],
    kinds: [0, 3, 10000],
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

  useEffect(() => {
    if (eose) {
      /*
      // not sure whether this step is needed
      console.log('wrapping up')
      setSubState('wrapping up ...')
      events.forEach((eventNS, item) => {
        processEventNS(eventNS)
      })
      */
      setSubState('DONE!')
      setSubStateColor('green')
    }
  }, [eose])

  if (!events) return <p>Loading...</p>

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
        Download Follows of My Follows (kinds 0, 3, & 10000) ** nostr hooks ** :{' '}
        <div style={{ display: 'inline-block', color: subStateColor }}>{subState}</div> num events
        downloaded: {events.length}
      </div>
    </>
  )
}

const MyProfileListener = () => {
  const isSignedIn = useSelector((state) => state.profile.signedIn)
  const myPubkey = useSelector((state) => state.profile.pubkey)

  const generalSettings = useSelector((state) => state.settings.general)
  let currentListenerMode1 = defListener1
  if (generalSettings && generalSettings.listeners && generalSettings.listeners) {
    currentListenerMode1 = generalSettings.listeners.listener1
  }

  if (myPubkey && isSignedIn && currentListenerMode1 == 'show') {
    return <ListenerOn />
  }

  return <></>
}

export default MyProfileListener
