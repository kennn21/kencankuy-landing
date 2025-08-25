// app/components/Footer.tsx
import { Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-brand-pink">KencanKuy</h3>
            <p className="text-gray-500 text-sm">
              © 2025 KencanKuy. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6 mb-4 md:mb-0 text-gray-600">
            <a href="#" className="hover:text-brand-pink">
              About Us
            </a>
            <a href="#" className="hover:text-brand-pink">
              Contact
            </a>
            <a href="#" className="hover:text-brand-pink">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-brand-pink">
              Terms
            </a>
          </div>
          <div className="flex space-x-4 text-gray-500">
            <a href="#" className="hover:text-brand-pink">
              <Instagram />
            </a>
            <a href="#" className="hover:text-brand-pink">
              <Twitter />
            </a>
            <a href="#" className="hover:text-brand-pink">
              <Facebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
