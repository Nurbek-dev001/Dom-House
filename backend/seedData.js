import mongoose from 'mongoose';
import Property from './models/propertymodel.js';
import User from './models/Usermodel.js';
import { config } from './config/config.js';

const kazakhProperties = [
  {
    title: "Luxury Apartment in Downtown Almaty",
    description: "Объект для покупки. Modern 3-bedroom apartment in an elite district. Panoramic city views, high ceilings of 3.5m, premium finishes. Includes parking and utilities.",
    price: 185000,
    beds: 3,
    baths: 2,
    sqft: 156,
    city: "Almaty",
    location: "Downtown, Bayzak Batyr St",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["WiFi", "Gym", "Pool", "Parking", "Balcony"],
    availability: "available",
    rating: 4.8,
    phone: "+77001234567"
  },
  {
    title: "Private House in Auezkhan District",
    description: "Объект для покупки. Spacious 2-story house covering 380 sq.m on a 15-hectare plot. Brick construction, 5 rooms, built-in garage, swimming pool, landscaping. Quiet family location.",
    price: 220000,
    beds: 5,
    baths: 3,
    sqft: 380,
    city: "Almaty",
    location: "Auezkhan District",
    type: "house",
    image: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0fGVufDB8fDB8fHww"],
    amenities: ["Garage", "Pool", "Garden", "Security", "Large Plot"],
    availability: "available",
    rating: 4.9,
    phone: "+77001234568"
  },
  {
    title: "Office in Business Center Nur-Sultan",
    description: "Spacious office on the 15th floor with panoramic city views. 240 sq.m open space, prepared workstations, VIP meeting area, fully equipped kitchen. 24/7 security.",
    price: 3500,
    beds: 0,
    baths: 2,
    sqft: 240,
    city: "Nur-Sultan",
    location: "Business Center Downtown",
    type: "commercial",
    image: ["https://images.unsplash.com/photo-1497366216548-495226ae6d35?w=800&q=80"],
    amenities: ["WiFi", "24/7 Security", "Reception", "Meeting Rooms", "Parking"],
    availability: "available",
    rating: 4.7,
    phone: "+77001234569"
  },
  {
    title: "2-Bedroom Apartment in Atyrau",
    description: "Cozy apartment on the 8th floor with Caspian Sea views. Fresh renovation, new furniture, built-in wardrobe, venetian blind balcony. Near schools, kindergarten, shops.",
    price: 95000,
    beds: 2,
    baths: 1,
    sqft: 98,
    city: "Atyrau",
    location: "Sea Strait",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["Balcony", "Renovated", "Sea View", "Parking"],
    availability: "available",
    rating: 4.6,
    phone: "+77001234570"
  },
  {
    title: "Premium Penthouse in Damdi Residence",
    description: "Unique penthouse atop an elite residential complex. 4 bedrooms, 3 bathrooms, huge living room with fireplace, 80 sq.m terrace with jacuzzi and panoramic view. Premium finishes, smart home system.",
    price: 450000,
    beds: 4,
    baths: 3,
    sqft: 320,
    city: "Almaty",
    location: "Bostandyk District, Damdi Residence",
    type: "villa",
    image: ["https://images.unsplash.com/photo-1512917774080-9991f1c9c5d5?w=800&q=80"],
    amenities: ["Terrace", "Spa", "Smart Home", "Private Elevator", "Panorama"],
    availability: "available",
    rating: 5.0,
    phone: "+77001234571"
  },
  {
    title: "Studio Apartment in Downtown Nur-Sultan",
    description: "Modern studio in the heart of the city, walking distance to metro. Open layout, built-in furniture, air conditioning, balcony. Perfect for young professionals.",
    price: 55000,
    beds: 1,
    baths: 1,
    sqft: 45,
    city: "Nur-Sultan",
    location: "Alatau District, Downtown",
    type: "flat",
    image: ["https://images.unsplash.com/photo-1516455207990-7a41e1d4ffd5?w=800&q=80"],
    amenities: ["WiFi", "AC", "Balcony", "Furnished"],
    availability: "available",
    rating: 4.5,
    phone: "+77001234572"
  },
  {
    title: "Cottage Complex in Aktau",
    description: "Unique cottage in a closed complex with infrastructure. 4 bedrooms, 2.5 bathrooms, living room, dining room, kitchen, 2-car garage. Documents in order. All utilities and security included.",
    price: 185000,
    beds: 4,
    baths: 2,
    sqft: 280,
    city: "Aktau",
    location: "New Cottage Complex",
    type: "house",
    image: ["https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&q=80"],
    amenities: ["Garage", "Gated Community", "Security 24/7", "Garden"],
    availability: "available",
    rating: 4.8,
    phone: "+77001234573"
  },
  {
    title: "Modern Apartment in Abai",
    description: "Bright 2-bedroom apartment on the 6th floor in a new house completed in 2024. Perfect layout, spacious kitchen, separate rooms, complete finishing. Views of Abai Park.",
    price: 125000,
    beds: 2,
    baths: 1,
    sqft: 102,
    city: "Almaty",
    location: "Abai St",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["New Building", "Park View", "Parking", "Modern"],
    availability: "available",
    rating: 4.7,
    phone: "+77001234574"
  },
  {
    title: "Retail Space in Shopping Center",
    description: "Commercial space of 200 sq.m in a popular shopping center. Excellent customer traffic, ready space, all necessary utilities. Perfect for shop, cafe or office.",
    price: 5000,
    beds: 0,
    baths: 1,
    sqft: 200,
    city: "Almaty",
    location: "Parkent Mall",
    type: "commercial",
    image: ["https://images.unsplash.com/photo-1604014237800-1c6174d54ecb?w=800&q=80"],
    amenities: ["High Traffic", "Full Utilities", "Flexible Terms"],
    availability: "available",
    rating: 4.6,
    phone: "+77001234575"
  },
  {
    title: "Townhouse in Tussai Mansions",
    description: "Elegant 3-story townhouse in a prestigious complex. 3 bedrooms, 2.5 bathrooms, living-dining room, open-plan kitchen, terrace, garage. Premium finishes.",
    price: 165000,
    beds: 3,
    baths: 2,
    sqft: 195,
    city: "Almaty",
    location: "Tussai Mansions, Ceramic District",
    type: "townhouse",
    image: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"],
    amenities: ["Garage", "Terrace", "Gated", "Premium Finish"],
    availability: "available",
    rating: 4.8,
    phone: "+77001234576"
  },
  {
    title: "3-Bedroom Apartment in Petropavlovsk",
    description: "Spacious apartment on the 5th floor with city views. Separate rooms, renovated turnkey, new furniture included. Warm house, good neighborhood.",
    price: 78000,
    beds: 3,
    baths: 1,
    sqft: 125,
    city: "Petropavlovsk",
    location: "Central District",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["Renovated", "Furnished", "City View"],
    availability: "available",
    rating: 4.5,
    phone: "+77001234577"
  },
  {
    title: "2-Bedroom Apartment in Pavlodar",
    description: "Cozy apartment with great layout on the 9th floor. Spacious kitchen-living room, 2 separate bedrooms with windows, balcony with view. Fresh renovation, heated floors.",
    price: 85000,
    beds: 2,
    baths: 1,
    sqft: 96,
    city: "Pavlodar",
    location: "Okhotsky Microdistrict",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["Renovated", "Balcony", "Warm Floors"],
    availability: "available",
    rating: 4.6,
    phone: "+77001234578"
  },
  {
    title: "Commercial Warehouse in Industrial Zone",
    description: "Industrial warehouse of 1200 sq.m in the city's industrial zone. High ceilings of 6m, reinforced concrete structures, truck docking, separate office space.",
    price: 8000,
    beds: 0,
    baths: 1,
    sqft: 1200,
    city: "Almaty",
    location: "Industrial Zone",
    type: "commercial",
    image: ["https://images.unsplash.com/photo-1518534357992-87e36c45b9e8?w=800&q=80"],
    amenities: ["High Ceilings", "Parking", "Loading Bay"],
    availability: "available",
    rating: 4.5,
    phone: "+77001234579"
  },
  {
    title: "Apartment in New District of Nur-Sultan",
    description: "Modern apartment in a new microdistrict with developed infrastructure. 2 bedrooms, living room, kitchen, balcony. New building with elevator, near parks, schools, kindergartens.",
    price: 105000,
    beds: 2,
    baths: 1,
    sqft: 104,
    city: "Nur-Sultan",
    location: "Sorasy Microdistrict",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["New Building", "Park Nearby", "Schools", "Shops"],
    availability: "available",
    rating: 4.7,
    phone: "+77001234580"
  },
  {
    title: "Elegant House in Borovoe",
    description: "Unique architectural house on the shores of a lake with panoramic views. 5 bedrooms, 3 bathrooms, living room with fireplace, kitchen-dining room, library, terrace. 2-hectare plot.",
    price: 350000,
    beds: 5,
    baths: 3,
    sqft: 420,
    city: "Borovoe",
    location: "Lake Borovoe Shore",
    type: "villa",
    image: ["https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&q=80"],
    amenities: ["Lake View", "Large Garden", "Fireplace", "Terrace"],
    availability: "available",
    rating: 5.0,
    phone: "+77001234581"
  },
  {
    title: "Premium Mobile Home in Resort Zone",
    description: "Modern premium-class mobile home. 2 bedrooms, bathroom, kitchen, living room, parking. Fully ready for living, everything included. Perfect for vacation and investment.",
    price: 35000,
    beds: 2,
    baths: 1,
    sqft: 65,
    city: "Atyrau",
    location: "Resort Zone",
    type: "house",
    image: ["https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80"],
    amenities: ["Modern", "Fully Equipped", "Resort Zone"],
    availability: "available",
    rating: 4.4,
    phone: "+77001234582"
  },
  {
    title: "2-Bedroom Apartment in Temirtau",
    description: "Convenient apartment on the 4th floor in a residential quarter. Two separate rooms, spacious kitchen, balcony. Warm house, solid foundation. Near kindergarten and school.",
    price: 68000,
    beds: 2,
    baths: 1,
    sqft: 88,
    city: "Temirtau",
    location: "Central Quarter",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["Heated", "Balcony", "School Nearby"],
    availability: "available",
    rating: 4.5,
    phone: "+77001234583"
  },
  {
    title: "Studio in Business Park West",
    description: "Compact and functional studio in a business center. Open layout, modern renovation, mini-kitchen, bathroom, balcony. Excellent location for young professionals.",
    price: 48000,
    beds: 1,
    baths: 1,
    sqft: 42,
    city: "Almaty",
    location: "Business Park West",
    type: "flat",
    image: ["https://images.unsplash.com/photo-1516455207990-7a41e1d4ffd5?w=800&q=80"],
    amenities: ["Modern", "Business Center", "WiFi Ready"],
    availability: "available",
    rating: 4.6,
    phone: "+77001234584"
  },
  {
    title: "Huge Villa in Oreanda",
    description: "Luxurious villa on a high bank with unique landscape views. 6 bedrooms, 4 bathrooms, huge living room, wine cellar, spa center, heated swimming pool. 3-hectare plot.",
    price: 650000,
    beds: 6,
    baths: 4,
    sqft: 580,
    city: "Almaty",
    location: "Oreanda District",
    type: "villa",
    image: ["https://images.unsplash.com/photo-1613581821968-16e59e309b93?w=800&q=80"],
    amenities: ["Pool", "Wine Cellar", "SPA", "Large Garden", "Panoramic View"],
    availability: "available",
    rating: 5.0,
    phone: "+77001234585"
  },
  {
    title: "Office Space in Downtown",
    description: "Office space for rent of 150 sq.m for office or shop. Good location, high customer traffic, convenient for clients. All utilities in order.",
    price: 3000,
    beds: 0,
    baths: 1,
    sqft: 150,
    city: "Nur-Sultan",
    location: "City Center",
    type: "commercial",
    image: ["https://images.unsplash.com/photo-1497366216548-495226ae6d35?w=800&q=80"],
    amenities: ["Central Location", "Parking", "All Utilities"],
    availability: "available",
    rating: 4.6,
    phone: "+77001234586"
  },
  {
    title: "Cozy Cottage in Suburbs of Almaty",
    description: "Family cottage in a quiet suburb with its own garden. 4 rooms, 1.5 bathrooms, living room, kitchen. Plot with fruit trees, well, garage. Peaceful family location.",
    price: 142000,
    beds: 4,
    baths: 1,
    sqft: 210,
    city: "Almaty",
    location: "Almaty Suburbs",
    type: "house",
    image: ["https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&q=80"],
    amenities: ["Garden", "Garage", "Well", "Fruit Trees"],
    availability: "available",
    rating: 4.7,
    phone: "+77001234587"
  },
  {
    title: "Apartment in Chapaev Residential Complex",
    description: "Beautiful apartment on the 7th floor with city architecture views. 2 bedrooms, modern kitchen, spacious living room, two balconies. Building with good reputation.",
    price: 115000,
    beds: 2,
    baths: 1,
    sqft: 110,
    city: "Almaty",
    location: "Chapaev St",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["City View", "Two Balconies", "Modern"],
    availability: "available",
    rating: 4.7,
    phone: "+77001234588"
  },
  {
    title: "Guest House in Ybrayminsk",
    description: "Guest house with 4 separate rooms, perfect for tourism business. Each room has its own bathroom, shared kitchen, living room, terrace with mountain views.",
    price: 125000,
    beds: 4,
    baths: 4,
    sqft: 320,
    city: "Almaty",
    location: "Ybraymin Gorge",
    type: "house",
    image: ["https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&q=80"],
    amenities: ["Mountain View", "Terrace", "Multiple Rooms"],
    availability: "available",
    rating: 4.8,
    phone: "+77001234589"
  },
  {
    title: "Office Space on Al-Farabi",
    description: "Modern office of 180 sq.m on Al-Farabi Avenue. Fully renovated, air conditioning, heating, internet included. Divided into zones, separate conference room.",
    price: 4000,
    beds: 0,
    baths: 2,
    sqft: 180,
    city: "Almaty",
    location: "Al-Farabi Avenue",
    type: "commercial",
    image: ["https://images.unsplash.com/photo-1497366216548-495226ae6d35?w=800&q=80"],
    amenities: ["Conference Room", "AC", "Heating", "Internet"],
    availability: "available",
    rating: 4.7,
    phone: "+77001234590"
  },
  {
    title: "Spacious 3-Bedroom Apartment in Turkestan",
    description: "Bright apartment with perfect layout on the 8th floor. Three separate rooms, large kitchen, two bathrooms, balconies. New building, all modern equipment.",
    price: 98000,
    beds: 3,
    baths: 2,
    sqft: 135,
    city: "Turkestan",
    location: "New Microdistrict",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["New Building", "Balconies", "Modern"],
    availability: "available",
    rating: 4.7,
    phone: "+77001234591"
  },
  {
    title: "Commercial Center in Downtown Aktobe",
    description: "Ready-to-use commercial center with 5 separate shops. Each has its own entrance, shared parking. Excellent location with high customer traffic.",
    price: 15000,
    beds: 0,
    baths: 2,
    sqft: 450,
    city: "Aktobe",
    location: "City Center",
    type: "commercial",
    image: ["https://images.unsplash.com/photo-1604014237800-1c6174d54ecb?w=800&q=80"],
    amenities: ["5 Shops", "Parking", "High Traffic"],
    availability: "available",
    rating: 4.6,
    phone: "+77001234592"
  },
  {
    title: "Minimalist Studio in Kazybye",
    description: "Beautiful studio with modern minimalist design. Open kitchen-living room, separate bedroom-bed, bathroom with shower. Fresh renovation, everything new.",
    price: 52000,
    beds: 1,
    baths: 1,
    sqft: 50,
    city: "Almaty",
    location: "Kazybye St",
    type: "flat",
    image: ["https://images.unsplash.com/photo-1516455207990-7a41e1d4ffd5?w=800&q=80"],
    amenities: ["Modern Design", "New Renovation", "Shower"],
    availability: "available",
    rating: 4.6,
    phone: "+77001234593"
  },
  {
    title: "Townhouse in Silkway Village Complex",
    description: "Luxury townhouse in a prestigious complex with security and infrastructure. 3 bedrooms, 2 bathrooms, living room, kitchen, garage, small terrace. All included in price.",
    price: 175000,
    beds: 3,
    baths: 2,
    sqft: 220,
    city: "Almaty",
    location: "Silkway Village",
    type: "townhouse",
    image: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"],
    amenities: ["Garage", "Gated Community", "Terrace", "Security"],
    availability: "available",
    rating: 4.9,
    phone: "+77001234594"
  },
  {
    title: "2-Bedroom Apartment in Zhanibek",
    description: "Convenient apartment in a good area on the 3rd floor. Two medium-sized rooms, bright kitchen, balcony. House built in 1990s with good building renovation. Quiet neighborhood.",
    price: 75000,
    beds: 2,
    baths: 1,
    sqft: 85,
    city: "Almaty",
    location: "Zhanibek St",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["Renovated House", "Balcony", "Quiet"],
    availability: "available",
    rating: 4.5,
    phone: "+77001234595"
  },
  {
    title: "Luxury Apartment with Two Terraces",
    description: "Exceptional apartment with two spacious terraces on the 20th floor. 3 bedrooms, 2.5 bathrooms, luxury living room, kitchen-dining room. Panoramic view of Almaty, smart home system.",
    price: 280000,
    beds: 3,
    baths: 2,
    sqft: 250,
    city: "Almaty",
    location: "High Floor, Downtown",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1512917774080-9991f1c9c5d5?w=800&q=80"],
    amenities: ["Two Terraces", "Smart Home", "Panoramic View", "Luxury"],
    availability: "available",
    rating: 5.0,
    phone: "+77001234596"
  },
  {
    title: "Manufacturing Space in Industrial Zone",
    description: "Spacious manufacturing space of 800 sq.m with office area. High ceilings, truck approach, good power supply, ventilation system. Lease or sale.",
    price: 6500,
    beds: 0,
    baths: 1,
    sqft: 800,
    city: "Almaty",
    location: "Industrial Zone",
    type: "commercial",
    image: ["https://images.unsplash.com/photo-1518534357992-87e36c45b9e8?w=800&q=80"],
    amenities: ["High Ceilings", "Loading Bay", "Ventilation"],
    availability: "available",
    rating: 4.5,
    phone: "+77001234597"
  },
  {
    title: "Furnished 1-Bedroom Apartment in Karasay",
    description: "Fully furnished apartment ready for occupancy. 1 room with double bed, kitchen with refrigerator and stove, bathroom with hot water. Great offer!",
    price: 45000,
    beds: 1,
    baths: 1,
    sqft: 55,
    city: "Almaty",
    location: "Karasay Batyr St",
    type: "flat",
    image: ["https://images.unsplash.com/photo-1516455207990-7a41e1d4ffd5?w=800&q=80"],
    amenities: ["Furnished", "Hot Water", "Ready to Move"],
    availability: "available",
    rating: 4.4,
    phone: "+77001234598"
  },
  {
    title: "Elite Cottage in Chundja",
    description: "Luxurious cottage in nature on a 2-hectare plot. 5 bedrooms, 3.5 bathrooms, living room with fireplace, kitchen-dining room, library, terrace with swimming pool.",
    price: 380000,
    beds: 5,
    baths: 3,
    sqft: 450,
    city: "Almaty",
    location: "Chundja Suburbs",
    type: "house",
    image: ["https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&q=80"],
    amenities: ["Pool", "Large Garden", "Fireplace", "Library"],
    availability: "available",
    rating: 4.9,
    phone: "+77001234599"
  },
  {
    title: "Apartment in Downtown Kyzylorda",
    description: "Modern apartment in the city center with main street views. 2 bedrooms, living room, kitchen, balcony. New building with elevator and parking. Excellent location.",
    price: 82000,
    beds: 2,
    baths: 1,
    sqft: 100,
    city: "Kyzylorda",
    location: "City Center",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    amenities: ["Central Location", "New Building", "Parking"],
    availability: "available",
    rating: 4.6,
    phone: "+77001234600"
  },
  {
    title: "Office with City View in Shymkent",
    description: "Bright office on the 12th floor with panoramic city views. 220 sq.m open space, prepared work zones, meeting room, kitchen. Premium business center.",
    price: 3200,
    beds: 0,
    baths: 2,
    sqft: 220,
    city: "Shymkent",
    location: "Business Tower",
    type: "commercial",
    image: ["https://images.unsplash.com/photo-1497366216548-495226ae6d35?w=800&q=80"],
    amenities: ["City View", "Modern", "Meeting Rooms"],
    availability: "available",
    rating: 4.7,
    phone: "+77001234601"
  },
  {
    title: "Family House in Shchuchinsk",
    description: "Comfortable family house on 2 levels. 4 rooms, 2 bathrooms, living room, kitchen, garage. 8-hectare plot with garden and play area for children. Quiet, eco-friendly district.",
    price: 135000,
    beds: 4,
    baths: 2,
    sqft: 240,
    city: "Shchuchinsk",
    location: "Residential District",
    type: "house",
    image: ["https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&q=80"],
    amenities: ["Garden", "Garage", "Play Area"],
    availability: "available",
    rating: 4.8,
    phone: "+77001234602"
  },
  {
    title: "Penthouse Apartment in Taraz",
    description: "Huge penthouse on the roof with views of the entire region. 4 bedrooms, 3 bathrooms, living room, dining room, office, 60 sq.m balcony. Premium finish.",
    price: 320000,
    beds: 4,
    baths: 3,
    sqft: 360,
    city: "Taraz",
    location: "Historical Part",
    type: "apartment",
    image: ["https://images.unsplash.com/photo-1512917774080-9991f1c9c5d5?w=800&q=80"],
    amenities: ["Panoramic View", "Large Balcony", "Premium Finish"],
    availability: "available",
    rating: 4.9,
    phone: "+77001234603"
  },
  {
    title: "Mini-Hotel in Resort Zone",
    description: "Ready mini-hotel with 12 rooms in resort zone. Fully functional, reception, kitchen, dining room. Excellent income, already has permanent clients.",
    price: 220000,
    beds: 12,
    baths: 12,
    sqft: 600,
    city: "Borovoe",
    location: "Resort Zone",
    type: "house",
    image: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"],
    amenities: ["Reception", "Kitchen", "Dining", "Restaurant Business"],
    availability: "available",
    rating: 4.8,
    phone: "+77001234604"
  }
];

// === Уникальные фото для каждого property ===
const uniqueImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80",
  "https://images.unsplash.com/photo-1467987506553-8f3916508521?w=800&q=80",
  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80",
  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80",
  "https://images.unsplash.com/photo-1467987506553-8f3916508521?w=800&q=80",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80",
  // ...добавьте больше уникальных ссылок при необходимости...
];

kazakhProperties.forEach((prop, idx) => {
  if (Array.isArray(prop.image) && uniqueImages[idx]) {
    prop.image[0] = uniqueImages[idx];
  }
});

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log('✅ MongoDB connected');

    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      adminUser = await User.create({
        name: 'DomHouse Admin',
        email: 'admin@domhouse.kz',
        password: 'admin123',
        phone: '+77001111111',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    }

    await Property.deleteMany({});
    console.log('✅ Old properties deleted');

    // Ensure each property has at least 5 images
    const extraImagesPool = [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c9c5d5?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-495226ae6d35?w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      'https://images.unsplash.com/photo-1613581821968-16e59e309b93?w=1200&q=80',
      'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=1200&q=80',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c6174d54ecb?w=1200&q=80'
    ];

    const enrichedProperties = kazakhProperties.map((prop, idx) => {
      const images = Array.isArray(prop.image) ? [...prop.image] : (prop.image ? [prop.image] : []);
      let counter = 0;
      while (images.length < 5) {
        images.push(extraImagesPool[(idx + counter) % extraImagesPool.length]);
        counter++;
      }
      return { ...prop, image: images };
    });

    const propertiesWithOwner = enrichedProperties.map(prop => ({
      ...prop,
      owner: adminUser._id
    }));

    const result = await Property.insertMany(propertiesWithOwner);
    console.log(`✅ Added ${result.length} properties in English with prices in Tenge (₸)`);

    await mongoose.connection.close();
    console.log('✅ Data successfully loaded!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
