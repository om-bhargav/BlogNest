import OuterLayout from '@/components/OuterLayout'
import React from 'react'

export default function layout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <OuterLayout>{children}</OuterLayout>
  )
}
