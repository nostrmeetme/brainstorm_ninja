import React from 'react'

// Dashboard
const Badges = React.lazy(() => import('src/views/badges/index'))

const routes = [
  { path: '/badges', name: 'Badges', element: Badges },
]

export default routes
