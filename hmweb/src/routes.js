// const admin = () => import('./pages/admin')
// const attendance = () => import('./pages/attendance')

import admin from './pages/admin'
import attendance from './pages/attendance'

export default [
  {
    path: '/attendance',
    component: attendance,
  },
  {
    path: '/admin',
    component: admin,
  },
]