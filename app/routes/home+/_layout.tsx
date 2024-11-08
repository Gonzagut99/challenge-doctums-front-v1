import { Outlet } from "@remix-run/react"

function _layout() {
  return (
    <main className="min-h-dvh grid grid-cols-1 max-h-screen">
        <Outlet></Outlet>        
    </main>
  )
}

export default _layout