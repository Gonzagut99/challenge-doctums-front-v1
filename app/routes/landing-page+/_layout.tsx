import { Outlet } from "@remix-run/react"
import { Header } from "~/components/custom/landing/Header"
// import Footer from "~/components/custom/landing/Footer"
// import HeroInfo from "~/components/custom/landing/HeroInfo"
// import HeroSection from "~/components/custom/landing/HeroSection"
// import PricingSection from "~/components/custom/landing/PricingSection"
// import Team from "~/components/custom/landing/TeamSection"

function LandingLayout() {
  return (
    <div style={
        {
          backgroundImage: "url(/assets/landing/img/gradiente.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }
    }>
        <Header />
        {/* <div className="h-[500px] md:h-[660px]">
            <HeroSection />
        </div>
        <div className="relative mx-2">{benefitsSection}</div>
        <HeroInfo />
        <PricingSection />

        <Team />
        <Footer /> */}
        <Outlet></Outlet>
    </div>
  )
}

export default LandingLayout
