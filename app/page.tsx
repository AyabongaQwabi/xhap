loimport { Button } from '@/components/ui/button';
import { MusicIcon, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function Navigation({ className = "" }: { className?: string }) {
  return (
    <nav className={`space-x-6 ${className}`}>
      <Link href="/" className="hover:text-red-500 transition-colors">Ikhaya</Link>
      <Link href="/about" className="hover:text-red-500 transition-colors">Malunga Nathi</Link>
      <Link href="/artists" className="hover:text-red-500 transition-colors">Abaculi</Link>
      <Link href="/events" className="hover:text-red-500 transition-colors">Iziganeko</Link>
      <Link href="/contact" className="hover:text-red-500 transition-colors">Qhagamshelana</Link>
    </nav>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
     

      {/* Hero Section */}
      <div 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gray-900/90" />
        <div className="relative z-10 text-center px-4 pt-16">
          <div className="flex items-center justify-center mb-6">
            <img src="/logo.png" className="w-72 h-64 object-fit"/>
          </div>
          <p className="text-xl md:text-6xl text-gray-300 mb-4 font-bold">
            iPlatform yomRepha besiXhosa
          </p>
          <p className="text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
            The ultimate platform for Xhosa Hip Hop artists to connect, share, and elevate the culture
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/register">Qala Apha</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href="/login">Ngena</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Phakamisa iXhap
          </h2>
          <p className="text-gray-400 text-center mb-12">Elevate Xhosa Hip Hop Culture</p>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Layisha Umculo Wakho"
              subtitle="Upload Your Music"
              description="Share your tracks with the Xhap community and get authentic feedback"
              image="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80"
            />
            <FeatureCard 
              title="Dibanisa"
              subtitle="Connect & Collaborate"
              description="Network with fellow Xhap artists and create powerful collaborations"
              image="https://images.unsplash.com/photo-1525362081669-2b476bb628c3?auto=format&fit=crop&q=80"
            />
            <FeatureCard 
              title="Khulisa Udumo"
              subtitle="Grow Your Fame"
              description="Expand your reach and build your fanbase in the Xhap community"
              image="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80"
            />
          </div>
        </div>
      </div> 

      {/* Featured Artists */}
      <div className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Abaculi Abaphambili
          </h2>
          <p className="text-gray-400 text-center mb-12">Featured Artists</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <ArtistCard
              name="Dee Koala"
              image="/deekoala.jpg"
            />
            <ArtistCard
              name="K Keed"
              image="/kkeed.jpg"
            />
            <ArtistCard
              name="Flash Ikumkani"
              image="/flash.jpg"
            />
            <ArtistCard
              name="Driemanskap"
              image="/driemanskap.jpg"
            />
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="py-20 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Iziganeko Ezizayo
          </h2>
          <p className="text-gray-400 text-center mb-12">Upcoming Events</p>
          <div className="grid md:grid-cols-2 gap-8">
            <EventCard
              title="Xhap Festival 2025"
              date="June 16, 2025"
              location="eKapa (Cape Town)"
              image="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80"
            />
            <EventCard
              title="Rap Battle Championship"
              date="July 1, 2025"
              location="eMonti (East London)"
              image="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80"
            />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      {/* <div className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Amazwi Abaculi Bethu
          </h2>
          <p className="text-gray-400 text-center mb-12">What Our Artists Say</p>
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="XHAP indincedile ukuba ndifikelele kubaphulaphuli abaninzi. Enkosi!"
              translation="XHAP helped me reach a wider audience. Thank you!"
              author="Lizo M"
            />
            <TestimonialCard
              quote="Le platform iyindawo entle yokudibanisa abaculi basekhaya."
              translation="This platform is a great place to connect local artists."
              author="Zintle K"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}

function FeatureCard({ title, subtitle, description, image }: { 
  title: string; 
  subtitle: string;
  description: string; 
  image: string; 
}) {
  return (
    <div className="rounded-lg overflow-hidden bg-zinc-800 hover:bg-bg-zinc-800 transition-colors">
      <div 
        className="h-48 w-full"
        style={{
          backgroundImage: `url("${image}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
        <p className="text-red-500 text-sm mb-2">{subtitle}</p>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function ArtistCard({ name, image }: { name: string; image: string }) {
  return (
    <div className="group relative aspect-square rounded-lg overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
        <p className="text-white font-semibold">{name}</p>
      </div>
    </div>
  );
}

function EventCard({ title, date, location, image }: {
  title: string;
  date: string;
  location: string;
  image: string;
}) {
  return (
    <div className="rounded-lg overflow-hidden bg-zinc-800 flex flex-col md:flex-row">
      <div 
        className="h-48 md:h-auto md:w-48 flex-shrink-0"
        style={{
          backgroundImage: `url("${image}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-red-500 text-sm mb-1">{date}</p>
        <p className="text-gray-400">{location}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, translation, author }: {
  quote: string;
  translation: string;
  author: string;
}) {
  return (
    <div className="bg-zinc-800 rounded-lg p-6">
      <p className="text-gray-300 italic mb-2">{quote}</p>
      <p className="text-gray-500 italic text-sm mb-4">{translation}</p>
      <p className="text-red-500 font-semibold">{author}</p>
    </div>
  );
}
