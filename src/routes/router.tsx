import { createBrowserRouter } from 'react-router-dom'
import BaseLayout from '@/layout/baseLayout.tsx'
import { lazy } from 'react'

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    // ErrorBoundary: lazy(() => import('@/pages/404.tsx')),
    children: [
      {
        path: '/',
        Component: lazy(() => import('@/pages/Index.tsx'))
      }
    ]
  },
  {
    path: '*',
    Component: lazy(() => import('@/pages/404.tsx'))
  }
])
export default router
