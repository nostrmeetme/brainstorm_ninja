import React from 'react'
import { useDispatch } from 'react-redux'
import { ndk } from '../ndk'
import { addArticle } from '../../redux/features/nostrapedia/slice'
import { makeEventSerializable } from '..'
import { addNewPubkey } from '../../redux/features/profiles/slice'

const WikiListener = () => {
  const dispatch = useDispatch()

  const filter = {
    kinds: [30818],
  }

  const sub11 = ndk.subscribe(filter)
  sub11.on('event', async (eventNS) => {
    console.log('number of events: ' + typeof sub11)
    const event = makeEventSerializable(eventNS)
    const pubkey = event.pubkey
    dispatch(addNewPubkey(pubkey))
    dispatch(addArticle(event))
  })

  return <></>
}

export default WikiListener

// <pre>sub11: {JSON.stringify(sub11, null, 4)}</pre>
