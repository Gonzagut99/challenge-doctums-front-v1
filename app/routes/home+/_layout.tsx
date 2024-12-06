import { Outlet } from "@remix-run/react"
import MusicAndSoundControls from "~/components/custom/music/ControlMusic";
import { Header } from "~/components/custom/landing/Header"
import { PageContainer } from "~/components/custom/PageContainer"
import { SoundProvider } from "~/components/custom/music/SoundContext";

function _layout() {
  return (
    
    <div
      className="min-h-dvh grid grid-cols-1 relative"
      style={{
        backgroundImage: 'url(/assets/landing/img/gradiente.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
        {/* <img src="/assets/landing/img/gradiente.png" alt="background" className="fixed top-0 left-0 w-screen h-screen -z-10 object-cover"/> */}
        <Header />
      

      <main className="flex justify-center items-center">
        <PageContainer className="z-0 bg-white flex justify-center items-center">
          
          <section className="w-[950px] aspect-[3/2] relative flex flex-col gap-8 items-center">
          
            <img
              className="-z-10 aspect-[3/2] object-cover absolute inset-0"
              src="/assets/backgrounds/LandingBackground.png"
              alt="Landing Background"
            />
            
            <div className="absolute h-96 inset-0 bg-gradient-to-b from-black/75 via-purple-transparent to-transparent -z-10"></div>
            
            <Outlet />
          </section>
        </PageContainer>
      </main>
     
    </div>
  );
}

export default _layout