'use client';

export default function Contact() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919470241300', '_blank');
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+919470241300';
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to order your perfect cake? Contact us today!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-700">9470241300</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-600 text-white p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Service Area</h4>
                    <p className="text-gray-700">Bhopal & Surrounding Areas</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-600 text-white p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Business Hours</h4>
                    <p className="text-gray-700">By Appointment</p>
                    <p className="text-sm text-gray-600">(Order 1 day in advance)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Order?</h3>
              <p className="mb-6">
                Contact Divya 'Nupur' Tiwari to discuss your custom cake design and place your order today!
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-white text-primary-600 font-bold py-4 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Us
                </button>
                <button
                  onClick={handleCallClick}
                  className="w-full bg-white text-primary-600 font-bold py-4 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Call Now: 9470241300
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Order</h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary-600 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Contact Us</h4>
                  <p className="text-gray-700">Call or WhatsApp us at 9470241300 to discuss your requirements</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-600 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Share Your Vision</h4>
                  <p className="text-gray-700">Tell us about your theme, flavor preferences, size, and design ideas</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-600 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Get a Quote</h4>
                  <p className="text-gray-700">We'll provide pricing based on your customization requirements</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-600 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Confirm Your Order</h4>
                  <p className="text-gray-700">Place your order at least 1 day in advance</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-600 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Delivery or Pickup</h4>
                  <p className="text-gray-700">Choose home delivery (charges apply) or pickup from our location</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white rounded-lg border-2 border-primary-200">
              <p className="text-center text-gray-700">
                <strong>💡 Pro Tip:</strong> Have a reference image? Share it with us for better customization!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
