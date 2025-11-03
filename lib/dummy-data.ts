export interface Project {
  id: string;
  name: string;
  location: string;
  status: string;
  progress: number;
  totalUnits: number;
  soldUnits: number;
  budget: string;
  spent: string;
  startDate: string;
  expectedCompletion: string;
  client: string;
  clientContact: string;
  clientEmail: string;
  totalArea: string;
  type: string;
  floors: number;
  pendingPayments: string;
  nextMilestone: string;
  approvals: string[];
  contractors: string[];
  pendingTasks: string[];
  recentUpdates: Array<{ date: string; update: string }>;
}

export const dummyProjects: Project[] = [
  {
    id: "1",
    name: "Sunshine Apartments",
    location: "Bhubaneswar, Odisha",
    status: "In Progress",
    progress: 65,
    totalUnits: 24,
    soldUnits: 18,
    budget: "₹12 Cr",
    spent: "₹7.8 Cr",
    startDate: "Jan 2024",
    expectedCompletion: "Dec 2025",
    client: "Sunshine Developers Pvt Ltd",
    clientContact: "+91 98765 43210",
    clientEmail: "contact@sunshine.com",
    totalArea: "45,000 sq ft",
    type: "Residential",
    floors: 6,
    pendingPayments: "₹2.5 Cr",
    nextMilestone: "Foundation completion",
    approvals: ["Building Plan Approved", "Environmental Clearance", "Fire NOC Pending"],
    contractors: ["ABC Construction", "XYZ Interiors"],
    pendingTasks: [
      "Complete 4th floor slab work",
      "Install elevators",
      "Electrical wiring - Block A"
    ],
    recentUpdates: [
      { date: "Nov 1, 2024", update: "3rd floor completed" },
      { date: "Oct 28, 2024", update: "Payment received - ₹50L" },
      { date: "Oct 20, 2024", update: "Plumbing work started" }
    ]
  },
  {
    id: "2",
    name: "Green Valley Residency",
    location: "Cuttack, Odisha",
    status: "Planning",
    progress: 15,
    totalUnits: 36,
    soldUnits: 8,
    budget: "₹18 Cr",
    spent: "₹2.7 Cr",
    startDate: "Mar 2024",
    expectedCompletion: "Jun 2026",
    client: "Green Valley Constructions",
    clientContact: "+91 98765 43211",
    clientEmail: "info@greenvalley.com",
    totalArea: "72,000 sq ft",
    type: "Residential",
    floors: 8,
    pendingPayments: "₹1.2 Cr",
    nextMilestone: "Site excavation",
    approvals: ["Building Plan Submitted", "Environmental Clearance Pending"],
    contractors: ["DEF Builders"],
    pendingTasks: [
      "Complete soil testing",
      "Finalize architectural drawings",
      "Get building plan approval"
    ],
    recentUpdates: [
      { date: "Oct 30, 2024", update: "Site survey completed" },
      { date: "Oct 25, 2024", update: "Architect finalized" }
    ]
  },
  {
    id: "3",
    name: "Royal Heights",
    location: "Brahmapur, Odisha",
    status: "In Progress",
    progress: 85,
    totalUnits: 16,
    soldUnits: 16,
    budget: "₹8 Cr",
    spent: "₹6.8 Cr",
    startDate: "Aug 2023",
    expectedCompletion: "Mar 2025",
    client: "Royal Estates Ltd",
    clientContact: "+91 98765 43212",
    clientEmail: "royal@estates.com",
    totalArea: "28,000 sq ft",
    type: "Residential",
    floors: 4,
    pendingPayments: "₹80L",
    nextMilestone: "Interior finishing",
    approvals: ["All Approvals Received"],
    contractors: ["Royal Contractors", "Elite Interiors"],
    pendingTasks: [
      "Complete painting - All floors",
      "Install kitchen fixtures",
      "Landscaping work"
    ],
    recentUpdates: [
      { date: "Nov 2, 2024", update: "Flooring completed" },
      { date: "Oct 29, 2024", update: "Electrical work finished" }
    ]
  },
  {
    id: "4",
    name: "Pearl Gardens",
    location: "Puri, Odisha",
    status: "Completed",
    progress: 100,
    totalUnits: 12,
    soldUnits: 12,
    budget: "₹6 Cr",
    spent: "₹5.8 Cr",
    startDate: "Jan 2023",
    expectedCompletion: "Dec 2023",
    client: "Pearl Developers",
    clientContact: "+91 98765 43213",
    clientEmail: "pearl@developers.com",
    totalArea: "20,000 sq ft",
    type: "Residential",
    floors: 3,
    pendingPayments: "₹0",
    nextMilestone: "Handover complete",
    approvals: ["Occupancy Certificate Received"],
    contractors: ["Pearl Constructions"],
    pendingTasks: [],
    recentUpdates: [
      { date: "Dec 28, 2023", update: "Project handed over" },
      { date: "Dec 20, 2023", update: "Occupancy certificate received" }
    ]
  },
  {
    id: "5",
    name: "Ocean View Towers",
    location: "Puri, Odisha",
    status: "In Progress",
    progress: 45,
    totalUnits: 48,
    soldUnits: 32,
    budget: "₹25 Cr",
    spent: "₹11.25 Cr",
    startDate: "Oct 2023",
    expectedCompletion: "Dec 2025",
    client: "Ocean Developers Pvt Ltd",
    clientContact: "+91 98765 43214",
    clientEmail: "ocean@developers.com",
    totalArea: "95,000 sq ft",
    type: "Residential",
    floors: 10,
    pendingPayments: "₹4.5 Cr",
    nextMilestone: "5th floor completion",
    approvals: ["Building Plan Approved", "Fire NOC Approved"],
    contractors: ["Ocean Builders", "Coastal Interiors", "Marine Electricals"],
    pendingTasks: [
      "Complete 5th floor slab",
      "Install elevators",
      "Plumbing - Blocks B & C",
      "Boundary wall construction"
    ],
    recentUpdates: [
      { date: "Nov 3, 2024", update: "4th floor completed" },
      { date: "Oct 31, 2024", update: "10 units sold - Block C" },
      { date: "Oct 27, 2024", update: "Payment received - ₹1.2 Cr" }
    ]
  }
];