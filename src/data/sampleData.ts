import { UserRole } from '@/contexts/AuthContext';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  receiptUrl?: string;
  addedBy: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Budget {
  totalBudget: number;
  totalExpenses: number;
  remainingBalance: number;
  categories: {
    name: string;
    allocated: number;
    spent: number;
  }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isPublic: boolean;
  author: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isPublic: boolean;
}

export interface Officer {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  bio: string;
  avatar: string;
  termStart: string;
}

export const sampleBudget: Budget = {
  totalBudget: 50000,
  totalExpenses: 28750,
  remainingBalance: 21250,
  categories: [
    { name: 'Events', allocated: 15000, spent: 8500 },
    { name: 'Supplies', allocated: 8000, spent: 4200 },
    { name: 'Marketing', allocated: 7000, spent: 3800 },
    { name: 'Technology', allocated: 10000, spent: 6200 },
    { name: 'Travel', allocated: 5000, spent: 2050 },
    { name: 'Miscellaneous', allocated: 5000, spent: 4000 }
  ]
};

export const sampleExpenses: Expense[] = [
  {
    id: '1',
    title: 'Welcome Week Decorations',
    amount: 450,
    category: 'Events',
    date: '2024-01-15',
    description: 'Banners, balloons, and decoration materials for welcome week',
    addedBy: 'Alex Johnson',
    status: 'approved'
  },
  {
    id: '2',
    title: 'Office Supplies',
    amount: 120,
    category: 'Supplies',
    date: '2024-01-20',
    description: 'Pens, notebooks, folders for office use',
    addedBy: 'Sarah Chen',
    status: 'approved'
  },
  {
    id: '3',
    title: 'Website Hosting',
    amount: 180,
    category: 'Technology',
    date: '2024-01-25',
    description: 'Annual website hosting and domain renewal',
    addedBy: 'Marcus Williams',
    status: 'approved'
  },
  {
    id: '4',
    title: 'Student Event Catering',
    amount: 850,
    category: 'Events',
    date: '2024-02-01',
    description: 'Catering for student orientation event',
    addedBy: 'Alex Johnson',
    status: 'pending'
  },
  {
    id: '5',
    title: 'Promotional Flyers',
    amount: 200,
    category: 'Marketing',
    date: '2024-02-05',
    description: 'Printing costs for promotional materials',
    addedBy: 'Sarah Chen',
    status: 'approved'
  }
];

export const sampleAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome Back Students!',
    content: 'The SBO welcomes all students back for the new semester. We have exciting events planned!',
    date: '2024-01-15',
    isPublic: true,
    author: 'Alex Johnson'
  },
  {
    id: '2',
    title: 'Budget Review Meeting',
    content: 'Monthly budget review scheduled for next Friday at 3 PM in the SBO office.',
    date: '2024-01-20',
    isPublic: false,
    author: 'Sarah Chen'
  },
  {
    id: '3',
    title: 'Spring Festival Planning',
    content: 'Planning meeting for the annual spring festival. All committee members should attend.',
    date: '2024-02-01',
    isPublic: true,
    author: 'Marcus Williams'
  }
];

export const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Student Orientation',
    description: 'Welcome event for new students with activities and information sessions',
    date: '2024-02-15',
    time: '10:00 AM',
    location: 'Main Auditorium',
    isPublic: true
  },
  {
    id: '2',
    title: 'Budget Planning Session',
    description: 'Internal session for planning next semester budget allocation',
    date: '2024-02-20',
    time: '2:00 PM', 
    location: 'SBO Office',
    isPublic: false
  },
  {
    id: '3',
    title: 'Spring Festival',
    description: 'Annual spring celebration with food, music, and activities',
    date: '2024-03-15',
    time: '12:00 PM',
    location: 'Campus Quad',
    isPublic: true
  }
];

export const sampleOfficers: Officer[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'President',
    email: 'president@sbo.edu',
    bio: 'Senior majoring in Business Administration. Passionate about student representation and campus improvement.',
    avatar: '/api/placeholder/200/200',
    termStart: '2023-09-01'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Auditor',
    email: 'auditor@sbo.edu',
    bio: 'Junior studying Accounting and Finance. Dedicated to financial transparency and responsible budget management.',
    avatar: '/api/placeholder/200/200',
    termStart: '2023-09-01'
  },
  {
    id: '3',
    name: 'Marcus Williams',
    role: 'Secretary',
    email: 'secretary@sbo.edu',
    bio: 'Sophomore in Communications. Focused on keeping students informed and engaged with SBO activities.',
    avatar: '/api/placeholder/200/200',
    termStart: '2023-09-01'
  }
];