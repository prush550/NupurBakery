export default function About() {
  const features = [
    {
      icon: "🌱",
      title: "100% Vegetarian",
      description: "All our products are completely vegetarian and prepared in a hygienic environment"
    },
    {
      icon: "🎨",
      title: "Custom Designs",
      description: "From themed cakes to personalized designs - we bring your imagination to life"
    },
    {
      icon: "💉",
      title: "Safe & Hygienic",
      description: "Our staff is fully vaccinated and follows strict hygiene protocols"
    },
    {
      icon: "🚗",
      title: "Home Delivery",
      description: "We deliver within Bhopal - delivery charges based on distance and timing"
    },
    {
      icon: "⏰",
      title: "Quick Service",
      description: "Order with just one day advance notice"
    },
    {
      icon: "💰",
      title: "Affordable Pricing",
      description: "Starting from ₹1,000 per kilogram with customizable options"
    }
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About Nupur's Messy Kitchen
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            A home-based vegetarian bakery serving Bhopal with love, creativity, and delicious custom cakes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-8 md:p-12 rounded-2xl shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Why Choose Us?
              </h3>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Fully vegetarian and hygienic preparation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Custom designs based on your theme and preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Vaccinated staff following safety protocols</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Wide range from simple cakes to elaborate themed creations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Delivery available across Bhopal</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-3">Pricing Information</h4>
              <div className="space-y-2 text-white/90">
                <p><strong>Starting Price:</strong> ₹1,000 per kg</p>
                <p><strong>Customization:</strong> Price varies by flavor, design & personalization</p>
                <p><strong>Advance Order:</strong> Minimum 1 day notice required</p>
                <p><strong>Delivery:</strong> Charges apply based on timing and distance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
