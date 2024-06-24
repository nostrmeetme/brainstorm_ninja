import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAction, addCategory, addContext } from 'src/redux/features/grapevine/slice'
import { nip19, validateEvent } from 'nostr-tools'
import { fetchFirstByTag } from 'src/helpers'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { addTrustAttestation } from 'src/redux/features/grapevine/slice'
import { cutoffTime } from 'src/const'
import { updateConceptGraphSettingsEvent } from 'src/redux/features/settings/slice'
import { addWordToConceptGraph } from '../../redux/features/conceptGraph/slice'
import { makeEventSerializable } from '..'
import { addContextualEndorsement } from '../../redux/features/grapevine/slice'

const GrapevineListenerMain = () => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const dispatch = useDispatch()

  const filter = {
    kinds: [9902, 39902],
    since: cutoffTime,
    '#P': ['tapestry'],
  }

  // use ndk-react
  const { fetchEvents } = useNDK()
  useEffect(() => {
    async function updateGrapevineDatabase() {
      const events = await fetchEvents(filter)
      events.forEach((eventNS, item) => {
        if (validateEvent(eventNS)) {
          const event = makeEventSerializable(eventNS)
          try {
            // const event = eventNS.rawEvent()

            const aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
            if (aTags_w.length > 0) {
              let cid = event.id
              const wordType = aTags_w[0][1]
              // console.log('fetchEvents; wordType: ' + wordType)
              if (event.kind >= 30000 && event.kind < 40000) {
                const tag_d = fetchFirstByTag('d', event)
                const naddr = nip19.naddrEncode({
                  pubkey: event.pubkey,
                  kind: event.kind,
                  identifier: tag_d,
                  relays: [],
                })
                cid = naddr
              }
              // add to grapevine store
              if (wordType == 'action') {
                dispatch(addAction({ event, cid }))
              }
              if (wordType == 'category') {
                dispatch(addCategory({ event, cid }))
              }
              if (wordType == 'context') {
                dispatch(addContext({ event, cid }))
              }
              if (wordType == 'trustAttestation') {
                dispatch(addTrustAttestation({ event, cid }))
              }
              if (wordType == 'contextualEndorsement') {
                dispatch(addContextualEndorsement({ event, cid }))
              }
              // add to settings store
              if (wordType == 'conceptGraphSettings') {
                const pk = event.pubkey
                if (pk == myPubkey) {
                  dispatch(updateConceptGraphSettingsEvent({ event }))
                }
              }
              // add to conceptGraph store
              if (wordType == 'wordType' || wordType == 'relationshipType') {
                const aTags_nameSingular = event.tags.filter(
                  ([k, v]) => k === 'nameSingular' && v && v !== '',
                )
                const nameSingular = aTags_nameSingular[0][1]
                // console.log('fetchEvents_wordType; nameSingular: ' + nameSingular)
                dispatch(addWordToConceptGraph({ event, cid, wordType }))
              }
              // will add to misc other apps (not yet implemented)
              if (wordType == 'nestedList') {
                // console.log('fetchEvents_nestedList')
              }
            }


          } catch (e) {
            console.log('updateGrapevineDatabase error: ' + e)
          }
        }
      })
    }
    updateGrapevineDatabase()
  }, [fetchEvents(filter)])

  return <><div>Grapevine Listener ON</div></>
}

const GrapevineListener = () => {
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  if (listenerMethod == 'off') {
    return <></>
  }
  if (listenerMethod == 'oneMainListener') {
    return <></>
  }
  if (listenerMethod == 'individualListeners') {
    return <GrapevineListenerMain />
  }
  return <></>
}

export default GrapevineListener
