export interface FundingScheme {
  id: string
  name: string
  organization: string
  type: "grant" | "loan" | "equity" | "subsidy" | "competition"
  amount: string
  eligibility: string[]
  deadline: string
  description: string
  websiteUrl: string
  stages: string[]
  categories: string[]
  isActive: boolean
}

export const FUNDING_SCHEMES: FundingScheme[] = [
  {
    id: "rkvy-raftaar",
    name: "RKVY-RAFTAAR",
    organization: "Department of Agriculture & Farmers Welfare",
    type: "grant",
    amount: "Up to ₹25 Lakhs",
    eligibility: [
      "Agritech startups registered in India",
      "Innovation in agriculture and allied sectors",
      "Incubated at RKVY-RAFTAAR approved incubators",
    ],
    deadline: "Rolling (Cohort-based)",
    description:
      "Remunerative Approaches for Agriculture and Allied Sector Rejuvenation provides grants to agri-startups through a network of knowledge partners and incubators across India.",
    websiteUrl: "https://rkvy.nic.in/",
    stages: ["IDEATION", "VALIDATION", "EARLY_TRACTION"],
    categories: ["all"],
    isActive: true,
  },
  {
    id: "startup-india-seed-fund",
    name: "Startup India Seed Fund Scheme (SISFS)",
    organization: "DPIIT",
    type: "grant",
    amount: "Up to ₹20 Lakhs (Grants) / ₹50 Lakhs (Debt/Convertible)",
    eligibility: [
      "DPIIT-recognized startups",
      "Incorporated not more than 2 years ago",
      "Not received more than ₹10 Lakhs in monetary support",
    ],
    deadline: "Rolling",
    description:
      "Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization through selected incubators.",
    websiteUrl: "https://seedfund.startupindia.gov.in/",
    stages: ["IDEATION", "VALIDATION"],
    categories: ["all"],
    isActive: true,
  },
  {
    id: "nabard-innovation-fund",
    name: "NABARD Innovation Fund",
    organization: "NABARD",
    type: "grant",
    amount: "₹10 Lakhs - ₹50 Lakhs",
    eligibility: [
      "Agritech startups and agri-entrepreneurs",
      "Solutions for rural and agriculture sector",
      "Registered entity in India",
    ],
    deadline: "Annual",
    description:
      "NABARD supports innovative ventures in agriculture, rural development, and allied sectors through its dedicated innovation fund and agri-business incubation programs.",
    websiteUrl: "https://www.nabard.org/",
    stages: ["VALIDATION", "EARLY_TRACTION", "GROWTH"],
    categories: [
      "market_linkage",
      "agri_fintech",
      "supply_chain",
      "storage_processing",
    ],
    isActive: true,
  },
  {
    id: "birac-big",
    name: "BIRAC BIG (Biotechnology Ignition Grant)",
    organization: "BIRAC",
    type: "grant",
    amount: "Up to ₹50 Lakhs",
    eligibility: [
      "Indian startups or companies",
      "Innovation in biotechnology and life sciences",
      "Novel technologies with proof of concept",
    ],
    deadline: "Rolling (Quarterly calls)",
    description:
      "BIG is a flagship scheme to foster biotech innovation in startups and entrepreneurs with novel ideas relevant to societal needs including agriculture and food tech.",
    websiteUrl: "https://www.birac.nic.in/big.php",
    stages: ["IDEATION", "VALIDATION"],
    categories: ["biotech", "precision_agriculture", "animal_husbandry"],
    isActive: true,
  },
  {
    id: "birac-sparsh",
    name: "BIRAC SPARSH (Social Innovation Programme)",
    organization: "BIRAC",
    type: "grant",
    amount: "Up to ₹10 Lakhs",
    eligibility: [
      "Individual innovators or student teams",
      "Social impact in healthcare, agriculture, or environment",
      "Indian nationals",
    ],
    deadline: "Annual",
    description:
      "SPARSH supports student innovators and budding entrepreneurs with social impact innovations in biotech, agriculture, and environmental sustainability.",
    websiteUrl: "https://www.birac.nic.in/sparsh.php",
    stages: ["IDEATION"],
    categories: ["biotech", "climate_tech"],
    isActive: true,
  },
  {
    id: "birac-pace",
    name: "BIRAC PACE (Promoting Academic Research Conversion to Enterprise)",
    organization: "BIRAC",
    type: "grant",
    amount: "Up to ₹30 Lakhs",
    eligibility: [
      "Academic researchers and institutions",
      "Novel biotech product or process",
      "Indian research institutions",
    ],
    deadline: "Rolling",
    description:
      "PACE supports the conversion of academic research into commercially viable biotech products and processes, including agri-biotech innovations.",
    websiteUrl: "https://www.birac.nic.in/pace.php",
    stages: ["IDEATION", "VALIDATION"],
    categories: ["biotech", "precision_agriculture"],
    isActive: true,
  },
  {
    id: "aim-atal-incubation",
    name: "Atal Incubation Centers (AIC)",
    organization: "Atal Innovation Mission, NITI Aayog",
    type: "grant",
    amount: "Up to ₹10 Crore (to incubator) / ₹10-25 Lakhs per startup",
    eligibility: [
      "Startups incubated at AICs",
      "Innovative solutions across sectors including agritech",
      "Early-stage ventures",
    ],
    deadline: "Rolling",
    description:
      "Atal Incubation Centers across India provide seed funding, mentorship, and infrastructure to early-stage startups including agritech ventures.",
    websiteUrl: "https://aim.gov.in/atal-incubation-centres.php",
    stages: ["IDEATION", "VALIDATION", "EARLY_TRACTION"],
    categories: ["all"],
    isActive: true,
  },
  {
    id: "sidbi-fund-of-funds",
    name: "Fund of Funds for Startups (FFS)",
    organization: "SIDBI",
    type: "equity",
    amount: "₹50 Lakhs - ₹5 Crore (via SEBI-registered AIFs)",
    eligibility: [
      "DPIIT-recognized startups",
      "Investment via SEBI-registered AIFs",
      "High-growth potential ventures",
    ],
    deadline: "Rolling",
    description:
      "SIDBI manages the Fund of Funds with a corpus of ₹10,000 Crore, providing equity funding to startups through SEBI-registered Alternative Investment Funds.",
    websiteUrl: "https://www.sidbi.in/en/fund-of-funds",
    stages: ["EARLY_TRACTION", "GROWTH", "SCALING"],
    categories: ["all"],
    isActive: true,
  },
  {
    id: "icar-naif",
    name: "ICAR National Agricultural Innovation Fund",
    organization: "ICAR",
    type: "grant",
    amount: "Up to ₹25 Lakhs",
    eligibility: [
      "Agri-innovators and startups",
      "Innovation in crop science, horticulture, or animal sciences",
      "Collaboration with ICAR institutes preferred",
    ],
    deadline: "Annual",
    description:
      "ICAR provides research grants and innovation funding to promote cutting-edge agricultural technologies, smart farming, and post-harvest innovation.",
    websiteUrl: "https://icar.org.in/",
    stages: ["IDEATION", "VALIDATION"],
    categories: [
      "precision_agriculture",
      "biotech",
      "animal_husbandry",
      "aquaculture",
    ],
    isActive: true,
  },
  {
    id: "maharashtra-startup-yojana",
    name: "Maharashtra State Innovation & Startup Policy",
    organization: "Government of Maharashtra",
    type: "subsidy",
    amount: "Up to ₹15 Lakhs (seed support) + stamp duty reimbursement",
    eligibility: [
      "Startups registered in Maharashtra",
      "DPIIT-recognized or state-recognized",
      "Less than 5 years old",
    ],
    deadline: "Rolling",
    description:
      "Maharashtra offers seed funding, patent cost reimbursement, stamp duty benefits, and incubation support for startups registered in the state.",
    websiteUrl: "https://startup.maharashtra.gov.in/",
    stages: ["IDEATION", "VALIDATION", "EARLY_TRACTION"],
    categories: ["all"],
    isActive: true,
  },
  {
    id: "karnataka-elevate",
    name: "Karnataka ELEVATE Programme",
    organization: "Government of Karnataka (Startup Cell)",
    type: "grant",
    amount: "Up to ₹50 Lakhs",
    eligibility: [
      "Startups registered in Karnataka",
      "Innovative product or service",
      "Less than 7 years old",
    ],
    deadline: "Annual (Cohort-based)",
    description:
      "Karnataka ELEVATE identifies and nurtures innovative startups through seed funding, mentorship, and market access support via the state startup ecosystem.",
    websiteUrl: "https://startup.karnataka.gov.in/",
    stages: ["VALIDATION", "EARLY_TRACTION", "GROWTH"],
    categories: ["all"],
    isActive: true,
  },
  {
    id: "agri-udaan",
    name: "Agri UDAAN (Food Accelerator)",
    organization: "a-IDEA, NAARM (ICAR)",
    type: "competition",
    amount: "Mentorship + ₹5-25 Lakhs in prizes & investment linkage",
    eligibility: [
      "Agritech and food-tech startups",
      "Scalable business model",
      "Indian startups in food and agri value chain",
    ],
    deadline: "Annual (Cohort-based)",
    description:
      "Agri UDAAN is a food and agribusiness accelerator that provides mentoring, industry connects, and investor linkage for startups in the agri value chain.",
    websiteUrl: "https://aidea-india.org/agri-udaan/",
    stages: ["EARLY_TRACTION", "GROWTH"],
    categories: [
      "market_linkage",
      "supply_chain",
      "storage_processing",
      "agri_fintech",
    ],
    isActive: true,
  },
  {
    id: "mudra-loan",
    name: "MUDRA Loan (Pradhan Mantri MUDRA Yojana)",
    organization: "MUDRA / Banks",
    type: "loan",
    amount: "Up to ₹10 Lakhs (Shishu: ₹50K / Kishore: ₹5L / Tarun: ₹10L)",
    eligibility: [
      "Micro and small enterprises",
      "Non-corporate, non-farm small businesses",
      "Indian citizen entrepreneurs",
    ],
    deadline: "Rolling",
    description:
      "MUDRA loans provide collateral-free credit to micro and small enterprises across three tiers, supporting agri-entrepreneurs to scale their businesses.",
    websiteUrl: "https://www.mudra.org.in/",
    stages: ["VALIDATION", "EARLY_TRACTION"],
    categories: ["all"],
    isActive: true,
  },
  {
    id: "rashtriya-krishi-vikas",
    name: "Sub-Mission on Agricultural Mechanization (SMAM)",
    organization: "Ministry of Agriculture",
    type: "subsidy",
    amount: "25-50% subsidy on farm machinery and equipment",
    eligibility: [
      "Farmers, FPOs, and agri-enterprises",
      "Custom Hiring Centres and Farm Machinery Banks",
      "Projects promoting farm mechanization",
    ],
    deadline: "Rolling",
    description:
      "SMAM provides subsidies for farm machinery and equipment purchase, supporting startups building mechanization and automation solutions for Indian agriculture.",
    websiteUrl: "https://agrimachinery.nic.in/",
    stages: ["EARLY_TRACTION", "GROWTH", "SCALING"],
    categories: ["robotics", "drone_tech", "iot_sensors"],
    isActive: true,
  },
  {
    id: "agri-infra-fund",
    name: "Agriculture Infrastructure Fund (AIF)",
    organization: "Ministry of Agriculture / NABARD",
    type: "loan",
    amount: "Up to ₹2 Crore (3% interest subvention + CGTMSE guarantee)",
    eligibility: [
      "FPOs, agri-entrepreneurs, startups",
      "Post-harvest management infrastructure",
      "Community farming assets",
    ],
    deadline: "Rolling (until 2032-33)",
    description:
      "AIF provides medium to long-term credit with interest subvention for post-harvest management, cold chain, and community farming infrastructure projects.",
    websiteUrl: "https://agriinfra.dac.gov.in/",
    stages: ["EARLY_TRACTION", "GROWTH", "SCALING"],
    categories: ["supply_chain", "storage_processing"],
    isActive: true,
  },
]
