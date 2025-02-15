'use client';

import { useState, useRef, useEffect } from 'react';
import {
  FaPlay,
  FaPause,
  FaYoutube,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaEnvelope,
  FaLink,
  FaHeart,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { isNil, isEmpty } from 'ramda';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function getYouTubeVideoId(url: string) {
  const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^?&]+)/;
  const match = url.match(regex);
  return match && match[1] ? match[1] : null;
}

const exists = (i) => !isEmpty(i) && !isNil(i);

const SocialFollowButtons = ({ artist }) => {
  return (
    <div className='flex-col space-y-2 mt-4'>
      {artist.twitter_url && (
        <Button
          variant='outline'
          size='sm'
          onClick={() => window.open(artist.twitter_url, '_blank')}
        >
          <FaTwitter className='w-4 h-4 mr-2' />
          Follow on Twitter
        </Button>
      )}
      {artist.instagram_url && (
        <Button
          variant='outline'
          size='sm'
          onClick={() => window.open(artist.instagram_url, '_blank')}
        >
          <FaInstagram className='w-4 h-4 mr-2' />
          Follow on Instagram
        </Button>
      )}
      {artist.facebook_url && (
        <Button
          variant='outline'
          size='sm'
          onClick={() => window.open(artist.facebook_url, '_blank')}
        >
          <FaFacebook className='w-4 h-4 mr-2' />
          Follow on Facebook
        </Button>
      )}
      {artist.whatsapp_number && (
        <Button
          variant='outline'
          size='sm'
          onClick={() =>
            window.open(`https://wa.me/${artist.whatsapp_number}`, '_blank')
          }
        >
          <FaWhatsapp className='w-4 h-4 mr-2' />
          WhatsApp
        </Button>
      )}
    </div>
  );
};

interface Song {
  title: string;
  url: string;
  releaseDate: string;
}

interface ArtistCardProps {
  artist_name: string;
  username: string;
  profile_image_url: string;
  artist_bio: string;
  youtube_links: string[];
  gallery_images: string[];
  demo_songs: Song[];
  instagram_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  whatsapp_number?: string;
  likes_count: number;
  user_id?: string;
  onLike?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  artist_name,
  username,
  profile_image_url,
  gallery_images,
  artist_bio,
  youtube_links,
  demo_songs,
  instagram_url,
  facebook_url,
  twitter_url,
  whatsapp_number,
  likes_count,
  user_id,
  onLike,
}) => {
  const songs = demo_songs?.map((i) => JSON.parse(i));
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (user_id) {
      checkIfLiked();
    }
  }, [user_id]);

  async function checkIfLiked() {
    const { data } = await supabase
      .from('artist_likes')
      .select('*')
      .eq('user_id', user_id)
      .eq('artist_id', username)
      .single();

    setIsLiked(!!data);
  }

  async function handleLike() {
    if (!user_id) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to like artists',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('artist_likes')
          .delete()
          .eq('user_id', user_id)
          .eq('artist_id', username);
      } else {
        await supabase
          .from('artist_likes')
          .insert([{ user_id, artist_id: username }]);
      }

      setIsLiked(!isLiked);
      if (onLike) onLike();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to like artist. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src =
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167';
  };

  const togglePlay = async (songUrl: string) => {
    if (currentlyPlaying === songUrl) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      try {
        if (audioRef.current) {
          audioRef.current.src = songUrl;
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setCurrentlyPlaying(songUrl);
          }
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        toast({
          title: 'Error',
          description:
            'Unable to play this audio file. Please try again or check the file.',
          variant: 'destructive',
        });
      }
    }
  };

  useEffect(() => {
    const handleEnded = () => {
      setCurrentlyPlaying(null);
    };

    const audioElement = audioRef.current;
    audioElement?.addEventListener('ended', handleEnded);

    return () => {
      audioElement?.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleCanPlayThrough = () => {
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
          toast({
            title: 'Error',
            description:
              'Unable to play this audio file. Please try again or check the file.',
            variant: 'destructive',
          });
        });
      };

      audio.addEventListener('canplaythrough', handleCanPlayThrough);

      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      };
    }
  }, [audioRef]);

  const handleShare = (platform: string) => {
    const url = `https://espazza.co.za/artist/${username}`;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `Check out ${artist_name} on eSpazza: ${url}`
        )}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Check out ${artist_name} on eSpazza&body=I thought you might be interested in this artist: ${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          toast({
            title: 'Link Copied',
            description: "The artist's link has been copied to your clipboard.",
          });
        });
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }

    setIsShareModalOpen(false);
  };
  console.log('likes_count', likes_count);
  return (
    <div className='max-w-4xl mx-auto p-8 bg-gradient-to-br from-zinc-900 to-black rounded-xl shadow-2xl'>
      <div className='grid md:grid-cols-3 gap-8'>
        <div className='md:col-span-1'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            className='relative overflow-hidden rounded-lg shadow-lg'
          >
            <Image
              src={
                exists(profile_image_url)
                  ? profile_image_url
                  : exists(gallery_images) && exists(gallery_images[0])
                  ? gallery_images[0]
                  : '/placeholder.svg'
              }
              alt={artist_name}
              onError={handleImageError}
              className='w-full h-64 object-cover'
              width={300}
              height={300}
            />
          </motion.div>
          <h2 className='text-3xl font-bold text-white mt-4 mb-2'>
            {artist_name}
          </h2>
          <p className='text-zinc-300 text-lg'>@{username}</p>

          <div className='flex items-center mt-4 space-x-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleLike}
              className={isLiked ? 'text-red-500' : ''}
            >
              <FaHeart className='mr-2' />
              {likes_count.length} {likes_count === 1 ? 'Like' : 'Likes'}
            </Button>
          </div>

          <SocialFollowButtons
            artist={{
              instagram_url,
              facebook_url,
              twitter_url,
              whatsapp_number,
            }}
          />
          <div className='flex space-x-2 mt-4'>
            <Link href={`/artists/${username}`} passHref>
              <Button variant='outline'>More</Button>
            </Link>
            <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
              <DialogTrigger asChild>
                <Button variant='outline'>Share</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share {artist_name}</DialogTitle>
                </DialogHeader>

                <div className='flex justify-around mt-4'>
                  <Button
                    onClick={() => handleShare('facebook')}
                    className='bg-blue-600 hover:bg-blue-700'
                  >
                    <FaFacebook className='mr-2' /> Facebook
                  </Button>
                  <Button
                    onClick={() => handleShare('whatsapp')}
                    className='bg-green-600 hover:bg-green-700'
                  >
                    <FaWhatsapp className='mr-2' /> WhatsApp
                  </Button>
                  <Button
                    onClick={() => handleShare('email')}
                    className='bg-zinc-600 hover:bg-zinc-700'
                  >
                    <FaEnvelope className='mr-2' /> Email
                  </Button>
                  <Button
                    onClick={() => handleShare('copy')}
                    className='bg-zinc-600 hover:bg-zinc-700'
                  >
                    <FaLink className='mr-2' /> Copy Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className='md:col-span-2 space-y-6'>
          <div>
            <p className='text-zinc-300 leading-relaxed'>
              {isExpanded ? artist_bio : `${artist_bio?.slice(0, 150)}...`}
            </p>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-white mb-3'>
              Latest Videos
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              {youtube_links?.slice(0, 4).map((video, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className='relative cursor-pointer group'
                  onClick={() => {
                    setSelectedVideo(getYouTubeVideoId(video));
                    setIsModalOpen(true);
                  }}
                >
                  <Image
                    src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                      video
                    )}/0.jpg`}
                    alt='Video thumbnail'
                    className='w-full h-32 object-cover rounded-lg'
                    width={300}
                    height={150}
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-zinc-900 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg'>
                    <FaYoutube className='text-4xl text-red-500' />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className='text-xl font-semibold text-white mb-3'>
              Demo Songs
            </h3>
            <div className='space-y-3'>
              {songs?.map((song) => (
                <motion.div
                  key={song.url}
                  whileHover={{ scale: 1.02 }}
                  className='flex items-center justify-between p-3 bg-zinc-800 rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <button
                      onClick={() => togglePlay(song.url)}
                      className='p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors'
                      aria-label={
                        currentlyPlaying === song.url ? 'Pause' : 'Play'
                      }
                    >
                      {currentlyPlaying === song.url ? <FaPause /> : <FaPlay />}
                    </button>
                    <div>
                      <p className='font-medium text-white'>{song.title}</p>
                      <p className='text-sm text-zinc-400'>
                        Released: {song.releaseDate}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-zinc-900 bg-opacity-75 flex items-center justify-center z-50'>
          <div className='bg-zinc-900 p-4 rounded-lg w-full max-w-3xl'>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}`}
              className='w-full aspect-video rounded-lg'
              allowFullScreen
              title='YouTube Video Player'
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className='mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
            >
              Close
            </button>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        onError={(e) => {
          console.error('Audio error:', e);
          toast({
            title: 'Error',
            description:
              'There was an error with the audio file. Please try again.',
            variant: 'destructive',
          });
        }}
      />
    </div>
  );
};

export default ArtistCard;
