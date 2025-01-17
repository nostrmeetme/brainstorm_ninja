import { createSlice } from '@reduxjs/toolkit'
import { noBannerPicUrl, noProfilePicUrl } from '../../../const'
import { nip19 } from 'nostr-tools'
import { safeNpubEncode } from '../../../helpers/nip19'

/*
oProfiles: {
  byPubkey: {
    <pubkey>: npub, // use pubkey to find the npub, then use byNpub to look up data
  },
  byNpub: {
    <npub>: {
      kind0: {
        oEvent: <oKind0Event>,
      },
      kind3: {
        oEvent: <oKind0Event>,
      },
      pubkey: '',
      follows: [],
      followers: [],
      mutedBy: [],
      wotScores: {
        degreeOfSeparationFromMe: 999,
        coracle: 0,
      },
    }
  },

}
*/

/*
kind0: profile info
kind3: follows and relays info
*/

const oDefaultByNpubData = {
  kind0: {},
  kind3: {},
  kind10000: {},
  pubkey: '', // include npub here so no need to use nip19 every time you need to find the npub from the pubkey
  follows: [], // array of pubkeys
  followers: [], // array of pubkeys
  mutes: [], // array of pubkeys
  mutedBy: [], // array of pubkeys
  wotScores: {
    degreesOfSeparation: 999,
    coracle: 0,
    baselineInfluence: {
      influence: 0,
      averageScore: 0,
      certainty: 0,
      input: 0,
    },
  },
}

const initState = {
  oProfiles: {
    byPubkey: {}, // find npub using pubkey
    byNpub: {}, // contains the data
  },
}

export const profilesSlice = createSlice({
  name: 'profiles',
  initialState: initState,
  reducers: {
    addNewPubkey: (state, action) => {
      const pubkey = action.payload
      // const npub = nip19.npubEncode(pubkey)
      const npub = safeNpubEncode(pubkey)
      if (npub) {
        ////////// !!!!!!!!!!!! //////////
        if (!state.oProfiles.byPubkey[pubkey]) {
          state.oProfiles.byPubkey[pubkey] = npub
        }
        if (!state.oProfiles.byNpub[npub]) {
          state.oProfiles.byNpub[npub] = JSON.parse(JSON.stringify(oDefaultByNpubData))
        }
        if (!state.oProfiles.byNpub[npub].pubkey) {
          state.oProfiles.byNpub[npub].pubkey = pubkey
        }
      }
    },
    updateAllDegreesOfSeparationScores: (state, action) => {
      const oScores = action.payload
      Object.keys(oScores).forEach((pubkey, item) => {
        const npub = state.oProfiles.byPubkey[pubkey]
        const { score } = oScores[pubkey].dosData
        state.oProfiles.byNpub[npub].wotScores.degreesOfSeparation = score
      })
    },
    updateAllCoracleScores: (state, action) => {
      const oScores = action.payload
      Object.keys(oScores).forEach((pubkey, item) => {
        const npub = state.oProfiles.byPubkey[pubkey]
        const { score } = oScores[pubkey].wotScoreData
        state.oProfiles.byNpub[npub].wotScores.coracle = score
      })
    },
    updateAllBaselineInfluenceScores: (state, action) => {
      const oBaselineInfluenceScores = action.payload
      Object.keys(oBaselineInfluenceScores).forEach((pubkey, item) => {
        const npub = state.oProfiles.byPubkey[pubkey]
        const { influence, averageScore, certainty, input } =
          oBaselineInfluenceScores[pubkey].influenceData
        state.oProfiles.byNpub[npub].wotScores.baselineInfluence.influence = influence
        state.oProfiles.byNpub[npub].wotScores.baselineInfluence.averageScore = averageScore
        state.oProfiles.byNpub[npub].wotScores.baselineInfluence.certainty = certainty
        state.oProfiles.byNpub[npub].wotScores.baselineInfluence.input = input
      })
    },
    updateBaselineInfluence: (state, action) => {
      const { npub, influence, averageScore, certainty, input } = action.payload
      state.oProfiles.byNpub[npub].wotScores.baselineInfluence.influence = influence
      state.oProfiles.byNpub[npub].wotScores.baselineInfluence.averageScore = averageScore
      state.oProfiles.byNpub[npub].wotScores.baselineInfluence.certainty = certainty
      state.oProfiles.byNpub[npub].wotScores.baselineInfluence.input = input
    },
    updateCoracleWoT: (state, action) => {
      const refNpub = action.payload.refNpub
      if (state.oProfiles.byNpub[refNpub].wotScores.degreesOfSeparation < 3) {
        const myFollows = action.payload.myFollows
        const refFollowers = state.oProfiles.byNpub[refNpub].followers
        let wotScore = 0
        refFollowers.forEach((refPubkey, item) => {
          if (myFollows.includes(refPubkey)) {
            wotScore++
          }
        })
        state.oProfiles.byNpub[refNpub].wotScores.coracle = wotScore
      }
      // TO DO: subtract using mutes
    },
    updateKind0Event: (state, action) => {
      const oKind0Event = action.payload
      const pubkey = oKind0Event.pubkey
      // const npub = nip19.npubEncode(pubkey)
      const npub = safeNpubEncode(pubkey)
      if (npub) {
        ////////// !!!!!!!!!!!! //////////
        if (!state.oProfiles.byPubkey[pubkey]) {
          state.oProfiles.byPubkey[pubkey] = npub
        }
        if (!state.oProfiles.byNpub[npub]) {
          state.oProfiles.byNpub[npub] = JSON.parse(JSON.stringify(oDefaultByNpubData))
        }
        if (!state.oProfiles.byNpub[npub].pubkey) {
          state.oProfiles.byNpub[npub].pubkey = pubkey
        }
        if (!state.oProfiles.byNpub[npub].kind0.oEvent) {
          state.oProfiles.byNpub[npub].kind0.oEvent = oKind0Event
        }
        if (state.oProfiles.byNpub[npub].kind0.oEvent.created_at < oKind0Event.created_at) {
          state.oProfiles.byNpub[npub].kind0.oEvent = oKind0Event
        }
      }
    },
    /*
    updateKind3Event: (state, action) => {
      const oKind3Event = action.payload
      const pubkey = oKind3Event.pubkey
      const npub = nip19.npubEncode(pubkey)
      ////////// !!!!!!!!!!!! //////////
      if (!state.oProfiles.byPubkey[pubkey]) {
        state.oProfiles.byPubkey[pubkey] = npub
      }
      if (!state.oProfiles.byNpub[npub]) {
        state.oProfiles.byNpub[npub] = JSON.parse(JSON.stringify(oDefaultByNpubData))
      }
      if (!state.oProfiles.byNpub[npub].pubkey) {
        state.oProfiles.byNpub[npub].pubkey = pubkey
      }
      if (!state.oProfiles.byNpub[npub].kind3.oEvent) {
        state.oProfiles.byNpub[npub].kind3.oEvent = oKind3Event
      }
      if (state.oProfiles.byNpub[npub].kind3.oEvent.created_at < oKind3Event.created_at) {
        state.oProfiles.byNpub[npub].kind3.oEvent = oKind3Event
      }
    },
    */
   /*
    updateKind10000Event: (state, action) => {
      const oKind10000Event = action.payload
      const pubkey = oKind10000Event.pubkey
      const npub = nip19.npubEncode(pubkey)
      ////////// !!!!!!!!!!!! //////////
      if (!state.oProfiles.byPubkey[pubkey]) {
        state.oProfiles.byPubkey[pubkey] = npub
      }
      if (!state.oProfiles.byNpub[npub]) {
        state.oProfiles.byNpub[npub] = JSON.parse(JSON.stringify(oDefaultByNpubData))
      }
      if (!state.oProfiles.byNpub[npub].pubkey) {
        state.oProfiles.byNpub[npub].pubkey = pubkey
      }
      if (!state.oProfiles.byNpub[npub].kind10000.oEvent) {
        state.oProfiles.byNpub[npub].kind10000.oEvent = oKind10000Event
      }
      if (state.oProfiles.byNpub[npub].kind10000.oEvent.created_at < oKind10000Event.created_at) {
        state.oProfiles.byNpub[npub].kind10000.oEvent = oKind10000Event
      }
    },
    */
    // same as updateKind3Event, but also initialize pubkeys from the following list
    processKind3Event: (state, action) => {
      const oKind3Event = action.payload
      const pubkey = oKind3Event.pubkey
      // const npub = nip19.npubEncode(pubkey)
      const npub = safeNpubEncode(pubkey)
      // check to see if kind3 event already exists, and if so, compare created_at
      if (npub) {
        let abort = false
        if (
          state.oProfiles.byNpub[npub] &&
          state.oProfiles.byNpub[npub].kind3 &&
          state.oProfiles.byNpub[npub].kind3.oEvent
        ) {
          const oKind3Event_old = state.oProfiles.byNpub[npub].kind3.oEvent
          if (oKind3Event_old.created_at > oKind3Event.created_at) {
            abort = true
          }
        }
        if (!abort) {
          // Presumably this profile is already in the database, otherwise we would not have searched for its kind3 event.
          // But just in case it's not, add it:
          ////////// !!!!!!!!!!!! //////////
          if (!state.oProfiles.byPubkey[pubkey]) {
            state.oProfiles.byPubkey[pubkey] = npub
          }
          if (!state.oProfiles.byNpub[npub]) {
            state.oProfiles.byNpub[npub] = JSON.parse(JSON.stringify(oDefaultByNpubData))
          }
          if (!state.oProfiles.byNpub[npub].pubkey) {
            state.oProfiles.byNpub[npub].pubkey = pubkey
          }
          if (!state.oProfiles.byNpub[npub].kind3.oEvent) {
            state.oProfiles.byNpub[npub].kind3.oEvent = oKind3Event
          }
          if (state.oProfiles.byNpub[npub].kind3.oEvent.created_at < oKind3Event.created_at) {
            state.oProfiles.byNpub[npub].kind3.oEvent = oKind3Event
          }
          // Fetch the degrees of separation of the author npub, authorDoS.
          const authorDoS = Number(state.oProfiles.byNpub[npub].wotScores.degreesOfSeparation)
          const minDoS = authorDoS + 1
          // now process each pubkey from the follows list
          const aTags_p = oKind3Event.tags.filter(([k, v]) => k === 'p' && v && v !== '')
          const aFollowsByPubkey = []
          aTags_p.forEach((tag_p, item) => {
            if (tag_p && typeof tag_p == 'object' && tag_p.length > 1) {
              const pk = tag_p[1]
              if (!aFollowsByPubkey.includes(pk)) {
                aFollowsByPubkey.push(pk)
              }
              // const np = nip19.npubEncode(pk)
              const np = safeNpubEncode(pk)
              if (np) {
                // Any preexisting npub must have MINIMUM degree of separation of minDoS (or might already be lower)
                if (state.oProfiles.byNpub[np]) {
                  const currentDoS = Number(state.oProfiles.byNpub[np].wotScores.degreesOfSeparation)
                  state.oProfiles.byNpub[np].wotScores.degreesOfSeparation = Math.min(minDoS, currentDoS)
                }
                // Any newly added npub must have a degrees of separation minDoS = authorDoS + 1.
                if (!state.oProfiles.byNpub[np]) {
                  state.oProfiles.byNpub[np] = JSON.parse(JSON.stringify(oDefaultByNpubData))
                  state.oProfiles.byNpub[np].wotScores.degreesOfSeparation = minDoS
                }
                // instantiate byPubkey if not already done
                if (!state.oProfiles.byPubkey[pk]) {
                  state.oProfiles.byPubkey[pk] = np
                }
                // update state.oProfiles.byNpub[np].followers
                if (!state.oProfiles.byNpub[np].followers.includes(pubkey)) {
                  state.oProfiles.byNpub[np].followers.push(pubkey)
                }
              }
            }
          })
          state.oProfiles.byNpub[npub].follows = aFollowsByPubkey
        }
      }
    },
    // same as updateKind10000Event, but also iterate through the mute list and update mutes and mutedBy
    processKind10000Event: (state, action) => {
      const oKind10000Event = action.payload
      const pubkey = oKind10000Event.pubkey
      // const npub = nip19.npubEncode(pubkey)
      const npub = safeNpubEncode(pubkey)
      if (npub) {
        ////////// !!!!!!!!!!!! //////////
        if (!state.oProfiles.byPubkey[pubkey]) {
          state.oProfiles.byPubkey[pubkey] = npub
        }
        if (!state.oProfiles.byNpub[npub]) {
          state.oProfiles.byNpub[npub] = JSON.parse(JSON.stringify(oDefaultByNpubData))
        }
        if (!state.oProfiles.byNpub[npub].pubkey) {
          state.oProfiles.byNpub[npub].pubkey = pubkey
        }
        if (!state.oProfiles.byNpub[npub].kind10000.oEvent) {
          state.oProfiles.byNpub[npub].kind10000.oEvent = oKind10000Event
        }
        if (state.oProfiles.byNpub[npub].kind10000.oEvent.created_at < oKind10000Event.created_at) {
          state.oProfiles.byNpub[npub].kind10000.oEvent = oKind10000Event
        }
      }
      // now process each pubkey from the mute list
      const aTags_p = oKind10000Event.tags.filter(([k, v]) => k === 'p' && v && v !== '')

      aTags_p.forEach((tag_p, item) => {
        if (tag_p && typeof tag_p == 'object' && tag_p.length > 1) {
          const pk = tag_p[1]
          // const np = nip19.npubEncode(pk)
          const np = safeNpubEncode(pk)
          if (np) {
            // Any newly added npub must have a degrees of separation minDoS = authorDoS + 1.
            if (!state.oProfiles.byNpub[np]) {
              state.oProfiles.byNpub[np] = JSON.parse(JSON.stringify(oDefaultByNpubData))
            }
            // instantiate byPubkey if not already done
            if (!state.oProfiles.byPubkey[pk]) {
              state.oProfiles.byPubkey[pk] = np
            }
            // update state.oProfiles.byNpub[np].followers
            if (!state.oProfiles.byNpub[np].mutedBy.includes(pubkey)) {
              state.oProfiles.byNpub[np].mutedBy.push(pubkey)
            }
            // state.oProfiles.byNpub[npub].mutes
            if (!state.oProfiles.byNpub[npub].mutes.includes(pk)) {
              state.oProfiles.byNpub[npub].mutes.push(pk)
            }
          }
        }
      })
    },
    updateDegreesOfSeparation: (state, action) => {
      const { npub_toUpdate, degreesOfSeparation_new } = action.payload
      if (!state.oProfiles.byNpub[npub_toUpdate]) {
        state.oProfiles.byNpub[npub_toUpdate] = JSON.parse(JSON.stringify(oDefaultByNpubData))
      }
      state.oProfiles.byNpub[npub_toUpdate].wotScores.degreesOfSeparation = degreesOfSeparation_new
    },
    wipeProfiles: (state, action) => {
      state.oProfiles = {}
      state.oProfiles.byPubkey = {}
      state.oProfiles.byNpub = {}
    },
  },
})

export const {
  addNewPubkey,
  updateAllDegreesOfSeparationScores,
  updateAllCoracleScores,
  updateAllBaselineInfluenceScores,
  updateBaselineInfluence,
  updateCoracleWoT,
  updateKind0Event,
  processKind3Event,
  processKind10000Event,
  updateDegreesOfSeparation,
  wipeProfiles,
} = profilesSlice.actions

export default profilesSlice.reducer
