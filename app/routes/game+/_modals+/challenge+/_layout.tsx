import { Outlet } from "@remix-run/react"

function _layout() {
  return (
    <div>
        <Outlet></Outlet>
    </div>
  )
}

export default _layout