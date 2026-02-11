import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-black border-t border-white/5 text-center">
      <div className="container mx-auto px-6">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} جميع الحقوق محفوظة للمهندس جمعان سعيد.
        </p>
        <p className="text-gray-700 text-xs mt-2">
          Designed for Excellence.
        </p>
      </div>
    </footer>
  );
};

export default Footer;