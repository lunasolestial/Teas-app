// Nursing school TEAS score requirements.
// overall = minimum composite %. null per-subject means no published minimum.
// Always verify current requirements directly with your school — these change yearly.

export const NURSING_SCHOOLS = [
  // ── North Carolina — Community Colleges ─────────────────────────────────────
  {
    name: 'Central Piedmont Community College',
    city: 'Charlotte', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 58, reading: null, math: null, science: null, english: null },
    competitive: { overall: 80, reading: 80, math: 70, science: 75, english: 75 },
  },
  {
    name: 'Wake Technical Community College',
    city: 'Raleigh', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 60, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Forsyth Technical Community College',
    city: 'Winston-Salem', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Rowan-Cabarrus Community College',
    city: 'Salisbury', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Gaston College',
    city: 'Dallas', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Mitchell Community College',
    city: 'Statesville', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Catawba Valley Community College',
    city: 'Hickory', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 62, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Davidson-Davie Community College',
    city: 'Thomasville', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Stanly Community College',
    city: 'Albemarle', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 60, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Piedmont Community College',
    city: 'Roxboro', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 60, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Sandhills Community College',
    city: 'Pinehurst', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Johnston Community College',
    city: 'Smithfield', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 62, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Pitt Community College',
    city: 'Greenville', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Fayetteville Technical Community College',
    city: 'Fayetteville', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Coastal Carolina Community College',
    city: 'Jacksonville', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Craven Community College',
    city: 'New Bern', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 62, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Wayne Community College',
    city: 'Goldsboro', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 62, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Caldwell Community College and Technical Institute',
    city: 'Hudson', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 60, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Wilkes Community College',
    city: 'Wilkesboro', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 60, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Surry Community College',
    city: 'Dobson', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 60, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Richmond Community College',
    city: 'Hamlet', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 60, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Southeastern Community College',
    city: 'Whiteville', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 58, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Vance-Granville Community College',
    city: 'Henderson', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 60, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Robeson Community College',
    city: 'Lumberton', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 58, reading: null, math: null, science: null, english: null },
  },
  // ── North Carolina — Universities ────────────────────────────────────────────
  {
    name: 'University of North Carolina at Chapel Hill',
    city: 'Chapel Hill', state: 'NC',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 75, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Duke University School of Nursing',
    city: 'Durham', state: 'NC',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 78, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'East Carolina University',
    city: 'Greenville', state: 'NC',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 70, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Western Carolina University',
    city: 'Cullowhee', state: 'NC',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 70, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Appalachian State University',
    city: 'Boone', state: 'NC',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 70, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Winston-Salem State University',
    city: 'Winston-Salem', state: 'NC',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'North Carolina A&T State University',
    city: 'Greensboro', state: 'NC',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Queens University of Charlotte',
    city: 'Charlotte', state: 'NC',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 70, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Gardner-Webb University',
    city: 'Boiling Springs', state: 'NC',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Carolinas College of Health Sciences',
    city: 'Charlotte', state: 'NC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 68, reading: null, math: null, science: null, english: null },
  },
  // ── South Carolina ────────────────────────────────────────────────────────────
  {
    name: 'University of South Carolina',
    city: 'Columbia', state: 'SC',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 72, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Clemson University',
    city: 'Clemson', state: 'SC',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 73, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Midlands Technical College',
    city: 'Columbia', state: 'SC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Trident Technical College',
    city: 'Charleston', state: 'SC',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  // ── Virginia ──────────────────────────────────────────────────────────────────
  {
    name: 'Virginia Commonwealth University',
    city: 'Richmond', state: 'VA',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 72, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Northern Virginia Community College',
    city: 'Annandale', state: 'VA',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  // ── Georgia ──────────────────────────────────────────────────────────────────
  {
    name: 'Georgia State University',
    city: 'Atlanta', state: 'GA',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 70, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Kennesaw State University',
    city: 'Kennesaw', state: 'GA',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 70, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Georgia Piedmont Technical College',
    city: 'Clarkston', state: 'GA',
    program: 'Nursing / Associate Degree',
    teas: { overall: 62, reading: null, math: null, science: null, english: null },
  },
  // ── Florida ───────────────────────────────────────────────────────────────────
  {
    name: 'University of Florida',
    city: 'Gainesville', state: 'FL',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 74, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Florida State University',
    city: 'Tallahassee', state: 'FL',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 72, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Miami Dade College',
    city: 'Miami', state: 'FL',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Broward College',
    city: 'Fort Lauderdale', state: 'FL',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Valencia College',
    city: 'Orlando', state: 'FL',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  // ── Texas ─────────────────────────────────────────────────────────────────────
  {
    name: 'University of Texas at Austin',
    city: 'Austin', state: 'TX',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 75, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Texas A&M University',
    city: 'College Station', state: 'TX',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 72, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Houston Community College',
    city: 'Houston', state: 'TX',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Austin Community College',
    city: 'Austin', state: 'TX',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  // ── Ohio ──────────────────────────────────────────────────────────────────────
  {
    name: 'Ohio State University',
    city: 'Columbus', state: 'OH',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 73, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Cincinnati State Technical and Community College',
    city: 'Cincinnati', state: 'OH',
    program: 'Nursing / Associate Degree',
    teas: { overall: 62, reading: null, math: null, science: null, english: null },
  },
  // ── Michigan ──────────────────────────────────────────────────────────────────
  {
    name: 'University of Michigan',
    city: 'Ann Arbor', state: 'MI',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 78, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Wayne State University',
    city: 'Detroit', state: 'MI',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 70, reading: null, math: null, science: null, english: null },
  },
  // ── California ───────────────────────────────────────────────────────────────
  {
    name: 'UCLA School of Nursing',
    city: 'Los Angeles', state: 'CA',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 78, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'San Diego State University',
    city: 'San Diego', state: 'CA',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 72, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Los Angeles City College',
    city: 'Los Angeles', state: 'CA',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  // ── Arizona ───────────────────────────────────────────────────────────────────
  {
    name: 'Arizona State University',
    city: 'Tempe', state: 'AZ',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 70, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Maricopa Community Colleges',
    city: 'Phoenix', state: 'AZ',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  // ── Colorado ──────────────────────────────────────────────────────────────────
  {
    name: 'University of Colorado',
    city: 'Aurora', state: 'CO',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 72, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Community College of Denver',
    city: 'Denver', state: 'CO',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  // ── Nevada ────────────────────────────────────────────────────────────────────
  {
    name: 'University of Nevada Las Vegas',
    city: 'Las Vegas', state: 'NV',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'College of Southern Nevada',
    city: 'Las Vegas', state: 'NV',
    program: 'Nursing / Associate Degree',
    teas: { overall: 62, reading: null, math: null, science: null, english: null },
  },
  // ── New York ──────────────────────────────────────────────────────────────────
  {
    name: 'Columbia University School of Nursing',
    city: 'New York', state: 'NY',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 80, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'New York University Rory Meyers College',
    city: 'New York', state: 'NY',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 78, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'CUNY Borough of Manhattan Community College',
    city: 'New York', state: 'NY',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  // ── Pennsylvania ─────────────────────────────────────────────────────────────
  {
    name: 'University of Pennsylvania School of Nursing',
    city: 'Philadelphia', state: 'PA',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 80, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Thomas Jefferson University',
    city: 'Philadelphia', state: 'PA',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 72, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Community College of Philadelphia',
    city: 'Philadelphia', state: 'PA',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  // ── Illinois ──────────────────────────────────────────────────────────────────
  {
    name: 'University of Illinois Chicago',
    city: 'Chicago', state: 'IL',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 72, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Harper College',
    city: 'Palatine', state: 'IL',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
  // ── Washington ────────────────────────────────────────────────────────────────
  {
    name: 'University of Washington',
    city: 'Seattle', state: 'WA',
    program: 'Bachelor of Science in Nursing',
    teas: { overall: 75, reading: null, math: null, science: null, english: null },
  },
  {
    name: 'Bellevue College',
    city: 'Bellevue', state: 'WA',
    program: 'Nursing / Associate Degree',
    teas: { overall: 65, reading: null, math: null, science: null, english: null },
  },
]

export function searchSchools(query) {
  if (!query || query.trim().length < 2) return []
  const q = query.toLowerCase()
  return NURSING_SCHOOLS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q)
  ).slice(0, 8)
}
