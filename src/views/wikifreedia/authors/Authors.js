import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CNavLink,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { updateNpub } from 'src/redux/features/siteNavigation/slice'
import { nip19 } from 'nostr-tools'
import { ShowAuthor } from '../components/ShowAuthor'

const WikiAuthors = () => {
  const oWikiCategories = useSelector((state) => state.wikifreedia.categories)
  const aWikiCategories = Object.keys(oWikiCategories)
  const oAuthors = useSelector((state) => state.wikifreedia.authors)

  const aAuthors = Object.keys(oAuthors)

  return (
    <>
      <center>
        <h3>Wiki Authors</h3>
      </center>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{aAuthors.length} authors</strong>
            </CCardHeader>
            <CCardBody>
              <CTable striped small hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">author</CTableHeaderCell>
                    <CTableHeaderCell scope="col"># of articles</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aAuthors.map((pubkey, item) => {
                    const npub = nip19.npubEncode(pubkey)
                    return (
                      <CTableRow key={item}>
                        <CTableDataCell scope="row">
                          <ShowAuthor npub={npub} />
                        </CTableDataCell>
                        <CTableDataCell>{oAuthors[pubkey].length}</CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default WikiAuthors
