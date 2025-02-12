'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUploader } from '@/components/ImageUploader';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Plus, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type React from 'react'; // Added import for React

export default function EventsManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    venue: '',
    town_id: '',
    date: new Date(),
    budget: '',
    ticket_price: '',
    max_attendees: '',
    cover_image: '',
  });
  const [venues, setVenues] = useState([]);
  const [towns, setTowns] = useState([]);
  const [newVenue, setNewVenue] = useState('');
  const [newTown, setNewTown] = useState({ name: '', province: '' });
  const [searchVenue, setSearchVenue] = useState('');
  const [searchTown, setSearchTown] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
    fetchVenues();
    fetchTowns();
  }, []);

  async function fetchEvents() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('events')
      .select('*, south_african_towns(name)')
      .eq('organizer_id', user.id)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  }

  async function fetchVenues() {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching venues:', error);
    } else {
      setVenues(data || []);
    }
  }

  async function fetchTowns() {
    const { data, error } = await supabase
      .from('south_african_towns')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching towns:', error);
    } else {
      setTowns(data || []);
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          ...newEvent,
          organizer_id: user.id,
        },
      ])
      .select();

    if (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    } else {
      setEvents([...events, data[0]]);
      setNewEvent({
        name: '',
        description: '',
        venue: '',
        town_id: '',
        date: new Date(),
        budget: '',
        ticket_price: '',
        max_attendees: '',
        cover_image: '',
      });
      toast({
        title: 'Success',
        description: 'Event created successfully!',
      });
    }
  }

  async function handleAddVenue() {
    if (!newVenue.trim()) return;

    const { data, error } = await supabase
      .from('venues')
      .insert([{ name: newVenue }])
      .select();

    if (error) {
      console.error('Error adding venue:', error);
      toast({
        title: 'Error',
        description: 'Failed to add venue. Please try again.',
        variant: 'destructive',
      });
    } else {
      setVenues([...venues, data[0]]);
      setNewVenue('');
      toast({
        title: 'Success',
        description: 'Venue added successfully!',
      });
    }
  }

  async function handleAddTown() {
    if (!newTown.name.trim() || !newTown.province.trim()) return;

    const { data, error } = await supabase
      .from('south_african_towns')
      .insert([newTown])
      .select();

    if (error) {
      console.error('Error adding town:', error);
      toast({
        title: 'Error',
        description: 'Failed to add town. Please try again.',
        variant: 'destructive',
      });
    } else {
      setTowns([...towns, data[0]]);
      setNewTown({ name: '', province: '' });
      toast({
        title: 'Success',
        description: 'Town added successfully!',
      });
    }
  }

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchVenue.toLowerCase())
  );

  const filteredTowns = towns.filter((town) =>
    town.name.toLowerCase().includes(searchTown.toLowerCase())
  );

  if (loading) {
    return <div className='p-4'>Loading events...</div>;
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Events Management</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button className='mb-4'>
            <Plus className='mr-2 h-4 w-4' /> Create New Event
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateEvent} className='space-y-4'>
            <Input
              placeholder='Event Name'
              value={newEvent.name}
              onChange={(e) =>
                setNewEvent({ ...newEvent, name: e.target.value })
              }
              required
            />
            <Textarea
              placeholder='Description'
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              required
            />
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Venue</label>
              <div className='flex space-x-2'>
                <Select
                  value={newEvent.venue}
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, venue: value })
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select Venue' />
                  </SelectTrigger>
                  <SelectContent>
                    <div className='flex items-center px-2 pb-2'>
                      <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
                      <Input
                        placeholder='Search venue...'
                        value={searchVenue}
                        onChange={(e) => setSearchVenue(e.target.value)}
                        className='h-8 w-full'
                      />
                    </div>
                    {filteredVenues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id.toString()}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type='button'>Add New Venue</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Venue</DialogTitle>
                    </DialogHeader>
                    <Input
                      placeholder='Venue Name'
                      value={newVenue}
                      onChange={(e) => setNewVenue(e.target.value)}
                    />
                    <Button onClick={handleAddVenue}>Add Venue</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Town</label>
              <div className='flex space-x-2'>
                <Select
                  value={newEvent.town_id}
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, town_id: value })
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select Town' />
                  </SelectTrigger>
                  <SelectContent>
                    <div className='flex items-center px-2 pb-2'>
                      <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
                      <Input
                        placeholder='Search town...'
                        value={searchTown}
                        onChange={(e) => setSearchTown(e.target.value)}
                        className='h-8 w-full'
                      />
                    </div>
                    {filteredTowns.map((town) => (
                      <SelectItem key={town.id} value={town.id.toString()}>
                        {town.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type='button'>Add New Town</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Town</DialogTitle>
                    </DialogHeader>
                    <Input
                      placeholder='Town Name'
                      value={newTown.name}
                      onChange={(e) =>
                        setNewTown({ ...newTown, name: e.target.value })
                      }
                    />
                    <Select
                      value={newTown.province}
                      onValueChange={(value) =>
                        setNewTown({ ...newTown, province: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select Province' />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          'Eastern Cape',
                          'Free State',
                          'Gauteng',
                          'KwaZulu-Natal',
                          'Limpopo',
                          'Mpumalanga',
                          'Northern Cape',
                          'North West',
                          'Western Cape',
                        ].map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddTown}>Add Town</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <Calendar
              mode='single'
              selected={newEvent.date}
              onSelect={(date) => date && setNewEvent({ ...newEvent, date })}
              className='rounded-md border'
            />
            <Input
              type='number'
              placeholder='Budget'
              value={newEvent.budget}
              onChange={(e) =>
                setNewEvent({ ...newEvent, budget: e.target.value })
              }
              required
            />
            <Input
              type='number'
              placeholder='Ticket Price'
              value={newEvent.ticket_price}
              onChange={(e) =>
                setNewEvent({ ...newEvent, ticket_price: e.target.value })
              }
              required
            />
            <Input
              type='number'
              placeholder='Maximum Attendees'
              value={newEvent.max_attendees}
              onChange={(e) =>
                setNewEvent({ ...newEvent, max_attendees: e.target.value })
              }
              required
            />
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Cover Image</label>
              <ImageUploader
                onUploadComplete={(urls) =>
                  setNewEvent({ ...newEvent, cover_image: urls[0] })
                }
                maxSizeInMB={5}
              />
            </div>
            <Button type='submit'>Create Event</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Town</TableHead>
            <TableHead>Ticket Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{format(new Date(event.date), 'PPP')}</TableCell>
              <TableCell>{event.venue}</TableCell>
              <TableCell>{event.south_african_towns?.name}</TableCell>
              <TableCell>
                {event.ticket_price ? `$${event.ticket_price}` : 'Free'}
              </TableCell>
              <TableCell>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => router.push(`/dashboard/events/${event.id}`)}
                >
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
