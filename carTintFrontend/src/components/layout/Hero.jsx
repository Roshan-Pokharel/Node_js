import { ArrowRight } from "lucide-react";

export default function Hero() {
  const scrollToCalculator = () => {
    const element = document.getElementById("calculator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className= "overflow-hidden pt-24 pb-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transform Your Vehicle with Premium Car Wrapping
          </h1>

          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional car wrapping services that protect your paint,
            enhance your style, and make your vehicle stand out from the crowd.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToCalculator}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg
                         hover:bg-blue-700 transition flex items-center gap-2"
            >
              Calculate Cost
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={scrollToAbout}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg
                         hover:bg-gray-50 transition border-2 border-blue-600"
            >
              Learn More
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
