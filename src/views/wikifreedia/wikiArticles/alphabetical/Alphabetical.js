import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CNavLink,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { updateViewWikifreediaTopic } from '../../../../redux/features/siteNavigation/slice'

const WikiArticlesAlphabetical = () => {
  const [searchField, setSearchField] = useState('')
  const [sortBy, setSortBy] = useState('alphabetical')
  const oWikiArticles_byNaddr = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.wikifreedia.articles.byDTag)
  const aTopicsRef = Object.keys(oWikiArticles_byDTag).sort()
  const [aTopicsFiltered, setATopicsFiltered] = useState(aTopicsRef)

  const dispatch = useDispatch()

  const handleSearchFieldChange = useCallback(
    async (e) => {
      const newField = e.target.value
      setSearchField(newField)
      const newArray = []
      aTopicsRef.forEach((t) => {
        if (t.includes(newField)) {
          newArray.push(t)
        }
      })
      setATopicsFiltered(newArray)
    },
    [searchField, aTopicsFiltered],
  )

  const handleSortByChange = useCallback(
    (newSortByValue) => {
      console.log('handleSortByChange; sortBy: ' + newSortByValue)
      if (newSortByValue == 'alphabetical') {
        const aFoo = Object.keys(oWikiArticles_byDTag).sort()
        setATopicsFiltered(aFoo)
      }
      if (newSortByValue == 'chronological') {
        const aFoo = Object.keys(oWikiArticles_byDTag).sort().reverse()
        setATopicsFiltered(aFoo)
      }
    },
    [sortBy, aTopicsFiltered],
  )

  const processDTagClick = (dTag) => {
    dispatch(updateViewWikifreediaTopic(dTag))
  }

  const updateSortBySelector = (e) => {
    const newSortByValue = e.target.value
    setSortBy(newSortByValue)
    handleSortByChange(newSortByValue)
  }
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>
                {aTopicsFiltered.length} Topics, {Object.keys(oWikiArticles_byNaddr).length} articles
              </strong>
            </CCardHeader>
            <CCardBody>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-block' }}>
                  <CFormSelect
                    value={sortBy}
                    onChange={(e)=>{updateSortBySelector(e)}}
                    options={[
                      { label: 'alphabetical', value: 'alphabetical' },
                      { label: 'most recent update', value: 'chronological', disabled: true },
                      { label: 'WoT score', value: 'wetScore', disabled: true },
                    ]}
                  ></CFormSelect>
                </div>
              </div>
              <CFormInput
                label="search by topic:"
                type="text"
                value={searchField}
                onChange={handleSearchFieldChange}
              />
              <br />
              <CTable striped small hover>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">
                      topics ({aTopicsFiltered.length})
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col"># authors</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {aTopicsFiltered.map((topicSlug, item) => {
                    const oAuthors = oWikiArticles_byDTag[topicSlug]
                    const aAuthors = Object.keys(oAuthors)
                    return (
                      <CTableRow key={item}>
                        <CTableDataCell scope="row">
                          <CNavLink
                            href="#/wikifreedia/singleTopic"
                            onClick={() => processDTagClick(topicSlug)}
                          >
                            {topicSlug}
                          </CNavLink>
                        </CTableDataCell>
                        <CTableDataCell>{aAuthors.length}</CTableDataCell>
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

export default WikiArticlesAlphabetical
