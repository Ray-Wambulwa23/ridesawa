import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  // Track which trip type is selected
  const [tripType, setTripType] = useState('oneway')

  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
  })

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Pass search params as URL query strings to the results page
    const params = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      passengers: searchData.passengers,
      tripType,
    })
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">

      {/* ── Hero Section ── */}
      <div
        className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(6,27,98,0.75) 30%, rgba(22,139,255,0.25) 100%), url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600)',
        }}
      >
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16">

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
              Your Next Journey <br />
              <span className="text-[#168BFF]">Starts Here</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-md">
              Book bus tickets easily, safely and comfortably. Multiple companies,
              more routes, better journeys.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">

            {/* One Way / Round Trip toggle */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setTripType('oneway')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  tripType === 'oneway'
                    ? 'bg-gradient-to-r from-[#061B62] to-[#168BFF] text-white shadow'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                One Way
              </button>
              <button
                onClick={() => setTripType('return')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  tripType === 'return'
                    ? 'bg-gradient-to-r from-[#061B62] to-[#168BFF] text-white shadow'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                Round Trip
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">

                {/* From */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-medium">From</label>
                  <input
                    type="text"
                    name="from"
                    placeholder="e.g. Nairobi"
                    value={searchData.from}
                    onChange={handleChange}
                    required
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* To */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-medium">To</label>
                  <input
                    type="text"
                    name="to"
                    placeholder="e.g. Mombasa"
                    value={searchData.to}
                    onChange={handleChange}
                    required
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                {/* Date */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-medium">Departure Date</label>
                  <input
                    type="date"
                    name="date"
                    value={searchData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* Passengers */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-medium">Passengers</label>
                  <input
                    type="number"
                    name="passengers"
                    value={searchData.passengers}
                    onChange={handleChange}
                    min={1}
                    max={10}
                    required
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>

              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#061B62] via-[#1248C8] to-[#168BFF]
                           text-white font-semibold py-3.5 rounded-xl
                           hover:brightness-110 hover:-translate-y-0.5
                           transition-all duration-300 shadow-lg shadow-blue-900/30
                           flex items-center justify-center gap-2"
              >
                {/* Search icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                Search Buses
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Features Strip ── */}
      <div className="bg-white py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">

          {[
            { icon: '🏢', title: 'Multiple Companies', desc: 'Choose from top bus operators' },
            { icon: '🔒', title: 'Safe & Secure', desc: 'Verified operators and bookings' },
            { icon: '🕐', title: '24/7 Support', desc: 'We are always here for you' },
            { icon: '💰', title: 'Best Prices', desc: 'Guaranteed lowest fares' },
          ].map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center gap-2 p-4">
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
              <p className="text-gray-500 text-xs">{feature.desc}</p>
            </div>
          ))}

        </div>
      </div>

    </div>
  )
}

export default Home
