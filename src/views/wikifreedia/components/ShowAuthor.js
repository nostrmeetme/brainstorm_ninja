import React from 'react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { CNavLink } from '@coreui/react'
import { useDispatch } from 'react-redux'
import { updateNpub } from 'src/redux/features/siteNavigation/slice'

export const ShowAuthor = ({npub}) => {
  const { getProfile } = useNDK()
  const dispatch = useDispatch()

  const oProfile = getProfile(npub)
  let author = oProfile?.displayName
  if (!author) {
    author = '@' + oProfile?.name
  }
  if (!author) {
    author = npub
  }
  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="profileAvatarContainerSmall">
        <CNavLink href="#/profile" onClick={() => setCurrentNpub(npub)}>
          <img src={oProfile?.image} className="profileAvatarSmall" />
        </CNavLink>
      </div>{' '}
      <div style={{ display: 'inline-block', marginLeft: '5px' }}>
        <strong>{author}</strong>
      </div>
    </div>
  )
}
