'use client'

import { useState } from 'react'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Services } from '@/components/landing/services'
import { Projects } from '@/components/landing/projects'
import { Shares } from '@/components/landing/shares'
import { WelcomeLevels } from '@/components/landing/welcome-levels'
import { Footer } from '@/components/landing/footer'
import { LoginModal } from '@/components/modals/login-modal'
import { AdminModal } from '@/components/modals/admin-modal'
import { InvestorModal } from '@/components/modals/investor-modal'
import { PartnerRegistrationModal } from '@/components/modals/partner-registration-modal'

export default function Page() {
  const [login, setLogin] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [investor, setInvestor] = useState(false)
  const [partner, setPartner] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onLogin={() => setLogin(true)}
        onAdmin={() => setAdmin(true)}
        onPartner={() => setPartner(true)}
      />
      <Hero
        onInvestor={() => setInvestor(true)}
        onPartner={() => setPartner(true)}
      />
      <Services />
      <Projects />
      <Shares />
      <WelcomeLevels />
      <Footer />

      <LoginModal open={login} onClose={() => setLogin(false)} />
      <AdminModal open={admin} onClose={() => setAdmin(false)} />
      <InvestorModal open={investor} onClose={() => setInvestor(false)} />
      <PartnerRegistrationModal
        open={partner}
        onClose={() => setPartner(false)}
      />
    </div>
  )
}