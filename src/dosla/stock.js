// Dauda Motos stock list. Photos: downloads/images -> work/stock.py -> public/stock.
//
// Identification rule: a car is named only as far as the photo proves it. When the trim
// (S, 4S, Hellcat…) can't be read off the photo, `idNote` says so and the specs are the
// ones listed for the trim named in `specFor`. Prices are estimates in US dollars, shown
// in naira at NGN_RATE. Change both here when the real stock list arrives.

export const NGN_RATE = 1500 // ₦ per US$ (estimate, update with the day's rate)

export const naira = (usd) => {
  if (usd == null) return 'Price on request'
  const n = usd * NGN_RATE
  if (n >= 1e9) return `₦${(n / 1e9).toFixed(2)}B`
  return `₦${(n / 1e6).toFixed(1)}M`
}

export const categories = ['All', 'Hypercar', 'Supercar', 'Grand Tourer', 'Sports', 'Muscle', 'Saloon', 'SUV', 'Classic', 'Concept']

// exterior paints offered in the customiser ('orig' keeps the photographed finish)
export const paints = [
  { id: 'orig', name: 'As photographed', hex: null },
  { id: 'wine', name: 'Bordeaux Wine', hex: '#5e0f1f' },
  { id: 'red', name: 'Racing Red', hex: '#b5121b' },
  { id: 'orange', name: 'Sunset Orange', hex: '#e0561b' },
  { id: 'yellow', name: 'Sunburst Yellow', hex: '#e8b416' },
  { id: 'green', name: 'Eagle Green', hex: '#0d6b3a' },
  { id: 'teal', name: 'Lagoon Teal', hex: '#0f6f73' },
  { id: 'blue', name: 'Royal Blue', hex: '#1c3fa0' },
  { id: 'purple', name: 'Amethyst', hex: '#4b2470' },
  { id: 'grey', name: 'Nardo Grey', hex: '#7b7d7d' },
  { id: 'black', name: 'Midnight Black', hex: '#141414' },
  { id: 'white', name: 'Pearl White', hex: '#eeece6' },
]
export const leathers = [
  { id: 'orig', name: 'As photographed', hex: null },
  { id: 'oxblood', name: 'Oxblood', hex: '#5a1219' },
  { id: 'cognac', name: 'Cognac', hex: '#8a4a22' },
  { id: 'tan', name: 'Saddle Tan', hex: '#b07a45' },
  { id: 'ivory', name: 'Ivory', hex: '#e7ddc8' },
  { id: 'navy', name: 'Navy', hex: '#1d2a48' },
  { id: 'black', name: 'Jet Black', hex: '#1a1a1a' },
]
export const finishes = [
  { id: 'gloss', name: 'Gloss', usd: 0 },
  { id: 'satin', name: 'Satin', usd: 4500 },
  { id: 'matte', name: 'Matte', usd: 7500 },
]
export const OPTION_USD = { paint: 6000, leather: 5000 } // re-spray / re-trim, Lagos workshop estimate

// view: [file in /stock, label, kind] where kind 'paint' | 'leather' | null (not customisable)
// views with a background-free cut-out (work/stock.py cutout): /stock/<id>-cut.webp + -cut-mask.png
const CUTS = new Set(['911-rear34', '911-rear', '911-front', 'amg-gt', 'challenger', '812', 'f40', 'sf90', 'm3', 'jesko',
  'study-lumen', 'study-rosso', 'study-notte', 'study-sabbia', 'study-corsa'])
const S = (id, label, kind = 'paint') => ({
  src: `/stock/${id}.jpg`, mask: kind ? `/stock/${id}-mask.png` : null, label, kind,
  cut: CUTS.has(id) ? { src: `/stock/${id}-cut.webp`, mask: kind ? `/stock/${id}-cut-mask.png` : null } : null,
})

export const cars = [
  {
    slug: 'koenigsegg-jesko', make: 'Koenigsegg', model: 'Jesko', year: 2023, cat: 'Hypercar', usd: 3400000,
    colour: 'White with lime accents', condition: 'Brand new', location: 'Lagos',
    views: [S('jesko', 'Front ¾')],
    blurb: 'Track-focused Jesko with the big rear wing and the lime pinstripe pack. Built around Koenigsegg’s Light Speed Transmission.',
    specs: { Engine: '5.0 L twin-turbo V8', Power: '1,280 hp (petrol) / 1,600 hp (E85)', Torque: '1,500 Nm', Gearbox: '9-speed LST multi-clutch', Drive: 'Rear-wheel drive', Weight: '1,420 kg' },
    hp: 1600, zero: null, top: null,
    idNote: 'Shape, wing and wheels match the Jesko (Attack). Koenigsegg doesn’t publish an official 0–100 or top-speed figure for it.',
  },
  {
    slug: 'ferrari-sf90-stradale', make: 'Ferrari', model: 'SF90 Stradale', year: 2022, cat: 'Hypercar', usd: 560000,
    colour: 'White with black roof', condition: 'Brand new', location: 'Lagos',
    views: [S('sf90', 'Front ¾')],
    blurb: 'Ferrari’s plug-in hybrid flagship: a twin-turbo V8 and three electric motors, with all-wheel drive.',
    specs: { Engine: '4.0 L twin-turbo V8 + 3 e-motors', Power: '1,000 cv', Torque: '800 Nm', Gearbox: '8-speed dual-clutch', Drive: 'All-wheel drive', Weight: '1,570 kg (dry)' },
    hp: 986, zero: 2.5, top: 340,
    idNote: 'Probable ID: this photo looks digitally styled, and the SF90 and 296 GTB share a lot of their front design. Please confirm against the car itself.',
  },
  {
    slug: 'ferrari-812-superfast', make: 'Ferrari', model: '812 Superfast', year: 2020, cat: 'Grand Tourer', usd: 420000,
    colour: 'Red', condition: 'Tokunbo (foreign used)', location: 'Lagos',
    views: [S('812', 'Side profile')],
    blurb: 'A front-mounted, naturally aspirated V12 revving to 8,900 rpm. The fastest series-production front-engined Ferrari of its time.',
    specs: { Engine: '6.5 L naturally aspirated V12', Power: '800 cv', Torque: '718 Nm', Gearbox: '7-speed dual-clutch', Drive: 'Rear-wheel drive', Weight: '1,525 kg (dry)' },
    hp: 789, zero: 2.9, top: 340,
    idNote: 'The deep side scallop, long bonnet and fastback profile identify the 812 Superfast. Wheels are aftermarket.',
  },
  {
    slug: 'ferrari-f40', make: 'Ferrari', model: 'F40', year: 1990, cat: 'Classic', usd: 3000000,
    colour: 'White (re-finished)', condition: 'Collector', location: 'Lagos',
    views: [S('f40', 'Front ¾')],
    blurb: 'The last car Enzo Ferrari signed off: twin turbos, carbon-kevlar body and no driver aids at all. This one wears an LM-style wing and deep-dish wheels.',
    specs: { Engine: '2.9 L twin-turbo V8', Power: '478 cv', Torque: '577 Nm', Gearbox: '5-speed manual', Drive: 'Rear-wheel drive', Weight: '1,100 kg (dry)' },
    hp: 471, zero: 4.1, top: 324,
    idNote: 'Unmistakably an F40. Nearly every F40 left the factory in red, so the white paint, wing and wheels are later modifications.',
  },
  {
    slug: 'audi-r8-v10', make: 'Audi', model: 'R8 V10', year: 2021, cat: 'Supercar', usd: 175000,
    colour: 'Matte grey', condition: 'Tokunbo (foreign used)', location: 'Abuja',
    views: [S('r8', 'Front detail')],
    blurb: 'Second-generation R8 with the naturally aspirated 5.2-litre V10 and quattro all-wheel drive.',
    specs: { Engine: '5.2 L naturally aspirated V10', Power: '570 PS', Torque: '560 Nm', Gearbox: '7-speed S tronic', Drive: 'quattro all-wheel drive', Weight: '1,595 kg' },
    hp: 562, zero: 3.4, top: 324, specFor: 'R8 V10 quattro',
    idNote: 'Second-generation (Type 4S) R8, post-2019 facelift going by the slots above the grille. The photo can’t tell the V10 from the V10 performance, so specs are for the V10.',
  },
  {
    slug: 'porsche-911-992', make: 'Porsche', model: '911 Carrera (992)', year: 2022, cat: 'Sports', usd: 135000,
    colour: 'Burgundy metallic, Bordeaux leather', condition: 'Brand new', location: 'Lagos',
    views: [S('911-rear34', 'Rear ¾'), S('911-rear', 'Rear'), S('911-front', 'Front · black car', null), S('911-cabin', 'Dashboard', 'leather'), S('911-wheel', 'Cockpit', 'leather')],
    blurb: 'The current-generation 911 with a full-width rear light bar, an 8-speed PDK and a matching Bordeaux leather cabin.',
    specs: { Engine: '3.0 L twin-turbo flat-six', Power: '385 PS', Torque: '450 Nm', Gearbox: '8-speed PDK', Drive: 'Rear-wheel drive', Weight: '1,505 kg' },
    hp: 379, zero: 4.2, top: 293, specFor: '911 Carrera',
    idNote: 'The light bar and cabin confirm a 992-generation 911. The badge isn’t readable, so specs are for the base Carrera. An S or 4S would have more power.',
  },
  {
    slug: 'mercedes-amg-gt', make: 'Mercedes-AMG', model: 'GT', year: 2019, cat: 'Sports', usd: 115000,
    colour: 'Silver', condition: 'Tokunbo (foreign used)', location: 'Abuja',
    views: [S('amg-gt', 'Front ¾')],
    blurb: 'Front-mid-engined AMG GT with the Panamericana grille, a hand-built 4.0-litre biturbo V8 and a rear transaxle.',
    specs: { Engine: '4.0 L twin-turbo V8', Power: '522 PS', Torque: '670 Nm', Gearbox: '7-speed dual-clutch', Drive: 'Rear-wheel drive', Weight: '1,570 kg' },
    hp: 515, zero: 3.8, top: 310, specFor: 'AMG GT S (facelift)',
    idNote: 'An AMG GT coupé (C190) with the Panamericana grille. GT, GT S, GT C and GT R look almost the same from the front, so specs are for the GT S.',
  },
  {
    slug: 'bmw-m3-f80', make: 'BMW', model: 'M3 (F80)', year: 2018, cat: 'Saloon', usd: 52000,
    colour: 'White', condition: 'Tokunbo (foreign used)', location: 'Lagos',
    views: [S('m3', 'Front')],
    blurb: 'A four-door M car with the S55 straight-six, lowered on aftermarket wheels with a carbon front lip.',
    specs: { Engine: '3.0 L twin-turbo inline-six (S55)', Power: '431 PS', Torque: '550 Nm', Gearbox: '7-speed M DCT', Drive: 'Rear-wheel drive', Weight: '1,560 kg' },
    hp: 425, zero: 4.1, top: 250,
    idNote: 'The F80 M3 shares its front with the F82 M4 coupé. The rear-door line in the photo shows it’s the four-door M3. Top speed is electronically limited (280 km/h with the M Driver’s Package).',
  },
  {
    slug: 'dodge-challenger-srt', make: 'Dodge', model: 'Challenger SRT', year: 2021, cat: 'Muscle', usd: 78000,
    colour: 'Gloss black', condition: 'Tokunbo (foreign used)', location: 'Lagos',
    views: [S('challenger', 'Front ¾', null)],
    blurb: 'An American muscle coupé with a supercharged HEMI V8, quad halo headlamps and a scooped bonnet.',
    specs: { Engine: '6.2 L supercharged HEMI V8', Power: '717 hp', Torque: '889 Nm', Gearbox: '8-speed automatic', Drive: 'Rear-wheel drive', Weight: '2,000 kg' },
    hp: 717, zero: 3.6, top: 320, specFor: 'SRT Hellcat',
    idNote: 'Quad halo headlamps, the scooped bonnet and the badge identify a Challenger SRT. The photo can’t confirm the exact SRT version, so specs are for the Hellcat.',
  },
  {
    slug: 'bentley-continental-gt', make: 'Bentley', model: 'Continental GT', year: 2021, cat: 'Grand Tourer', usd: 240000,
    colour: 'Burgundy diamond-quilted leather', condition: 'Brand new', location: 'Abuja',
    views: [S('bentley-cabin', 'Cabin', 'leather')],
    blurb: 'Third-generation Continental GT with diamond-in-diamond quilted seats and the Bentley wings embroidered on the headrests.',
    specs: { Engine: '6.0 L twin-turbo W12', Power: '635 PS', Torque: '900 Nm', Gearbox: '8-speed dual-clutch', Drive: 'All-wheel drive', Weight: '2,244 kg' },
    hp: 626, zero: 3.7, top: 333, specFor: 'Continental GT W12',
    idNote: 'Interior only: the quilting and embroidered wings point to a third-generation Continental GT. The engine isn’t visible, so specs are for the W12.',
  },
  {
    slug: 'hyundai-tucson', make: 'Hyundai', model: 'Tucson', year: 2020, cat: 'SUV', usd: 24000,
    colour: 'Red', condition: 'Tokunbo (foreign used)', location: 'Lagos',
    views: [S('tucson', 'Front ¾')],
    blurb: 'Third-generation Tucson (TL facelift) with the cascading grille. An easy-to-own family SUV.',
    specs: { Engine: '2.0 L inline-four', Power: '164 hp', Torque: '205 Nm', Gearbox: '6-speed automatic', Drive: 'Front-wheel drive', Weight: '1,520 kg' },
    hp: 164, zero: null, top: null, specFor: 'Tucson 2.0 (US spec)',
    idNote: 'The cascading grille and lamps identify the 2019–2021 Tucson facelift. Engines vary by market, so specs are for the 2.0.',
  },
  // ---- design renders: shown for inspiration, not for sale ----
  { slug: 'study-lumen', make: 'Studio', model: 'Lumen', year: 2026, cat: 'Concept', usd: null, colour: 'Pearl white', condition: 'Design render', location: '—',
    views: [S('study-lumen', 'Render')], blurb: 'Unbadged digital design render of a low electric GT, kept as an inspiration piece.', specs: null, idNote: 'Not a production car. It carries no badge and matches no real model.' },
  { slug: 'study-rosso', make: 'Studio', model: 'Rosso Coupé', year: 2026, cat: 'Concept', usd: null, colour: 'Red', condition: 'Design render', location: '—',
    views: [S('study-rosso', 'Render')], blurb: 'Unbadged front-engined coupé render.', specs: null, idNote: 'Not a production car. It carries no badge and matches no real model.' },
  { slug: 'study-notte', make: 'Studio', model: 'Notte Coupé', year: 2026, cat: 'Concept', usd: null, colour: 'Navy', condition: 'Design render', location: '—',
    views: [S('study-notte', 'Render')], blurb: 'Large luxury coupé render with a kidney-style grille.', specs: null, idNote: 'Not a production car: it mixes design cues from several brands and has no real badge.' },
  { slug: 'study-sabbia', make: 'Studio', model: 'Audi-badged render', year: 2026, cat: 'Concept', usd: null, colour: 'Sand grey', condition: 'Design render', location: '—',
    views: [S('study-sabbia', 'Render')], blurb: 'Digital mid-engine render wearing Audi rings.', specs: null, idNote: 'Not a production Audi. It’s a fan or AI render with Audi badges.' },
  { slug: 'study-luce', make: 'Studio', model: 'Light-bar render', year: 2026, cat: 'Concept', usd: null, colour: 'Graphite', condition: 'Design render', location: '—',
    views: [S('study-luce', 'Render', null)], blurb: 'Rear view of a futuristic track-car render with an illuminated logo.', specs: null, idNote: 'Not a production car. It’s a digital render with Audi rings.' },
  { slug: 'study-corsa', make: 'Studio', model: 'Le Mans-style render', year: 2026, cat: 'Concept', usd: null, colour: 'White and red', condition: 'Design render', location: '—',
    views: [S('study-corsa', 'Render')], blurb: 'Endurance-racer style render in a workshop.', specs: null, idNote: 'Not a production car. It’s a digital render wearing Ferrari branding.' },
]

export const findCar = (slug) => cars.find((c) => c.slug === slug)
