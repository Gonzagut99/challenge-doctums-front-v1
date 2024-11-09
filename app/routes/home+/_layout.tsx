import { Outlet } from "@remix-run/react"
import { PageContainer } from "~/components/custom/PageContainer"

function _layout() {
  return (
    <main className="min-h-dvh grid grid-cols-1 max-h-screen">
        <PageContainer className="z-0 bg-gradient-to-r from-sky-500 to-indigo-500 flex justify-center items-center">
            <section className="w-[950px] aspect-[3/2] relative flex flex-col gap-8 justify-center items-center">
                <img
                    className="-z-10 aspect-[3/2] object-cover absolute inset-0"
                    src="/assets/backgrounds/LandingBackground.png"
                    alt="Landing Background"
                />
                <Outlet></Outlet>  
            </section>
        </PageContainer>
              
    </main>
  )
}

export default _layout