import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from '@/layout/baseLayout.tsx';
import { lazy } from 'react';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <BaseLayout />,
      children: [
        {
          path: '/',
          Component: lazy(() => import('@/pages/Index.tsx'))
        },
        {
          path: '/simple',
          Component: lazy(() => import('@/pages/SimplePDF.tsx'))
        },
        {
          path: '/span',
          Component: lazy(() => import('@/pages/ColSpanTable.tsx'))
        },
        {
          path: '/test',
          Component: lazy(() => import('@/pages/Test.tsx'))
        }
        //{
        //  path: '/books/:id',
        //  Component: lazy(() => import('@/pages/Detail.tsx'))
        //},
        //{
        //  path: '/403',
        //  Component: lazy(() => import('@/pages/403.tsx'))
        //},
        //{
        //  path: '/admin',
        //  element: (
        //    <RequireAdmin>
        //      <AdminIndex />
        //    </RequireAdmin>
        //  ),
        //  children: [
        //    {
        //      path: 'books/list',
        //      Component: lazy(() => import('@/pages/Admin/Book/index.tsx'))
        //    },
        //    {
        //      path: 'category/list',
        //      Component: lazy(() => import('@/pages/Admin/Category/index.tsx'))
        //    }
        //  ]
        //}
      ]
    },
    {
      path: '*',
      Component: lazy(() => import('@/pages/404.tsx'))
    }
  ],
  { basename: import.meta.env.MODE === 'development' ? '/' : '/springboot' }
);
export default router;
