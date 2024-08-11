import React from 'react'
import { useSubscribe } from 'nostr-hooks'

const filters = [
  { authors: ['e5272de914bd301755c439b88e6959a43c9d2664831f093c51e9c799a16a102f'], kinds: [39902] },
]

const ExportedInfluenceScores = () => {
  const { events } = useSubscribe({ filters })
  if (!events) return <p>Loading...</p>
  return (
    <>
      <center>
        <h3>Exported Influence Scores</h3>
      </center>
      <div>events: {Object.keys(events).length}</div>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <p>{event.pubkey}</p>
            <p>{event.kind}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ExportedInfluenceScores
