import { Button } from "@/components/ui/button";
import { Globe, Menu, PlusCircle } from "lucide-react";
import { Link } from "react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

function Navigation() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="z-10 bg-gradient-to-r from-gray-900 to-black shadow-2xl w-full relative">
      <div className="container mx-auto flex items-center justify-between p-4">
        
        {/* Animated logo */}
        <Link to="/" className="text-3xl font-bold text-white transform hover:scale-110 transition-all duration-300">
          Horizone
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-gray-400 transition-all duration-300">Home</Link>
          {user?.publicMetadata?.role === "admin" && (
            <Link to="/hotels/create" className="text-white hover:text-gray-400 transition-all duration-300 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5" />
              <span>Create Hotel</span>
            </Link>
          )}
        </div>

        {/* Language & Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:text-gray-300 transition-all duration-300">
            <Globe className="h-5 w-5 mr-2" /> EN
          </Button>
          <SignedOut>
            <Button variant="ghost" asChild>
              <Link to="/sign-in" className="text-white hover:text-gray-300">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/sign-up" className="text-white hover:text-gray-300">Sign Up</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
            <Button asChild>
              <Link to="/account" className="text-white hover:text-gray-300">My Account</Link>
            </Button>
          </SignedIn>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu className="text-white w-8 h-8" />
          </button>
        </div>
        
        {/* Create Hotel Button with icon */}
        {/* {user?.publicMetadata?.role === "admin" && (
          <Link 
            to="/hotels/create" 
            className="fixed right-8 bottom-8 bg-black hover:bg-gray-900 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center space-x-2"
          >
            <PlusCircle className="w-6 h-6" />
            <span>Create Hotel</span>
          </Link>
        )} */}
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 p-4 space-y-4">
          <Link to="/" className="block text-white">Home</Link>
          {user?.publicMetadata?.role === "admin" && (
            <Link to="/hotels/create" className="block text-white flex items-center space-x-2">
              <PlusCircle className="w-5 h-5" />
              <span>Create Hotel</span>
            </Link>
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
