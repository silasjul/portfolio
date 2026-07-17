import Gallery from '@/components/Gallery'
import LevaControls from '@/components/LevaControls'
import SiteNav from '@/components/SiteNav'
import ScreenLoader from '@/components/ScreenLoader'

export default function Home() {
  return (
    <>
      <LevaControls />
      <Gallery />
      <SiteNav />
      <ScreenLoader />
    </>
  )
}
