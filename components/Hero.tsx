export default function Hero() {
  return (
    <section id="home" className="pt-24 md:pt-32 pb-16 section-padding">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Nupur's Messy Kitchen
            </h1>
            <p className="text-xl md:text-2xl text-gray-700">
              by Divya 'Nupur' Tiwari
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Premium vegetarian cakes and baked goods, crafted with love in Bhopal.
            </p>
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 rounded-lg shadow-lg">
              <p className="text-2xl md:text-3xl font-bold mb-2">
                You Imagine, We Deliver
              </p>
              <p className="text-lg">
                Custom cakes for every occasion
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-full transition-colors text-center shadow-lg"
              >
                Order Now
              </a>
              <a
                href="#products"
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-bold py-4 px-8 rounded-full transition-colors text-center"
              >
                View Products
              </a>
            </div>
          </div>

          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
              <div className="text-center p-8">
                <svg
                  className="w-32 h-32 mx-auto mb-4 text-primary-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                  <path d="M10 5a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V6a1 1 0 011-1z" />
                </svg>
                <p className="text-gray-700 font-medium">
                  Beautiful cake images coming soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
