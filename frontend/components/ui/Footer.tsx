import { Hotel } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Hotel className="h-5 w-5 text-blue-400" />
            <span className="text-white font-semibold">HotelBoss</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} HotelBoss. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
