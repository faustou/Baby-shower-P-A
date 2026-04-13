import HeroSection from '../components/HeroSection'
import InvitationSection from '../components/InvitationSection'
import EventInfoSection from '../components/EventInfoSection'
import RSVPForm from '../components/RSVPForm'
import GiftList from '../components/GiftList'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <InvitationSection />
      <EventInfoSection />
      <RSVPForm />
      <GiftList />
      <Footer />
    </main>
  )
}
