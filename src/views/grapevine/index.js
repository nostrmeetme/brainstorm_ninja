import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCol, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { DocsExample } from 'src/components'
import CIcon from '@coreui/icons-react'
import { cilBolt, cilBoltCircle, cilCircle, cilThumbUp } from '@coreui/icons'
import GrapevineListener from 'src/helpers/listeners/GrapevineListener'
import { updateApp } from 'src/redux/features/siteNavigation/slice'

const GrapevineDashboard = () => {
  const dispatch = useDispatch()
  dispatch(updateApp('grapevine'))
  const oActions = useSelector((state) => state.grapevine.actions)
  const oCategories = useSelector((state) => state.grapevine.categories)
  const oContexts = useSelector((state) => state.grapevine.contexts)
  const oTrustAttestations = useSelector((state) => state.grapevine.trustAttestations)
  return (
    <>
      <GrapevineListener />
      <center>
        <h3>Grapevine Dashboard</h3>
        <br />
        <div>This app is under construction!</div>
      </center>
      <br />
      <DocsExample href="components/widgets/#cwidgetstatsf">
        <CRow xs={{ gutter: 1 }}>
          <div>
            Create <span style={{ fontStyle: 'italic' }}>context-specific</span> trust attestations.
          </div>
          <div>
            Each context is defined by an <span style={{ fontStyle: 'italic' }}>action</span> and a{' '}
            <span style={{ fontStyle: 'italic' }}>category</span>.
          </div>
        </CRow>
        <br />
        <CRow xs={{ gutter: 4 }}>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/trustAttestations/viewAll">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilThumbUp} size="xl" />}
                title={Object.keys(oTrustAttestations).length}
                value="trust attestations"
                color="primary"
              />
            </CNavLink>
          </CCol>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/contexts/viewAll">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilBoltCircle} size="xl" />}
                title={Object.keys(oContexts).length}
                value="contexts"
                color="info"
              />
            </CNavLink>
          </CCol>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/actions/viewAll">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilBolt} size="xl" />}
                title={Object.keys(oActions).length}
                value="actions"
                color="info"
              />
            </CNavLink>
          </CCol>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/categories/viewAll">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilCircle} size="xl" />}
                title={Object.keys(oCategories).length}
                value="categories"
                color="info"
              />
            </CNavLink>
          </CCol>
        </CRow>
      </DocsExample>
    </>
  )
}

export default GrapevineDashboard
