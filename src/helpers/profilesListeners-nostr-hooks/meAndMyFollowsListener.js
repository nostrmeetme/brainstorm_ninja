import { ndk } from '../ndk'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateDegreesOfSeparation,
  updateKind0Event,
  processKind3Event,
} from 'src/redux/features/profiles/slice'
import { nip19 } from 'nostr-tools'
import { useSubscribe } from 'nostr-hooks'
import { makeEventSerializable } from '..'
import { processKind10000Event } from '../../redux/features/profiles/slice'
import { processMyKind3Event, updateMyProfile } from '../../redux/features/profile/slice'
import { defListener2 } from '../../const'

const ListenerOn = () => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myNpub = nip19.npubEncode(myPubkey)
  const dispatch = useDispatch()
  const [subState, setSubState] = useState('working ...')
  const [subStateColor, setSubStateColor] = useState('yellow')

  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oMyProfile = oProfilesByNpub[myNpub]
  let aMyFollows = []
  if (oMyProfile) {
    aMyFollows = oMyProfile.follows
  }

  const processEventNS = (eventNS) => {
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
  }

  const processAllEvents = async (events) => {
    events.forEach((eventNS, item) => {
      console.log('confirming local storage of event ' + item)
      processEventNS(eventNS)
    })
    setSubState('DONE!')
    setSubStateColor('green')
  }

  const filter = {
    authors: aMyFollows,
    kinds: [0, 3, 10000],
  }
  // kinds: [0, 3, 10000],

  const filters = useMemo(() => [filter], [])
  const { events, eose } = useSubscribe({ filters })

  useEffect(() => {
    if (events.length > 0) {
      console.log('adding event ' + events.length + ' to local storage (redux)')
      const num = events.length - 1
      const eventNS = events[num]
      processEventNS(eventNS)
    }
  }, [events])

  useEffect(() => {
    if (eose) {
      setSubState('EOSE reached, now storing in redux ...')
      processAllEvents(events)
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
        Download Follows of My Follows (kinds 0, 3 & 10000) ** nostr hooks ** :{' '}
        <div style={{ display: 'inline-block', color: subStateColor }}>{subState}</div> num events
        downloaded: {events.length}
        <div>This may take a few minutes. See javascript console for progress. You can turn this listener off under Settings.</div>
      </div>
    </>
  )
}

const MeAndMyFollowsListener = () => {
  const isSignedIn = useSelector((state) => state.profile.signedIn)
  const myPubkey = useSelector((state) => state.profile.pubkey)

  const generalSettings = useSelector((state) => state.settings.general)
  let currentListenerMode2 = defListener2
  if (generalSettings && generalSettings.listeners && generalSettings.listeners) {
    currentListenerMode2 = generalSettings.listeners.listener2
  }

  if (myPubkey && isSignedIn && currentListenerMode2 == 'show') {
    return <ListenerOn />
  }

  return <></>
}

export default MeAndMyFollowsListener
