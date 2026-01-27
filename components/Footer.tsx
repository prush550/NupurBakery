import HiddenScrew from './HiddenScrew';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white section-padding">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">Nupur Bakery</h3>
            <p className="text-gray-400">
              Nupur's Messy Kitchen by Divya 'Nupur' Tiwari - Creating delicious memories, one cake at a time. <HiddenScrew />
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📞 9470241300</li>
              <li>📍 Bhopal, Madhya Pradesh</li>
              <li>🕐 By Appointment</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Nupur Bakery. All rights reserved.
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            100% Vegetarian | Hygienic Preparation | Custom Designs
          </p>
        </div>
      </div>
    </footer>
  );
}
