

export default function Quote() {

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Get a Free Quote</h2>
          <p className="mt-4 text-lg text-gray-600">Fill out the form below to receive a personalized quote for our services.</p>
        </div>
        <form className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="enter email" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" id="phone" name="phone" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="(123) 456-7890" />
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service Interested In</label>
              <select id="service" name="service" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option>Car Wrapping</option>
                <option>Window Tinting</option>
                <option>Paint Protection Film</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700">Additional Details</label>
              <textarea id="details" name="details" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Provide any additional information here..."></textarea>
            </div>
            <div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </section>    
  );
}
