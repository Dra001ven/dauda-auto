// Content for the showroom. Kept out of the components so each tab, colour and
// model can be swapped (and animated between) without touching the layout.

export const navLinks = ['Models', 'Services', 'Experience', 'Shop', 'Purchase', 'Configure']

export const categories = ['Performance', 'Design', 'Safety', 'Luxury', 'Multimedia']

export const model = {
  make: 'Mercedes-Benz',
  name: 'AMG C 63 S Coupe',
  year: 2023,
  note: 'A variety of warranty options are available for your new or Certified Pre-Owned (CPO) Mercedes-Benz',
  power: {
    title: 'Unsurpassed Power',
    body: 'A handcrafted 503-hp biturbo V8 unleashes a 516-lb-ft torrent of torque. Aggressive style envelops advanced technologies.',
  },
  accessories: 'vpc-accessories',
}

// x / y are percentages of the car stage, so hotspots stay pinned as it scales.
export const hotspots = [
  { id: 'night', label: 'AMG Night Pack', x: 27, y: 55, side: 'left' },
  { id: 'roof', label: 'Panorama Roof', x: 52, y: 32, side: 'right' },
  { id: 'body', label: 'AMG Body Styl', x: 53, y: 66, side: 'left' },
  { id: 'perform', label: 'Pure Perform', x: 68, y: 80, side: 'right' },
]

export const colors = [
  { id: 'silver', name: 'Alpine Silver', value: '#d4d6d9' },
  { id: 'red', name: 'Patagonia Red', value: '#c0261f' },
  { id: 'blue', name: 'Spectral Blue', value: '#2563d9' },
  { id: 'copper', name: 'Desert Copper', value: '#d9a476' },
  { id: 'black', name: 'Obsidian Black', value: '#111111' },
]

export const specs = [
  { id: 'seats', icon: 'seat', label: 'Passenger', value: 'capacity', figure: '4', kind: 'seats' },
  { id: 'engine', icon: 'engine', title: 'Engine', label: 'Handcrafted', value: 'AMG 4.0L V8 biturbo' },
  { id: 'power', icon: 'power', figure: '503', unit: 'hp', label: 'Power', value: '@ 5,500–6,250 rpm' },
  { id: 'gearbox', icon: 'gearbox', title: 'Automatic transmission', badge: 'AMG', badgeSub: 'SPEEDSHIFT® MCT 9-speed', kind: 'badge' },
  { id: 'accel', icon: 'accel', title: 'Acceleration', figure: '3.7', unit: 'sec', value: '0–60 mph' },
  { id: 'speed', icon: 'speed', title: 'Top speed', figure: '180', unit: 'mph', value: 'Electronically limited' },
]
