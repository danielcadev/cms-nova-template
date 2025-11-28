'use client'

import { CoverImageConfig } from './CoverImageConfig'
import { TitleConfig } from './TitleConfig'
import { TransportConfig } from './TransportConfig'

export function BasicInfoSection() {
  return (
    <div className="space-y-10">
      <TitleConfig />
      <div className="h-px bg-zinc-100" />
      <TransportConfig />
      <div className="h-px bg-zinc-100" />
      <CoverImageConfig />
    </div>
  )
}
