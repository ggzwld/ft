import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Star,
  Phone,
  Mail,
  TrendingUp,
  Award,
  Filter,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Send,
  Calendar,
  DollarSign,
  CheckCircle,
  MapPin,
  Users,
  Package,
  AlertCircle,
  X,
  Clock,
  Loader,
  Share2,
  Edit,
  Image as ImageIcon,
} from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import EditEventModal from './EditEventModal';
import MyEventCard from './MyEventCard';
import { useAuth } from '../context/AuthContext';
import { usePreloadedData } from '../context/DataPreloadContext';
import {
  createEvent,
  getUserEvents,
  publishEvent,
  bookEventServices,
  getEventServiceBookings,
  cancelServiceBooking,
  hideEventFromMyEvents,
  hideEventFromJoinTab,
  restoreEventToMyEvents,
  updateEvent,
  uploadEventImage,
  updateEventImage,
} from '../lib/eventServices';
import type { ServiceProvider, CreateEventFormData, Event, EventServiceBooking } from '../types/events';

const providerTimestamp = new Date().toISOString();

const serviceProviders: ServiceProvider[] = [
  {
    id: 'ug-venue-speke-resort',
    name: 'Speke Resort Munyonyo',
    category: 'venue',
    description: 'Lake Victoria resort and conference venue for conferences, weddings, banquets, exhibitions, and outdoor events.',
    highlights: 'Rwenzori Hall accommodates up to 3,200 theatre-style guests; 43 meeting rooms, 6 outdoor venues, lakeside settings, and event catering.',
    base_price: null,
    rating: 4.5,
    reviews_count: 6959,
    contact_email: 'info@srcc-ug.com',
    contact_phone: '+256 414 227 111',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-venue-canary-gardens',
    name: 'Canary Gardens',
    category: 'venue',
    description: 'Outdoor Kampala venue for weddings, corporate events, graduations, and intimate or large celebrations.',
    highlights: 'Bronze package for 0–300 guests; backup generator, changing rooms, parking for up to 200 vehicles, security, and no outside-catering corkage.',
    base_price: 5500000,
    rating: 4.4,
    reviews_count: 234,
    contact_email: 'reservations@canarygardens.com',
    contact_phone: '+256 760 647 691',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-venue-mestil',
    name: 'Mestil Hotel & Residences',
    category: 'venue',
    description: 'Nsambya hotel venue for seminars, workshops, business cocktails, conferences, and corporate gatherings.',
    highlights: 'Gardens for up to 800 guests, Bunyonyi for up to 350, audio/video conferencing, air-conditioned rooms, and high-speed internet.',
    base_price: null,
    rating: 4.5,
    reviews_count: 3602,
    contact_email: 'reservations@mestilhotels.com',
    contact_phone: '+256 313 243 000',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-venue-imperial-royale',
    name: 'Imperial Royale Hotel',
    category: 'venue',
    description: 'Central Kampala hotel venue for conferences, conventions, weddings, banquets, and large business events.',
    highlights: '21 conference rooms and banqueting halls, with published hall capacities ranging from intimate rooms to 2,000 guests.',
    base_price: null,
    rating: 4.1,
    reviews_count: 2539,
    contact_email: 'imperialhotels@hoteleq.com',
    contact_phone: '+256 417 111 000',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-catering-evangiz',
    name: 'Evangiz Restaurant',
    category: 'catering',
    description: 'Outside catering for corporate gatherings, office lunches, workshops, team events, birthdays, and private celebrations.',
    highlights: 'Customized menus, full-service buffets, plated service, drop-off platters, and Ugandan and international dishes.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'evangizrestaurant@gmail.com',
    contact_phone: '+256 393 104 494',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-catering-kembabazi',
    name: 'Kembabazi Catering Centre',
    category: 'catering',
    description: 'Naguru caterer providing daily buffet, delivery, outside catering, corporate catering, and private-event food service.',
    highlights: 'Traditional and international cuisine with event menus tailored to guest requirements and budget; outside catering available.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'info@kembabazicatering.ug',
    contact_phone: '+256 773 350 829',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-catering-equator',
    name: 'Equator Catering Ltd',
    category: 'catering',
    description: 'Kampala outside-catering company serving corporate events, remote locations, camps, and large gatherings.',
    highlights: 'Corporate and outside catering, camp management, warehouse/logistics support, barbecue, cocktail, dinner, hot buffet, and cold buffet menus.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'catering@eqcatering.com',
    contact_phone: '+256 757 775 775',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-catering-piato',
    name: 'Piato Restaurant',
    category: 'catering',
    description: 'Nakasero restaurant offering conference and event catering for corporate meetings, private celebrations, and social functions.',
    highlights: 'Event hall for up to 150 people, international and African cuisine, family platters, barbecue, bakery, and celebration cakes.',
    base_price: null,
    rating: 4.3,
    reviews_count: 2506,
    contact_email: 'info@piatokampala.com',
    contact_phone: '+256 756 568 945',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-decor-tembo-creations',
    name: 'Tembo Creations',
    category: 'decor',
    description: 'Kampala event-planning and styling company for weddings, corporate galas, birthdays, cultural events, and celebrations.',
    highlights: 'Event planning and management, florals, themed décor, lighting and stage design, equipment hire, sourcing, and full-service execution.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'tembokreation@gmail.com',
    contact_phone: '+256 709 770 571',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-decor-modern-charm',
    name: 'Modern Charm Uganda',
    category: 'decor',
    description: 'Uganda event-management and styling company specializing in weddings, corporate events, product launches, and celebrations.',
    highlights: 'Venue styling, floral installations, lighting design, statement backdrops, immersive environments, vendor coordination, and on-site management.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'info@moderncharmevents.com',
    contact_phone: '+256 779 399 409',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-decor-henhar',
    name: 'HenHar Services (U) Ltd',
    category: 'decor',
    description: 'Uganda event-services supplier for weddings, graduations, corporate galas, government, NGO, church, and outdoor events.',
    highlights: 'Tent hire, executive furniture, linen, décor and styling, lighting, mobile toilets, sound/PA, logistics, and technical support.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'sales@henharservices.com',
    contact_phone: '+256 772 408 330',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-decor-bento-events',
    name: 'Bento Events Ltd',
    category: 'decor',
    description: 'Kampala tent-hire supplier serving events across Uganda with delivery, rigging, setup, and pack-down.',
    highlights: 'Skyline, Multiflex Curve, A-Shape, Multiflex, and pagoda tents with sidewalls, drainage, heaters, and venue-specific transport quotes.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'bentoeventsltd@gmail.com',
    contact_phone: '+256 792 774 334',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-audio-sauti',
    name: 'Sauti Audio Crew',
    category: 'audio',
    description: 'Nsambya audio supplier for live events, productions, organized parties, and professional sound installations.',
    highlights: 'Sound-system design, installation and upgrades, professional sound reinforcement, PA equipment, and live-event production support.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'sautiaudiogroup@gmail.com',
    contact_phone: '+256 200 955 567',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-audio-audiophile',
    name: 'Audiophile Concepts',
    category: 'audio',
    description: 'Kampala event-audio and AV company serving private parties, weddings, corporate events, conferences, concerts, and livestreams.',
    highlights: 'Event sound engineering, live mixing, DJ curation, AV production, equipment hire, acoustic design, setup, teardown, and technical customization.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'info@audiophileconcepts.com',
    contact_phone: '+256 764 001 293',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-audio-the-soundz',
    name: 'The Soundz',
    category: 'audio',
    description: 'Kampala audiovisual production company for weddings, corporate events, concerts, festivals, and full event production.',
    highlights: 'Live sound, line-array systems, stage-lighting design, lasers and effects, DJ entertainment, and production for large events.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'info@thesoundz.net',
    contact_phone: '+256 774 760 668',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-audio-fenon',
    name: 'Fenon Events',
    category: 'audio',
    description: 'Kampala full-service event and audiovisual production company for conferences, concerts, launches, and corporate events.',
    highlights: 'PA systems, digital consoles, wireless microphones, staging, rigging, lighting, LED walls, live cameras, webcasting, and special effects.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'info@fenonrecords.com',
    contact_phone: '+256 414 259 067',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-photo-cog-studios',
    name: 'COG Studios Uganda',
    category: 'photography',
    description: 'Kampala production studio covering corporate and wedding photography, event videography, recaps, livestreams, and documentaries.',
    highlights: 'Photography from UGX 850,000; event videography, livestreaming, content production, and end-to-end event production.',
    base_price: 850000,
    rating: null,
    reviews_count: null,
    contact_email: 'info@cog-studios.com',
    contact_phone: '+256 200 926 110',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-photo-harmofy',
    name: 'Harmofy Company Limited',
    category: 'photography',
    description: 'Kampala visual-content company providing photography and videography for weddings, traditional ceremonies, corporate events, and marketing.',
    highlights: 'Kukyaala from UGX 1,000,000; Kwanjula/Kuhingira from UGX 3,000,000; weddings from UGX 3,500,000.',
    base_price: 1000000,
    rating: null,
    reviews_count: null,
    contact_email: 'info@harmofy.co.ug',
    contact_phone: '+256 778 601 770',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-photo-citie',
    name: 'Citie Photography',
    category: 'photography',
    description: 'Uganda photography and videography studio covering weddings, traditional introductions, graduations, proposals, portraits, and milestones.',
    highlights: 'Wedding packages from UGX 4,000,000; Kwanjula/introduction packages from UGX 3,500,000; drone wedding videography available.',
    base_price: 3500000,
    rating: null,
    reviews_count: null,
    contact_email: 'citiephotography@gmail.com',
    contact_phone: '+256 755 969 953',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-entertainment-dj-audio',
    name: 'D&J Audio',
    category: 'entertainment',
    description: 'Uganda mobile DJ and event-entertainment supplier for weddings, parties, corporate events, and public functions.',
    highlights: 'Mobile DJ and karaoke, PA systems, LED screens, stage and mood lighting, digital broadcasting, recording, and livestreaming; standard DJ setup supports about 300 guests.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'dtumwesigye@dnjgroup.ug',
    contact_phone: '+256 759 856 134',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-entertainment-ivuga',
    name: 'Ivuga Band',
    category: 'entertainment',
    description: 'Kampala seven-piece live band for weddings, corporate galas, award ceremonies, state functions, private parties, and public shows.',
    highlights: 'Afro-soul, Afrobeats, jazz, rumba, pop, and Afro-fusion with a session sound engineer and customized song arrangements.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'ivugamanager@gmail.com',
    contact_phone: '+256 785 782 117',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-entertainment-soft-syren',
    name: 'Soft Syren',
    category: 'entertainment',
    description: 'Kampala DJ for nightlife, festivals, brand activations, private events, luxury events, weddings, and celebrations.',
    highlights: 'Afro House, Afro Tech, and global club sets for private and branded experiences.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'softsyrendj@gmail.com',
    contact_phone: '+256 563 026 405',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-security-magnum',
    name: 'Magnum Security Company Ltd',
    category: 'security',
    description: 'Uganda security company providing event, festival, and venue security for attendee safety and controlled access.',
    highlights: 'Entrant screening, guest and category guidance, threat detection, VIP protection, K9 services, patrols, and quick response.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'info@magnumsecurity.co.ug',
    contact_phone: '+256 200 926 097',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-security-plus',
    name: 'Security Plus',
    category: 'security',
    description: 'Kampala event-security provider for concerts, red-carpet events, conferences, openings, and product releases.',
    highlights: 'Crowd control, close protection, end-to-end event management, licensing support, and event security audits; free quotation available.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'info@securityplus.co.ug',
    contact_phone: '+256 750 333 336',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-security-fbg',
    name: 'FBG Security Company Ltd',
    category: 'security',
    description: 'Uganda security provider for events, crowd control, VIP protection, static guarding, and tactical response.',
    highlights: 'Event security, close protection, riot and crowd control, tactical response, VIP and dignitary protection, and regional coverage.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'info@fbgsecurity.com',
    contact_phone: '+256 783 355 159',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-transport-connect-airport',
    name: 'Connect Airport Express',
    category: 'transport',
    description: 'Kampala chauffeur and airport-transfer provider for corporate transport, group events, charters, and high-profile guests.',
    highlights: 'Entebbe transfers, group-event coordination, charter hire, premium vans and minibuses, meet-and-greet, and flight monitoring.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'cs@connectairport.com',
    contact_phone: '+256 200 905 906',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-transport-luxoriax',
    name: 'Luxoriax Auto Group',
    category: 'transport',
    description: 'Kampala executive transport provider for VIP airport transfers, weddings, conferences, delegations, and corporate guests.',
    highlights: 'Chauffeur-driven wedding cars and convoys; published fleet rates from UGX 700,000 for a Land Cruiser, subject to vehicle, route, and duration.',
    base_price: 700000,
    rating: null,
    reviews_count: null,
    contact_email: 'info@luxoriaxautogroup.com',
    contact_phone: '+256 755 449 899',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-usher-summit-protocol',
    name: 'Summit Protocol Uganda',
    category: 'ushering',
    description: 'Kampala protocol and ushering agency for state and diplomatic functions, corporate galas, weddings, and award ceremonies.',
    highlights: 'Starter package from UGX 1,000,000 estimated for 5 ushers and 0–100 guests; trained officers, VIP guest management, and final quote after enquiry.',
    base_price: 1000000,
    rating: null,
    reviews_count: null,
    contact_email: 'summitprotocolug@gmail.com',
    contact_phone: '+256 783 054 150',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-usher-trusted-labour-plug',
    name: 'Trusted Labour Plug Ltd',
    category: 'ushering',
    description: 'Western Uganda event-staffing company providing ushers, hostesses, waitstaff, and lead event coordinators.',
    highlights: 'Vetted and uniformed teams for guest reception, seating, registration, gifts tables, VIP seating, weddings, corporate, and church functions.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: null,
    contact_phone: '+256 778 316 499',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-usher-orchid',
    name: 'Orchid Ushers & Hospitality Agency',
    category: 'ushering',
    description: 'Kampala hospitality agency for weddings, conferences, corporate events, exhibitions, and gatherings of different sizes.',
    highlights: 'Event ushers, hostesses, hospitality staff, guest relations, and event coordination.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'orchidushers1@gmail.com',
    contact_phone: '+256 771 627 311',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
  {
    id: 'ug-usher-indulgent',
    name: 'Indulgent Ushering & Marketing Ltd',
    category: 'ushering',
    description: 'Kampala ushering and hospitality provider for product launches, conferences, social events, and corporate functions.',
    highlights: 'Registration-desk teams, conference hostesses, social-event ushers, seating, ticket checks, programme distribution, and guest support.',
    base_price: null,
    rating: null,
    reviews_count: null,
    contact_email: 'info@indulgentug.com',
    contact_phone: '+256 752 757 811',
    portfolio_images: [],
    available: true,
    created_at: providerTimestamp,
    updated_at: providerTimestamp,
  },
];

interface CartItem {
  provider: ServiceProvider;
  quantity: number;
}

interface MyEvent extends Event {
  bookings?: EventServiceBooking[];
}

const featureOptions = ['Networking', 'Certificates', 'Recording', 'Prizes', 'Refreshments', 'Live Sessions', 'Live Judging', 'Panel Discussion', 'Premium Materials', 'VIP Access', 'Swag Bag'];

export default function OrganizeTab() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'create-event' | 'browse-services' | 'my-events'>('create-event');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'reviews'>('rating');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'confirm'>('details');
  const [eventDate, setEventDate] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [userEvents, setUserEvents] = useState<MyEvent[]>([]);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [createForm, setCreateForm] = useState<CreateEventFormData & { customFeature?: string }>({
    eventName: '',
    eventDate: '',
    eventTime: '',
    location: '',
    description: '',
    estimatedGuests: 100,
    budget: 5000000,
    organizerSpecification: '',
    attractions: '',
    features: [],
    customFeature: '',
    isLivestream: false,
    livestreamLink: '',
  });

  const categories = ['all', 'venue', 'catering', 'decor', 'audio', 'photography', 'entertainment', 'security', 'transport', 'ushering'];

  const filteredProviders = useMemo(() => {
    return serviceProviders
      .filter((provider) => {
        const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
        const matchesSearch =
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.highlights.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch && provider.available;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return (a.base_price ?? Number.POSITIVE_INFINITY) - (b.base_price ?? Number.POSITIVE_INFINITY);
        if (sortBy === 'reviews') return (b.reviews_count ?? -1) - (a.reviews_count ?? -1);
        return (b.rating ?? -1) - (a.rating ?? -1);
      });
  }, [selectedCategory, searchQuery, sortBy]);

  // Load user events when component mounts or user changes
  useEffect(() => {
    if (user?.id && activeView === 'my-events') {
      loadUserEvents();
    }
  }, [user?.id, activeView]);

  const loadUserEvents = async () => {
    if (!user?.id) return;
    try {
      const events = await getUserEvents(user.id);

      // Prefetch all event image URLs to prevent flicker when updating state
      const prefetchPromises = events.map(
        (event) =>
          new Promise<void>((resolve) => {
            if (event.image_url) {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = event.image_url;
            } else {
              resolve();
            }
          })
      );
      await Promise.all(prefetchPromises);

      setUserEvents(events as MyEvent[]);
      // Cache for instant load next time (localStorage for persistence)
      try {
        localStorage.setItem('organize_tab_user_events', JSON.stringify(events));
      } catch (e) {
        // localStorage might be full, ignore
      }
    } catch (err) {
      console.error('Error loading events:', err);
    }
  };

  const addToCart = (provider: ServiceProvider) => {
    if (provider.base_price === null) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.provider.id === provider.id);
      if (existing) {
        return prev.map((item) =>
          item.provider.id === provider.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { provider, quantity: 1 }];
    });
  };

  const removeFromCart = (providerId: string) => {
    setCart((prev) => prev.filter((item) => item.provider.id !== providerId));
  };

  const updateQuantity = (providerId: string, change: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.provider.id === providerId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalCost = cart.reduce((sum, item) => sum + (item.provider.base_price ?? 0) * item.quantity, 0);
  const serviceFee = totalCost * 0.05;
  const grandTotal = totalCost + serviceFee;

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      alert('Please sign in to create an event');
      return;
    }

    if (!createForm.eventName || !createForm.eventDate || !createForm.location) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Creating your event...');

    try {
      const { event, error } = await createEvent(user.id, user.email?.split('@')[0] || 'User', createForm);

      if (error) {
        alert(`Error creating event: ${error}`);
        return;
      }

      // Upload image if selected
      if (imageFile && event?.id) {
        console.log('Uploading image for event:', event.id);
        const { url, error: uploadError } = await uploadEventImage(imageFile, event.id);
        if (uploadError) {
          console.error('Image upload error:', uploadError);
          alert(`Warning: Event created but image upload failed: ${uploadError}`);
        } else if (url) {
          console.log('Image uploaded successfully:', url);
          const { success, error: imgError } = await updateEventImage(event.id, user.id, url, false);
          if (imgError) {
            console.error('Failed to save image URL:', imgError);
          }
        }
      }

      alert('✓ Event created successfully! Now book service providers.');
      setSelectedEventForBooking(event?.id || null);
      setCreateForm({
        eventName: '',
        eventDate: '',
        eventTime: '',
        location: '',
        description: '',
        estimatedGuests: 100,
        budget: 5000000,
        organizerSpecification: '',
        attractions: '',
        features: [],
        customFeature: '',
        isLivestream: false,
        livestreamLink: '',
      });
      setImageFile(null);
      setActiveView('browse-services');
    } catch (err) {
      console.error('Error creating event:', err);
      alert('An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleCheckout = async () => {
    if (!user?.id) {
      alert('Please sign in to complete booking.');
      return;
    }

    if (cart.length === 0) {
      alert('Please add services to your cart.');
      return;
    }

    if (!selectedEventForBooking) {
      alert('Please create an event first.');
      return;
    }

    if (checkoutStep === 'details') {
      if (!eventDate) {
        alert('Please select an event date.');
        return;
      }
      setCheckoutStep('confirm');
    } else {
      setIsLoading(true);
      setLoadingMessage('Booking services...');

      try {
        const bookingData = cart.map(item => ({
          providerId: item.provider.id,
          providerName: item.provider.name,
          providerCategory: item.provider.category,
          quantity: item.quantity,
          basePrice: item.provider.base_price ?? 0,
        }));

        const { success, error } = await bookEventServices(selectedEventForBooking, user.id, bookingData);

        if (error) {
          alert(`Error booking services: ${error}`);
          return;
        }

        alert(`✓ Booking confirmed!\n\nEvent Date: ${eventDate}\nTotal: UGX ${grandTotal.toLocaleString()}\n\nService providers will contact you within 24 hours.`);
        setCart([]);
        setEventDate('');
        setEventNotes('');
        setShowCheckout(false);
        setCheckoutStep('details');
        setSelectedEventForBooking(null);
        await loadUserEvents();
      } catch (err) {
        console.error('Error booking services:', err);
        alert('An unexpected error occurred');
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    if (!user?.id) return;

    setIsLoading(true);
    setLoadingMessage('Publishing event...');

    try {
      const { success, error } = await publishEvent(eventId, user.id);

      if (error) {
        alert(`Error publishing event: ${error}`);
        return;
      }

      alert('✓ Event published successfully! It\'s now visible in the Join tab.');
      await loadUserEvents();
    } catch (err) {
      console.error('Error publishing event:', err);
      alert('An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleHideEventFromMyEvents = async (eventId: string) => {
    if (!user?.id) return;

    if (!confirm('Remove this event from My Events? (It will remain in the database for 30 days)')) return;

    setIsLoading(true);
    setLoadingMessage('Removing from My Events...');

    try {
      const { success, error } = await hideEventFromMyEvents(eventId, user.id);

      if (error) {
        alert(`Error removing event: ${error}`);
        return;
      }

      alert('✓ Event removed from My Events. You can restore it anytime.');
      await loadUserEvents();
    } catch (err) {
      console.error('Error removing event:', err);
      alert('An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const toggleFeature = (feature: string) => {
    setCreateForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="glass-effect p-8 rounded-2xl text-center">
            <Loader className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold">{loadingMessage}</p>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-4">
        <button
          onClick={() => setActiveView('create-event')}
          className={`md:flex-1 px-2 md:px-6 py-3 md:py-4 rounded-xl font-semibold transition-all flex md:flex-row flex-col items-center justify-center md:space-x-2 space-y-1 md:space-y-0 ${
            activeView === 'create-event'
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg'
              : 'glass-effect text-gray-300 hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Create Event</span>
        </button>
        <button
          onClick={() => setActiveView('browse-services')}
          className={`md:flex-1 px-2 md:px-6 py-3 md:py-4 rounded-xl font-semibold transition-all flex md:flex-row flex-col items-center justify-center md:space-x-2 space-y-1 md:space-y-0 ${
            activeView === 'browse-services'
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg'
              : 'glass-effect text-gray-300 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Book Services</span>
        </button>
        <button
          onClick={() => setActiveView('my-events')}
          className={`md:flex-1 px-2 md:px-6 py-3 md:py-4 rounded-xl font-semibold transition-all flex md:flex-row flex-col items-center justify-center md:space-x-2 space-y-1 md:space-y-0 ${
            activeView === 'my-events'
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg'
              : 'glass-effect text-gray-300 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 md:w-5 md:h-5" />
          <div className="flex flex-col md:flex-row items-center md:space-x-2">
            <span className="text-sm md:text-base">My Events</span>
            {userEvents.length > 0 && (
              <span className="px-1.5 py-0.5 bg-rose-500 text-white text-xs rounded-full font-bold">
                {userEvents.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {activeView === 'create-event' && (
        <div className="glass-effect p-8 rounded-2xl max-w-4xl mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Create Your Event</h2>
            <p className="text-gray-300">Fill in your event details and set up professional services to bring it to life.</p>
          </div>

          <form onSubmit={handleCreateEvent} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Event Name *</label>
                <input
                  type="text"
                  value={createForm.eventName}
                  onChange={(e) => setCreateForm({ ...createForm, eventName: e.target.value })}
                  placeholder="e.g., Annual Gala Dinner"
                  className="w-full px-4 py-3 glass-effect rounded-lg border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Event Date *</label>
                <input
                  type="date"
                  value={createForm.eventDate}
                  onChange={(e) => setCreateForm({ ...createForm, eventDate: e.target.value })}
                  className="w-full px-4 py-3 glass-effect rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Time (Optional)</label>
                <input
                  type="time"
                  value={createForm.eventTime}
                  onChange={(e) => setCreateForm({ ...createForm, eventTime: e.target.value })}
                  className="w-full px-4 py-3 glass-effect rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Location *</label>
                <input
                  type="text"
                  value={createForm.location}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  placeholder="Event venue or address"
                  className="w-full px-4 py-3 glass-effect rounded-lg border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Organizer/Creator Specification</label>
                <input
                  type="text"
                  value={createForm.organizerSpecification}
                  onChange={(e) => setCreateForm({ ...createForm, organizerSpecification: e.target.value })}
                  placeholder="e.g., Creative Arts Institute, Tech Innovators Ltd"
                  className="w-full px-4 py-3 glass-effect rounded-lg border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Expected Guests</label>
                <input
                  type="number"
                  value={createForm.estimatedGuests}
                  onChange={(e) => setCreateForm({ ...createForm, estimatedGuests: parseInt(e.target.value) || 0 })}
                  min="1"
                  className="w-full px-4 py-3 glass-effect rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Budget (UGX)</label>
                <input
                  type="number"
                  value={createForm.budget}
                  onChange={(e) => setCreateForm({ ...createForm, budget: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-3 glass-effect rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
              <label className="block text-white font-semibold mb-2">Main Speakers/Artistes Featured</label>
              <input
                type="text"
                value={createForm.attractions}
                onChange={(e) => setCreateForm({ ...createForm, attractions: e.target.value })}
                placeholder="e.g., John Smith, Jane Doe (comma-separated)"
                className="w-full px-4 py-3 glass-effect rounded-lg border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <ImageUploadField
            value={imageFile}
            preview={imageFile ? URL.createObjectURL(imageFile) : null}
            onChange={setImageFile}
            label="Event Image"
          />

          <div>
            <label className="block text-white font-semibold mb-2">Event Description</label>
              <textarea
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Describe your event, theme, special requirements..."
                rows={4}
                className="w-full px-4 py-3 glass-effect rounded-lg border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">Event Features & Perks</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {featureOptions.map(feature => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      createForm.features.includes(feature)
                        ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white'
                        : 'glass-effect text-gray-300 hover:text-white'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={createForm.customFeature || ''}
                  onChange={(e) => setCreateForm({ ...createForm, customFeature: e.target.value })}
                  placeholder="Add custom feature..."
                  className="flex-1 px-3 py-2 glass-effect rounded-lg border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-400 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (createForm.customFeature?.trim()) {
                      setCreateForm({
                        ...createForm,
                        features: [...createForm.features, createForm.customFeature.trim()],
                        customFeature: ''
                      });
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all"
                >
                  Add
                </button>
              </div>
              {createForm.features.length > featureOptions.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {createForm.features.slice(featureOptions.length).map((feature, idx) => (
                    <div key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs flex items-center gap-2">
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => setCreateForm({
                          ...createForm,
                          features: createForm.features.filter((_, i) => i !== featureOptions.length + idx)
                        })}
                        className="text-blue-400 hover:text-blue-200"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createForm.isLivestream}
                  onChange={(e) => setCreateForm({ ...createForm, isLivestream: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 text-rose-500 focus:ring-rose-400"
                />
                <span className="text-white font-semibold">This event will have a livestream</span>
              </label>

              {createForm.isLivestream && (
                <input
                  type="url"
                  value={createForm.livestreamLink}
                  onChange={(e) => setCreateForm({ ...createForm, livestreamLink: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 glass-effect rounded-lg border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                />
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Create Event</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeView === 'browse-services' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">Event Services Directory</h2>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 glass-effect rounded-xl border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 glass-effect rounded-xl border border-white/20 text-white bg-transparent focus:ring-2 focus:ring-rose-400 transition-all text-sm md:text-base"
                >
                  <option value="rating" className="bg-gray-800">
                    Top Rated
                  </option>
                  <option value="price" className="bg-gray-800">
                    Price (Low to High)
                  </option>
                  <option value="reviews" className="bg-gray-800">
                    Most Reviewed
                  </option>
                </select>
              </div>

              <div className="flex space-x-2 overflow-x-auto pb-2 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-sm ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white'
                        : 'glass-effect text-gray-300 hover:text-white'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredProviders.map((provider) => (
                  <div key={provider.id} className="glass-effect p-5 rounded-xl hover:bg-white/5 transition-all">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                          <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full whitespace-nowrap">
                            {provider.category}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{provider.description}</p>
                        <div className="flex items-center space-x-1 mb-3 text-sm text-gray-400">
                          <Award className="w-4 h-4 text-purple-400" />
                          <span><span className="font-medium text-gray-300">Highlights:</span> {provider.highlights}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2 text-xs text-gray-400">
                          {provider.contact_phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{provider.contact_phone}</span>
                            </div>
                          )}
                          {provider.contact_email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{provider.contact_email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end justify-between space-y-4">
                        <div className="w-full md:w-auto text-right">
                          <div className="flex items-center space-x-3 justify-between md:justify-end mb-2">
                            <div className="flex items-center space-x-1">
                              {provider.rating !== null ? (
                                <>
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-white font-semibold">{provider.rating.toFixed(1)}</span>
                                </>
                              ) : (
                                <span className="text-gray-400 text-xs">Rating not publicly listed</span>
                              )}
                            </div>
                            {provider.reviews_count !== null && provider.reviews_count > 80 && (
                              <div className="flex items-center space-x-1 text-purple-400">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-xs">Popular</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mb-3">
                            {provider.reviews_count !== null ? `(${provider.reviews_count.toLocaleString()} reviews)` : 'No public review count'}
                          </p>
                          <div className="text-sm text-gray-400 mb-3">Starting at</div>
                          {provider.base_price !== null ? (
                            <div className="text-2xl font-bold text-white">UGX {provider.base_price.toLocaleString()}</div>
                          ) : (
                            <div className="text-lg font-semibold text-purple-300">Quote on request</div>
                          )}
                        </div>

                        {provider.base_price !== null ? (
                          <button
                            onClick={() => addToCart(provider)}
                            className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm md:text-base"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                        ) : (
                          <a
                            href={provider.contact_email ? `mailto:${provider.contact_email}` : `tel:${provider.contact_phone}`}
                            className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm md:text-base"
                          >
                            {provider.contact_email ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                            <span>{provider.contact_email ? 'Request a quote' : 'Contact provider'}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProviders.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No providers found matching your criteria</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-effect p-6 rounded-2xl sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                </h3>
                {cart.length > 0 && (
                  <span className="px-3 py-1 bg-rose-500 text-white text-sm font-bold rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
                  <p className="text-gray-400 text-sm">
                    Add service providers to build your event booking cart.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.provider.id} className="bg-white/5 p-4 rounded-xl">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm mb-1">{item.provider.name}</h4>
                            <p className="text-gray-400 text-xs">{item.provider.category}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.provider.id)}
                            className="text-rose-400 hover:text-rose-300 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.provider.id, -1)}
                              className="p-1 glass-effect rounded text-gray-300 hover:text-white transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-white font-semibold w-6 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.provider.id, 1)}
                              className="p-1 glass-effect rounded text-gray-300 hover:text-white transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-400">
                              {((item.provider.base_price ?? 0) / 100000).toFixed(1)}M × {item.quantity}
                            </div>
                            <div className="text-white font-semibold text-sm">
                              UGX {((item.provider.base_price ?? 0) * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="text-white font-semibold">UGX {totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Service Fee (5%)</span>
                      <span className="text-white">UGX {serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg border-t border-white/10 pt-3">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-white font-bold">UGX {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {!showCheckout ? (
                    <button
                      onClick={() => setShowCheckout(true)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                      <span>Proceed to Book</span>
                    </button>
                  ) : checkoutStep === 'details' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2 font-semibold">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Event Date *
                        </label>
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full px-4 py-2 glass-effect rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-rose-400 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2 font-semibold">Additional Notes</label>
                        <textarea
                          value={eventNotes}
                          onChange={(e) => setEventNotes(e.target.value)}
                          placeholder="Special requirements..."
                          className="w-full px-4 py-2 glass-effect rounded-lg border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-400 transition-all resize-none"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowCheckout(false)}
                          className="flex-1 px-4 py-2 glass-effect text-gray-300 rounded-lg hover:text-white transition-all text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCheckout}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-green-400 font-semibold text-sm mb-1">Review Your Booking</p>
                            <p className="text-green-300 text-xs">
                              Event Date: {new Date(eventDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCheckoutStep('details')}
                          className="flex-1 px-4 py-2 glass-effect text-gray-300 rounded-lg hover:text-white transition-all text-sm font-medium"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleCheckout}
                          disabled={isLoading}
                          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all text-sm disabled:opacity-50"
                        >
                          {isLoading ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-xs leading-relaxed">
                      <AlertCircle className="w-3 h-3 inline mr-2" />
                      Providers will contact you within 24 hours to confirm availability.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeView === 'my-events' && (
        <div className="space-y-6">
          {userEvents.length === 0 ? (
            <div className="text-center py-16 glass-effect rounded-2xl">
              <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">No Events Yet</h3>
              <p className="text-gray-400 mb-6">Create your first event to get started organizing.</p>
              <button
                onClick={() => setActiveView('create-event')}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Event</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userEvents.map((event) => (
                <MyEventCard
                  key={event.id}
                  event={event}
                  isLoading={isLoading}
                  onPublish={handlePublishEvent}
                  onEdit={setEditingEvent}
                  onAddServices={(eventId) => {
                    setSelectedEventForBooking(eventId);
                    setActiveView('browse-services');
                  }}
                  onDelete={handleHideEventFromMyEvents}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          onEventUpdated={loadUserEvents}
          userId={user?.id || ''}
        />
      )}
    </div>
  );
}
