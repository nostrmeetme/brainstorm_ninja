import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ndk } from '../ndk'
import { validateEvent, verifyEvent } from 'nostr-tools'
import { addArticle } from '../../redux/features/nostrapedia/slice'
import { makeEventSerializable } from '..'
import { addNewPubkey } from '../../redux/features/profiles/slice'
import { safeDecode } from '../nip19'

const WikiNaddrListener = ({ naddr }) => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const dispatch = useDispatch()

  const decodedNaddr = safeDecode(naddr)
  console.log('decodedNaddr: ' + JSON.stringify(decodedNaddr, null, 4))

  let filter = {
    kinds: [30818],
  }

  if (decodedNaddr.type == 'naddr') {
    filter = {
      kinds: [30818],
      '#d': [decodedNaddr.data.identifier],
    }
  }

  const sub12 = ndk.subscribe(filter)
  sub12.on('event', async (eventNS) => {
    // const author = eventNS.author
    // const profile = await author.fetchProfile()
    // console.log(`${profile.name}: ${eventNS.content}`)
    const event = makeEventSerializable(eventNS)
    const pubkey = event.pubkey
    dispatch(addNewPubkey(pubkey))
    dispatch(addArticle(event))
  })

  return (
    <>
      <div>fetching {naddr} ...</div>
      <div>(refresh this page if article doesn't load in a timely manner)</div>
    </>
  )
}

export default WikiNaddrListener
