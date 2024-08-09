import React from 'react'
import { useSelector } from 'react-redux'

const GrapevineWoTScoreControlPanel = () => {
  return (
    <>
      <center>
        <h3>Grapevine WoT Control Panel</h3>
      </center>
      <div>
        <p>
          This control panel allows the user to create and edit a new Grapevine WoT Score. Choices
          include:
        </p>
        <li>
          Type of score: standard method; amalgamation (average of other scores); others types?
        </li>
        <li>The name of the score</li>
        <li>Raw data inputs, e.g. Follows, Mutes, Zaps, Reactions, etc</li>
        <li>Interpretation of each input (separate page for this?)</li>
        <li>Weight for each input; usually this is another Grapevine WoT Score</li>
      </div>
    </>
  )
}

export default GrapevineWoTScoreControlPanel
