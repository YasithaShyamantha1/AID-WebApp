import { Outlet } from "react-router";
import Navigation from "@/components/Navigation";

export default function MainLayout() {
  return (
    <>
      <Navigation name="Yasitha" />
      <Outlet />
    </>
  );
}

 