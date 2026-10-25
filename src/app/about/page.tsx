import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About CastleElevator - Our Story & Mission",
  description:
    "Learn about CastleElevator, lift installation, AMC and repair team serving Delhi, Gurugram and Noida.",
}

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">About CastleElevator</h1>
          <p className="text-xl opacity-90">
            Trusted partner in vertical transportation for over a decade
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Our Story
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Castle Elevator was founded with a simple mission: to provide
                safe, reliable and modern lifts for homes and buildings in
                Delhi, Gurugram and Noida.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our team of 20–30 engineers, technicians and coordinators
                surveys each site, installs partner equipment, and maintains
                lifts through AMC and repair contracts.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Every project starts with a free survey and a written quotation,
                so you know exactly what you are getting before work begins.
              </p>
            </div>
            {/* 🖼️ UPDATED: Now using actual image instead of gradient */}
            <div className="h-96 rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/about/about-company.png"
                alt="CastleElevator Company"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "20–30", label: "Team members" },
              { number: "9", label: "Lift types supplied" },
              { number: "3", label: "Cities: Delhi, Gurugram, Noida" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center"
              >
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600 dark:text-gray-400 font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Safety First",
                desc: "We adhere to the highest safety standards and regulations in all our projects.",
              },
              {
                title: "Quality Service",
                desc: "Every installation and maintenance job is done with utmost precision and care.",
              },
              {
                title: "Customer Focus",
                desc: "Your satisfaction and peace of mind are our top priorities.",
              },
            ].map((value, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
