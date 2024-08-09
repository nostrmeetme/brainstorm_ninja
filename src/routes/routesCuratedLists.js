import React from 'react'

// Dashboard
const CuratedLists = React.lazy(() => import('src/views/curatedLists/index'))

const About = React.lazy(() => import('src/views/curatedLists/about/index'))
const CreateItem = React.lazy(() => import('src/views/curatedLists/createItem/index'))
const CreateList = React.lazy(() => import('src/views/curatedLists/createList/index'))
const ViewItem = React.lazy(() => import('src/views/curatedLists/item/index'))
const ViewList = React.lazy(() => import('src/views/curatedLists/list/index'))
const ViewLists = React.lazy(() => import('src/views/curatedLists/lists/index'))

const routes = [
  { path: '/curatedLists', name: 'Curated Lists', element: CuratedLists },

  { path: '/curatedLists/about', name: 'About Curated Lists', element: About },
  { path: '/curatedLists/createItem', name: 'Create Item', element: CreateItem },
  { path: '/curatedLists/createList', name: 'Create List', element: CreateList },
  { path: '/curatedLists/viewItem', name: 'About Curated Lists', element: ViewItem },
  { path: '/curatedLists/viewList', name: 'About Curated Lists', element: ViewList },
  { path: '/curatedLists/viewLists', name: 'View Lists', element: ViewLists },
]

export default routes
