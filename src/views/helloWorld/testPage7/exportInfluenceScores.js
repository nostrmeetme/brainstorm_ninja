import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NDKEvent, NDKKind, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { ndk, ndk_brainstorm } from '../../../helpers/ndk'
import { CButton } from '@coreui/react'
import { nip19 } from 'nostr-tools'

const byteSize = (str) => new Blob([str]).size

const oEventDefault39902 = {
  content: '',
  kind: 39902,
  tags: [
    ['P', 'tapestry'],
    ['word', '{}'],
    ['wordType', 'influenceScoresList'],
    ['w', 'influenceScoresList'],
    ['context', ''],
    ['c', ''],
    ['d', 'influenceScoresList'],
  ],
  created_at: null,
}

const oEventDefault = {
  content: '',
  kind: 30000,
  tags: [
    ['P', 'tapestry'],
    ['wordType', 'influenceScoresList'],
    ['w', 'influenceScoresList'],
    ['d', 'influenceScoresList'],
    ['title', 'Grapevine WoT Scores List'],
    [
      'description',
      'a list of nostr users and their associated Grapevine WoT Scores as calculated by the Tapestry Protocol',
    ],
    ['c', ''],
  ],
  created_at: null,
}

const ExportInfluenceScores = () => {
  const signedIn = useSelector((state) => state.profile.signedIn)
  const signInMethod = useSelector((state) => state.profile.signInMethod)

  if (!signedIn || signInMethod != 'extension') {
    return (
      <>
        <center>
          <h3>Export Influence Scores</h3>
        </center>
        <div>You must be signed in via the extension method to export Influence Scores.</div>
        <div>signedIn: {signedIn}</div>
        <div>signInMethod: {signInMethod}</div>
      </>
    )
  }

  const signer = new NDKNip07Signer()
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)

  const [oNdkEvent, setONdkEvent] = useState({})
  const [numProfiles, setNumProfiles] = useState(0)
  const [numTags, setNumTags] = useState(0)

  const createInfluenceScoreEventKind39902 = async (whetherToPublish) => {
    // const ndkEvent = new NDKEvent(ndk_brainstorm)
    const ndkEvent = new NDKEvent(ndk)
    ndkEvent.kind = 39902
    // const aTags = oEventDefault.tags
    const aTags = []
    Object.keys(oProfilesByPubkey).forEach((pubkey, item) => {
      const npub = nip19.npubEncode(pubkey)
      let influence = '' + oProfilesByNpub[npub].wotScores.baselineInfluence.influence // '' + is to make sure it is stringified
      if (influence > 0) {
        aTags.push(['p', pubkey, influence])
      }
    })
    const aTagsSorted = aTags.sort((a, b) => b[2] - a[2])
    const aTagsSortedTop1000 = []
    aTagsSorted.forEach((t, item) => {
      if (item < 1000) {
        aTagsSortedTop1000.push(t)
      }
    })
    setNumProfiles(aTagsSortedTop1000.length)
    ndkEvent.tags = oEventDefault.tags.concat(aTagsSortedTop1000)
    setNumTags(ndkEvent.tags.length)
    await ndkEvent.sign(signer)
    // console.log('ndkEvent: ' + JSON.stringify(ndkEvent, null, 4))
    if (whetherToPublish) {
      console.log('publish: YES')
      await ndkEvent.publish()
    }
    if (!whetherToPublish) {
      console.log('publish: NO')
      setONdkEvent(ndkEvent)
    }
  }

  const createInfluenceScoreEventKind30000 = async (whetherToPublish) => {
    // const ndkEvent = new NDKEvent(ndk_brainstorm)
    const ndkEvent = new NDKEvent(ndk)
    ndkEvent.kind = 30000
    // const aTags = oEventDefault.tags
    const aTags = []
    Object.keys(oProfilesByPubkey).forEach((pubkey, item) => {
      const npub = nip19.npubEncode(pubkey)
      let influence = '' + oProfilesByNpub[npub].wotScores.baselineInfluence.influence // '' + is to make sure it is stringified
      if (influence > 0) {
        aTags.push(['p', pubkey, '', influence]) // third string is typically a relay url; currently it is empty string
      }
    })
    const aTagsSorted = aTags.sort((a, b) => b[3] - a[3])
    const aTagsSortedTop1000 = []
    aTagsSorted.forEach((t, item) => {
      if (item < 1000) {
        aTagsSortedTop1000.push(t)
      }
    })
    setNumProfiles(aTagsSortedTop1000.length)
    ndkEvent.tags = oEventDefault.tags.concat(aTagsSortedTop1000)
    setNumTags(ndkEvent.tags.length)
    await ndkEvent.sign(signer)
    // console.log('ndkEvent: ' + JSON.stringify(ndkEvent, null, 4))
    if (whetherToPublish) {
      console.log('List published! event id: ' + ndkEvent.id)
      await ndkEvent.publish()
      alert('List published! event id: ' + ndkEvent.id)
    }
    if (!whetherToPublish) {
      // console.log('publish: NO')
      setONdkEvent(ndkEvent)
    }
  }

  useEffect(() => {
    createInfluenceScoreEventKind30000(false)
  }, [])

  return (
    <>
      <center>
        <h3>Export Influence Scores</h3>
      </center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flexGrow: 'auto',
          }}
        >
          <CButton color="primary" onClick={() => createInfluenceScoreEventKind30000(true)}>
            Publish
          </CButton>
        </div>
      </div>
      <p>
        Currently only the generic (context is empty) Influence Scores are exported. Contextual
        scores are forthcoming. Currently I am using kind 30000 as per NIP-51. Alternate: kind
        39902, following the tapestry protocol.
      </p>
      <p>Only influence scores greater than zero will be included. Currently only the top 1000 scoring pubkeys.</p>
      <div>num pubkeys in local storage: {Object.keys(oProfilesByPubkey).length}</div>
      <div>num pubkeys included in event: {numProfiles}</div>
      <div>number of tags: {numTags}</div>
      <div>file size: {byteSize(JSON.stringify(oNdkEvent)) / 1000000} MB</div>
      <p>Publish button is active.</p>
      <pre>{JSON.stringify(oNdkEvent, null, 4)}</pre>
    </>
  )
}

export default ExportInfluenceScores
