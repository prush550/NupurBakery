export default function Products() {
  const products = [
    {
      category: "Birthday Cakes",
      items: ["Classic Birthday Cakes", "Number Cakes", "Photo Cakes", "Multi-Tier Celebration Cakes"],
      priceRange: "₹1,000 - ₹3,000+"
    },
    {
      category: "Themed Cakes",
      items: ["Minecraft Cakes", "Car Cakes", "Doll & Dress Cakes", "Teddy Bear Cakes", "Custom Character Cakes"],
      priceRange: "₹1,500 - ₹3,500+"
    },
    {
      category: "Specialty Cakes",
      items: ["Chocolate Cakes", "Rose Cakes", "Fruit Cakes", "Designer Cakes", "Anniversary Cakes"],
      priceRange: "₹1,000 - ₹3,000+"
    },
    {
      category: "Baked Goods",
      items: ["Muffins with Frosting", "Cupcakes", "Filled Muffins", "Custom Pastries"],
      priceRange: "₹200 - ₹500"
    }
  ];

  const popularFlavors = [
    "Chocolate",
    "Vanilla",
    "Butterscotch",
    "Red Velvet",
    "Black Forest",
    "Pineapple",
    "Strawberry",
    "Mango",
    "Coffee",
    "Custom Flavors"
  ];

  return (
    <section id="products" className="section-padding bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            From classic favorites to elaborate themed creations - we have something for every celebration
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow border-2 border-primary-100"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{product.category}</h3>
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.priceRange}
                </span>
              </div>
              <ul className="space-y-2">
                {product.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start text-gray-700">
                    <svg
                      className="w-5 h-5 mr-2 mt-0.5 text-primary-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-secondary-100 to-primary-100 p-8 md:p-12 rounded-2xl shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Popular Flavors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popularFlavors.map((flavor, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <span className="text-gray-800 font-medium">{flavor}</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-gray-700 text-lg">
            ✨ Don't see what you're looking for? <strong>We customize!</strong> ✨
          </p>
        </div>

        <div className="mt-12 bg-white p-8 rounded-xl shadow-lg border-l-4 border-primary-600">
          <h4 className="text-xl font-bold text-gray-900 mb-4">Ordering Information</h4>
          <div className="space-y-2 text-gray-700">
            <p><strong>📦 Minimum Order:</strong> ₹1,000 (1 kg base price)</p>
            <p><strong>🎨 Customization:</strong> Pricing varies based on design complexity, flavor, and personalization</p>
            <p><strong>⏰ Lead Time:</strong> Please order at least 1 day in advance</p>
            <p><strong>🚗 Delivery:</strong> Available within Bhopal (charges apply based on distance and timing)</p>
            <p><strong>📸 Portfolio:</strong> We have created 30+ unique designs - contact us to see our full portfolio!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
