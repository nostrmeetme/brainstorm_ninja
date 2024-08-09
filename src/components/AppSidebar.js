import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import { AppSidebarNav } from 'src/components/AppSidebarNav'

// sidebar nav config
import navigationHomeSignedIn from 'src/nav/_navHomeSignedIn'
import navigationHomeSignedInDevMode from 'src/nav/_navHomeSignedInDevMode'
import navigationHomeSignedOut from 'src/nav/_navHomeSignedOut'
import navigationConceptGraph from 'src/nav/_navConceptGraph'
import navigationGrapevine from 'src/nav/_navGrapevine'
import navigationGrapevineDevMode from 'src/nav/_navGrapevineDevMode'
import navigationCuratedLists from 'src/nav/_navCuratedLists'
import navigationBadges from 'src/nav/_navBadges'
import navigationNestedLists from 'src/nav/_navNestedLists'
import navigationNostrapedia from 'src/nav/_navNostrapedia'
import navigationNostrapediaDevMode from 'src/nav/_navNostrapediaDevMode'
import navigationTwittr from 'src/nav/_navTwittr'
import navigationHelloWorld from 'src/nav/_navHelloWorld'
import navigationNostrAppsDirectory from 'src/nav/_navNostrAppsDirectory'
import navigationRelaysDirectory from 'src/nav/_navRelaysDirectory'
import navigationContentDiscovery from 'src/nav/_navContentDiscovery'

import navigationSettingsSignedIn from 'src/nav/_navSettingsSignedIn'
import navigationSettingsSignedInDevMode from 'src/nav/_navSettingsSignedInDevMode'
import navigationSettingsSignedOut from 'src/nav/_navSettingsSignedOut'

import { updateSidebarShow } from 'src/redux/features/ui/slice'
import { updateApp } from 'src/redux/features/siteNavigation/slice'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain, faBoltLightning, faBolt } from '@fortawesome/free-solid-svg-icons'

function getNavigation(activeApp, signedIn, developmentMode) {
  switch (activeApp) {
    case 'home':
      if (!signedIn) {
        return navigationHomeSignedOut
      }
      if (developmentMode == 'show') {
        return navigationHomeSignedInDevMode
      }
      return navigationHomeSignedIn
    case 'conceptGraph':
      return navigationConceptGraph
    case 'contentDiscovery':
      return navigationContentDiscovery
    case 'grapevine':
      if (developmentMode == 'show') {
        return navigationGrapevineDevMode
      }
      return navigationGrapevine
    case 'nestedLists':
      return navigationNestedLists
    case 'curatedLists':
      return navigationCuratedLists
    case 'badges':
      return navigationBadges
    case 'wiki':
      if (developmentMode == 'show') {
        return navigationNostrapediaDevMode
      }
      return navigationNostrapedia
    case 'twittr':
      return navigationTwittr
    case 'helloWorld':
      return navigationHelloWorld
    case 'nostrAppsDirectory':
      return navigationNostrAppsDirectory
    case 'relaysDirectory':
      return navigationRelaysDirectory
    case 'settings':
      if (!signedIn) {
        return navigationSettingsSignedOut
      }
      if (developmentMode == 'show') {
        return navigationSettingsSignedInDevMode
      }
      return navigationSettingsSignedIn
    default:
      if (!signedIn) {
        return navigationHomeSignedOut
      }
      return navigationHomeSignedIn
  }
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)
  const activeApp = useSelector((state) => state.siteNavigation.app)
  const signedIn = useSelector((state) => state.profile.signedIn)
  const developmentMode = useSelector((state) => state.settings.general.developmentMode)

  const navigation = getNavigation(activeApp, signedIn, developmentMode)

  return (
    <CSidebar className="border-end" colorScheme="dark" position="fixed" visible={sidebarShow}>
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand onClick={() => dispatch(updateApp('home'))} href="#/dashboard" style={{ textDecoration: 'none' }}>
          <img
            src="./brainstorm010_white.svg"
            style={{ height: '25px', marginLeft: '8px', marginRight: '10px' }}
          />
          brainSToRm
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          // onClick={() => dispatch({ type: 'set', sidebarShow: false })}
          onClick={() => dispatch(updateSidebarShow(false))}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

/*
<FontAwesomeIcon icon={faBrain} /> brainSToRm <FontAwesomeIcon icon={faBoltLightning} />
*/
