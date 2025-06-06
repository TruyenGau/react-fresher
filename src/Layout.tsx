import { Outlet } from "react-router-dom"
import AppHeader from "./components/layout/app.header"
import { useEffect } from "react"
import { fetchAccountApi } from "services/api"
import { useCurrentApp } from "components/context/app.context"

const Layout = () => {
  const { setUser, isAppLoading, setIsAppLoadding } = useCurrentApp();
  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountApi();
      if (res.data) {
        setUser(res.data.user);
      }
      setIsAppLoadding(false);
    }

    fetchAccount();
  }, [])
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  )
}

export default Layout
