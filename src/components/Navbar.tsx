import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircleHeart, Home, Book, Utensils, BarChart2, Settings } from 'lucide-react';

interface NavbarProps {
  onOpenAISettings: () => void;
  onOpenSettings: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAISettings, onOpenSettings }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-2">
              <MessageCircleHeart className="h-6 w-6 text-gray-900" />
              <Link to="/" className="text-xl font-bold text-gray-900">
                distincto.life
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              <Home className="h-5 w-5" />
            </Link>
            <Link
              to="/journal"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              <Book className="h-5 w-5" />
            </Link>
            <Link
              to="/food"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              <Utensils className="h-5 w-5" />
            </Link>
            <Link
              to="/reports"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              <BarChart2 className="h-5 w-5" />
            </Link>
            <button
              onClick={onOpenSettings}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
