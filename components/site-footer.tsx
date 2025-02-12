import { MusicIcon } from 'lucide-react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className='bg-zinc-900'>
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <div className='flex items-center space-x-2 mb-4'>
              <MusicIcon className='h-6 w-6 text-red-600' />
              <span className='text-2xl font-bold text-white'>
                X<span className='text-red-600'>HAP</span>
              </span>
            </div>
            <p className='text-zinc-400'>The home of Xhosa Hip Hop</p>
          </div>

          <div>
            <h3 className='text-white font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/about' className='text-zinc-400 hover:text-white'>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/artists'
                  className='text-zinc-400 hover:text-white'
                >
                  Artists
                </Link>
              </li>
              <li>
                <Link href='/events' className='text-zinc-400 hover:text-white'>
                  Events
                </Link>
              </li>
              <li>
                <Link href='/blog' className='text-zinc-400 hover:text-white'>
                  iiPosts
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='text-zinc-400 hover:text-white'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='/terms' className='text-zinc-400 hover:text-white'>
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-white font-semibold mb-4'>Contact</h3>
            <ul className='space-y-2 text-zinc-400'>
              <li>info@espazza.co.za</li>
              <li>0603116777</li>
              <li>Cape Town, South Africa</li>
            </ul>
          </div>

          <div>
            <h3 className='text-white font-semibold mb-4'>Follow Us</h3>
            <div className='flex space-x-4'>
              <a href='#' className='text-zinc-400 hover:text-white'>
                Twitter
              </a>
              <a href='#' className='text-zinc-400 hover:text-white'>
                Instagram
              </a>
              <a href='#' className='text-zinc-400 hover:text-white'>
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className='border-t border-zinc-800 mt-12 pt-8 text-center text-zinc-400'>
          <p>&copy; {new Date().getFullYear()} eSpazza. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
