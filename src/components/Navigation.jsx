import { Button } from "@/components/ui/button";
import { Globe, Menu } from "lucide-react";
import { Link } from "react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

function Navigation() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="z-10 bg-gradient-to-r from-gray-900 to-black shadow-lg w-full relative">
      <div className="container mx-auto flex items-center justify-between p-4">
        
        <Link to="/" className="text-3xl font-bold text-white">
          Horizone
        </Link>

       
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-gray-400">Home</Link>
          {user?.publicMetadata?.role === "admin" && (
            <Link to="/hotels/create" className="text-white hover:text-gray-400">
              Create Hotel
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/chat" className="text-white hover:text-gray-400">Chat</Link>
        </div>

     
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-white">
            <Globe className="h-5 w-5 mr-2" /> EN
          </Button>
          <SignedOut>
            <Button variant="ghost" asChild>
              <Link to="/sign-in">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
            <Button asChild>
              <Link to="/account">My Account</Link>
            </Button>
          </SignedIn>
        </div>

        
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu className="text-white w-8 h-8" />
          </button>
        </div>
      </div>

      
      {isOpen && (
        <div className="md:hidden bg-gray-800 p-4 space-y-4">
          <Link to="/" className="block text-white">Home</Link>
          {user?.publicMetadata?.role === "admin" && (
            <Link to="/hotels/create" className="block text-white">Create Hotel</Link>
          )}
          <SignedOut>
            <Link to="/sign-in" className="block text-white">Log In</Link>
            <Link to="/sign-up" className="block text-white">Sign Up</Link>
          </SignedOut>
          <SignedIn>
            <Link to="/account" className="block text-white">My Account</Link>
            <UserButton />
          </SignedIn>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
