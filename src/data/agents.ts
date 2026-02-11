export interface Agent {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  city: string;
  specialization: string[];
  bio: string;
  rating: number;
  propertiesCount: number;
  experience: number;
  languages: string[];
}

export const agents: Agent[] = [
  {
    id: '1',
    name: 'Amit Sharma',
    photo: 'https://source.unsplash.com/400x400/?indian,man,portrait&sig=11',
    phone: '+91 98765 43210',
    email: 'amit.sharma@ncrrealtyhub.in',
    city: 'Noida',
    specialization: ['Luxury Apartments', 'Noida Expressway'],
    bio: 'Amit has helped 500+ families find premium homes across Noida sectors. Known for transparent guidance and strong builder relationships.',
    rating: 4.9,
    propertiesCount: 28,
    experience: 12,
    languages: ['Hindi', 'English'],
  },
  {
    id: '2',
    name: 'Neha Gupta',
    photo: 'https://source.unsplash.com/400x400/?indian,woman,portrait&sig=12',
    phone: '+91 98765 43211',
    email: 'neha.gupta@ncrrealtyhub.in',
    city: 'Noida',
    specialization: ['Ready to Move', 'Family Homes'],
    bio: 'Neha specializes in ready-to-move flats and gated societies around Sector 104, 100, and 110.',
    rating: 4.8,
    propertiesCount: 22,
    experience: 9,
    languages: ['Hindi', 'English'],
  },
  {
    id: '3',
    name: 'Rohit Verma',
    photo: 'https://source.unsplash.com/400x400/?indian,man,portrait&sig=13',
    phone: '+91 98765 43212',
    email: 'rohit.verma@ncrrealtyhub.in',
    city: 'Greater Noida',
    specialization: ['New Projects', 'Investment'],
    bio: 'Rohit focuses on new launches and high-growth investment corridors in Greater Noida and Techzone 4.',
    rating: 4.7,
    propertiesCount: 19,
    experience: 8,
    languages: ['Hindi', 'English'],
  },
  {
    id: '4',
    name: 'Priya Singh',
    photo: 'https://source.unsplash.com/400x400/?indian,woman,portrait&sig=14',
    phone: '+91 98765 43213',
    email: 'priya.singh@ncrrealtyhub.in',
    city: 'Greater Noida',
    specialization: ['Villas', 'Plots'],
    bio: 'Priya advises buyers for villa plots and premium independent homes near Pari Chowk and Knowledge Park.',
    rating: 4.8,
    propertiesCount: 16,
    experience: 10,
    languages: ['Hindi', 'English'],
  },
  {
    id: '5',
    name: 'Arjun Mehta',
    photo: 'https://source.unsplash.com/400x400/?indian,man,portrait&sig=15',
    phone: '+91 98765 43214',
    email: 'arjun.mehta@ncrrealtyhub.in',
    city: 'Delhi NCR',
    specialization: ['Luxury', 'Second Homes'],
    bio: 'Arjun helps HNIs and NRIs invest in luxury flats across Noida-Greater Noida Expressway and East Delhi.',
    rating: 4.9,
    propertiesCount: 25,
    experience: 13,
    languages: ['Hindi', 'English'],
  },
  {
    id: '6',
    name: 'Kavita Rao',
    photo: 'https://source.unsplash.com/400x400/?indian,woman,portrait&sig=16',
    phone: '+91 98765 43215',
    email: 'kavita.rao@ncrrealtyhub.in',
    city: 'Ghaziabad',
    specialization: ['Indirapuram', 'Vaishali'],
    bio: 'Kavita has deep experience in East NCR, helping clients find well-connected societies near metro corridors.',
    rating: 4.7,
    propertiesCount: 18,
    experience: 11,
    languages: ['Hindi', 'English'],
  },
  {
    id: '7',
    name: 'Siddharth Jain',
    photo: 'https://source.unsplash.com/400x400/?indian,man,portrait&sig=17',
    phone: '+91 98765 43216',
    email: 'siddharth.jain@ncrrealtyhub.in',
    city: 'Noida',
    specialization: ['Noida Expressway', 'High Rise'],
    bio: 'Siddharth is known for detailed project comparisons and on-ground site visits across Sector 137 and 150.',
    rating: 4.8,
    propertiesCount: 21,
    experience: 9,
    languages: ['Hindi', 'English'],
  },
  {
    id: '8',
    name: 'Ananya Kapoor',
    photo: 'https://source.unsplash.com/400x400/?indian,woman,portrait&sig=18',
    phone: '+91 98765 43217',
    email: 'ananya.kapoor@ncrrealtyhub.in',
    city: 'Noida',
    specialization: ['Commercial', 'Retail'],
    bio: 'Ananya works with startups and retail brands to secure prime commercial offices and shops in Sector 62 and Sector 110.',
    rating: 4.6,
    propertiesCount: 14,
    experience: 7,
    languages: ['Hindi', 'English'],
  },
];
