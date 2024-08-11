import React, { useCallback, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CCardTitle,
  CForm,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react'
import LoginOriginal from './LoginOriginal'
import { isHex, safeDecode } from '../../../helpers/nip19'
import { generateSecretKey, getPublicKey, nip19 } from 'nostr-tools'
import { bytesToHex } from '@noble/hashes/utils'

const Extension = () => {
  return (
    <>
      <div className="d-grid gap-2">
        <CButton color="primary">Login with extension</CButton>
      </div>
      <div style={{ textAlign: 'center' }}>Don't have an extension yet?</div>
      <div style={{ textAlign: 'center' }}>
        Get yours from{' '}
        <a href="https://github.com/fiatjaf/nos2x" target="_blank" rel="noreferrer">
          Nos2x
        </a>{' '}
        or{' '}
        <a href="https://getalby.com" target="_blank" rel="noreferrer">
          Alby
        </a>
      </div>
    </>
  )
}

const RemoteSigner = () => {
  const [error, setError] = useState(false)
  const [nip05Address, setNip05Address] = useState('')

  const handleInputChange = useCallback(
    (e) => {
      setNip05Address(e.target.value)
      try {

      } catch (e) {
        setError(true)
      }
    },
    [setNip05Address, setError],
  )
  return (
    <>
      <div>Your NIP-05 address:</div>
      <CForm>
        <CFormInput
          type="text"
          placeholder="your@nsec.app"
          required
          value={nip05Address}
          onChange={handleInputChange}
          invalid={error}
        />
      </CForm>
      <br />
      <div className="d-grid gap-2">
        <CButton color="primary">Login with remote signer</CButton>
      </div>
      <div style={{ textAlign: 'center' }}>Don't have a remote signer yet?</div>
      <div style={{ textAlign: 'center' }}>
        Set yours up at{' '}
        <a href="https://nsec.app" target="_blank" rel="noreferrer">
          nsec.app
        </a>
      </div>
    </>
  )
}

const SecretKey = () => {
  const [error, setError] = useState(false)
  const [nsec, setNsec] = useState('')
  const [hexKey, setHexKey] = useState('')
  const [npub, setNpub] = useState('')
  const [pubkey, setPubkey] = useState('')

  const generateNewSecretKey = useCallback(() => {
    const hex = generateSecretKey() // for up to date nostr-tools
    // const hex = generatePrivateKey() // for nostr-tools 1.14.0
    const pubkey_ = getPublicKey(hex)
    const hexKey_ = bytesToHex(hex)
    const nsec_ = nip19.nsecEncode(hex)
    const npub_ = nip19.npubEncode(pubkey_)
    setHexKey(hexKey_)
    setNsec(nsec_)
    setNpub(npub_)
    setPubkey(pubkey_)
  }, [setHexKey, setNsec])

  const handleInputChange = useCallback(
    (e) => {
      setNsec(e.target.value)

      try {
        let hex = null
        if (isHex(e.target.value)) hex = e.target.value
        else {
          const decode = safeDecode(e.target.value)
          if (decode && decode.type === 'nsec') hex = bytesToHex(decode.data)
        }

        if (hex) {
          const pubkey = getPublicKey(hexToBytes(hex))
          setHexKey(hex)
          setNpub(nip19.npubEncode(pubkey))
          setError(false)
        } else {
          setError(true)
        }
      } catch (e) {
        setError(true)
      }
    },
    [setNsec, setHexKey, setNpub, setError],
  )

  return (
    <>
      <div>Your secret key:</div>
      <CForm>
        <CFormInput
          type="text"
          placeholder="nsec (to do: allow nsec or hex)"
          required
          value={nsec}
          onChange={handleInputChange}
          invalid={error}
        />
      </CForm>
      <br />
      <div className="d-grid gap-2">
        <CButton color="primary">Login with secret key</CButton>
      </div>
      <br />
      <div style={{ textAlign: 'center' }}>Don't have a secret key yet?</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'blue' }} onClick={() => generateNewSecretKey()}>
          Generate a new secret key
        </div>
      </div>
    </>
  )
}

const DisambiguateLoginMethod = ({ loginMethod }) => {
  if (loginMethod == 'extension') {
    return <Extension />
  }
  if (loginMethod == 'remoteSigner') {
    return <RemoteSigner />
  }
  if (loginMethod == 'secretKey') {
    return <SecretKey />
  }
  return <>error</>
}

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('extension')
  return (
    <>
      <CContainer md style={{ marginTop: '50px' }}>
        <CRow className="justify-content-center">
          <div className="col-auto">
            <CCard className="w-80">
              <CCardBody>
                <center>
                  <CCardTitle>Nostr Login</CCardTitle>
                </center>
              </CCardBody>
              <CCardBody>
                <div style={{ border: '1px solid grey' }}>
                  <CButton onClick={() => setLoginMethod('extension')}>Extension</CButton>
                  <CButton onClick={() => setLoginMethod('remoteSigner')}>Remote Signer</CButton>
                  <CButton onClick={() => setLoginMethod('secretKey')}>Secret Key</CButton>
                </div>
              </CCardBody>
              <CCardBody>
                <DisambiguateLoginMethod loginMethod={loginMethod} />
              </CCardBody>
            </CCard>
          </div>
        </CRow>
      </CContainer>
      <LoginOriginal />
    </>
  )
}

export default Login
