import design from '../pages/design/design'
// import test from '../pages/test'

// const design = () => import('../pages/design/design')
const test = () => import('../pages/test')

export default [
  {
    path: '/',
    component: test,
  },
  {
    path: '/index',
    component: design,
  },
]