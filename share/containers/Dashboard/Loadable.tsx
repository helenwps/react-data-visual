import React from 'react'
import loadable from 'utils/loadable'
import { Skeleton } from 'antd'

export const Dashboard = loadable(() => import('./'), {
  fallback: <Skeleton active={true} paragraph={{ rows: 15 }} />
})
