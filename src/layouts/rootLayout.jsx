import { Outlet } from "react-router";
// import { Toaster } from "sonner";
import { Toaster } from "../components/ui/sonner";

export default function RootLayout(){

    return(
        <>
        <Outlet/>
        <Toaster />
        </>
    );
}