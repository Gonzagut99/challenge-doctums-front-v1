import { Outlet } from "@remix-run/react"
import { Header } from "~/components/custom/landing/Header"
import { PageContainer } from "~/components/custom/PageContainer"


function _layout() {
  return (
    <div
      className="min-h-dvh grid grid-cols-1 h-full"
      style={{
        backgroundImage: 'url(/assets/landing/img/gradiente.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Header />
      <main className="min-h-dvh grid grid-cols-1 max-h-screen"
      >
        <PageContainer className="z-0 bg-transparent flex justify-center items-center">
          <section className="w-[950px] aspect-[3/2] relative flex flex-col gap-8 justify-center items-center">
            <img
              className="-z-10 aspect-[3/2] object-fill absolute inset-0"
              src="/assets/backgrounds/waitingHallBg.png"
              alt="Landing Background"
            />
            <Outlet />
          </section>
        </PageContainer>
      </main>
    </div>
  );
}

export default _layout