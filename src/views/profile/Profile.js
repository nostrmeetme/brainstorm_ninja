import { useNDK } from '@nostr-dev-kit/ndk-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { CAvatar, CCol, CContainer, CRow } from '@coreui/react'
import LeaveTrustAttestation from './leaveTrustAttestation'

const Profile = () => {
  const { getProfile } = useNDK()
  const npub = useSelector((state) => state.siteNavigation.npub)
  const oProfile = getProfile(npub)
  return (
    <CContainer fluid>
      <CRow>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '100%',
              maxHeight: '200px',
              position: 'absolute',
              top: '0px',
              overflow: 'scroll',
            }}
          >
            <img
              src={oProfile?.banner}
              style={{
                borderRadius: '20px 20px 0px 0px',
                width: '100%',
                opacity: '0.0',
              }}
              alt=""
            />
          </div>
        </div>
      </CRow>
      <CRow>
        <CCol sm="auto">
          <div className="profileAvatarContainer">
            <img src={oProfile?.image} className="profileAvatarLarge" />
          </div>
        </CCol>
        <CCol sm="auto">
          <div>
            <span style={{ fontSize: '34px', marginRight: '20px' }}>{oProfile?.displayName}</span>
            <span style={{ color: 'grey' }}>@{oProfile?.name}</span>
          </div>
          <small>{npub}</small>
        </CCol>
      </CRow>
      <CRow>
        <LeaveTrustAttestation rateeNpub={npub} />
      </CRow>
    </CContainer>
  )
}

export default Profile
