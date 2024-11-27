import { Outlet } from "@remix-run/react"
import MusicAndSoundControls from "~/components/custom/BackgroundMusic";
import { Header } from "~/components/custom/landing/Header"
import { PageContainer } from "~/components/custom/PageContainer"
import { SoundProvider } from "~/components/custom/SoundContext";

function _layout() {
  return (
    <div
      className="min-h-dvh grid grid-cols-1 max-h-screen"
      style={{
        backgroundImage: 'url(/assets/landing/img/gradiente.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Header />
      <main className="flex justify-center items-center">
        <PageContainer className="z-0 bg-white flex justify-center items-center">
          
          <section className="w-[950px] aspect-[3/2] relative flex flex-col gap-8 items-center">
          
          <div className="absolute top-0 right-0">
            <SoundProvider>
          <MusicAndSoundControls />
          </SoundProvider>
          </div>
            <img
              className="-z-10 aspect-[3/2] object-cover absolute inset-0"
              src="/assets/backgrounds/LandingBackground.png"
              alt="Landing Background"
            />
            
            <div className="absolute h-64 inset-0 bg-gradient-to-b from-black/75 via-purple-transparent to-transparent -z-10"></div>
            
            <Outlet />
          </section>
        </PageContainer>
      </main>
    </div>
  );
}

export default _layout