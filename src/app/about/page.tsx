export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
      {/* Main content */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">About</h1>
        <p className="text-lg mb-8">
          Welcome to <strong>NextBlog</strong>! This blog is a space where I share insights on web development and also document my favorite travel destinations across India. Whether you're a developer, traveler, or both — I hope you find something useful or inspiring here.
        </p>

        {/* New Section: Visiting Places */}
        <section>
          <h2 className="text-2xl font-semibold mb-4"> Places to Visit</h2>
          <ul className="list-disc list-inside space-y-3 text-lg">
            <li>
              <strong>Mount Abu (Rajasthan)</strong> – A peaceful hill station known for the Dilwara Temples, Nakki Lake, and cool weather.
            </li>
            <li>
              <strong>Udaipur (Rajasthan)</strong> – Called the "City of Lakes", famous for palaces, markets, and beautiful sunsets.
            </li>
            <li>
              <strong>Goa</strong> – A vibrant coastal state with beautiful beaches, Portuguese architecture, and nightlife.
            </li>
            <li>
              <strong>Rishikesh (Uttarakhand)</strong> – A spiritual and yoga hub by the Ganges River, perfect for meditation and rafting.
            </li>
            <li>
              <strong>Leh-Ladakh (Jammu & Kashmir)</strong> – A dream destination for bikers and trekkers with lakes, monasteries, and mountains.
            </li>
            <li>
              <strong>Manali (Himachal Pradesh)</strong> – A scenic town known for snow adventures, Solang Valley, and Hadimba Temple.
            </li>
            <li>
              <strong>Munnar (Kerala)</strong> – Rolling hills with tea gardens, waterfalls, and a refreshing cool climate.
            </li>
            <li>
              <strong>Coorg (Karnataka)</strong> – Also known as the "Scotland of India", famous for coffee estates and forest treks.
            </li>
            <li>
              <strong>Varanasi (Uttar Pradesh)</strong> – One of the oldest cities in the world, known for spiritual ghats and Ganga aarti.
            </li>
            <li>
              <strong>Jaipur (Rajasthan)</strong> – The Pink City, filled with historic forts, traditional culture, and vibrant markets.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
