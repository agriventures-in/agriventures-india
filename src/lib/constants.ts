export const TECH_CATEGORIES = [
  { value: "precision_agriculture", label: "Precision Agriculture", icon: "Target" },
  { value: "biotech", label: "Biotech & Genetics", icon: "Dna" },
  { value: "market_linkage", label: "Market Linkage & D2C", icon: "ShoppingCart" },
  { value: "agri_fintech", label: "Agri-Fintech & Insurance", icon: "Wallet" },
  { value: "climate_tech", label: "Climate Tech", icon: "CloudSun" },
  { value: "robotics", label: "Robotics & Automation", icon: "Bot" },
  { value: "supply_chain", label: "Supply Chain & Logistics", icon: "Truck" },
  { value: "iot_sensors", label: "IoT & Sensors", icon: "Cpu" },
  { value: "drone_tech", label: "Drone Technology", icon: "Plane" },
  { value: "storage_processing", label: "Storage & Processing", icon: "Warehouse" },
  { value: "animal_husbandry", label: "Animal Husbandry", icon: "Heart" },
  { value: "aquaculture", label: "Aquaculture & Fisheries", icon: "Fish" },
] as const;

export const STARTUP_STAGES = [
  { value: "IDEATION", label: "Idea / Concept" },
  { value: "VALIDATION", label: "Working Prototype / MVP" },
  { value: "EARLY_TRACTION", label: "Early Revenue" },
  { value: "GROWTH", label: "Growth Stage" },
  { value: "SCALING", label: "Scaling / Series A+" },
] as const;

export const FUNDING_STATUSES = [
  { value: "bootstrapped", label: "Bootstrapped" },
  { value: "grant", label: "Grant Funded" },
  { value: "angel", label: "Angel Invested" },
  { value: "pre_seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series_a", label: "Series A" },
  { value: "series_b_plus", label: "Series B+" },
] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export const VERIFICATION_LEVELS = {
  NONE: { label: "Unverified", color: "gray", description: "Not yet verified" },
  COMMUNITY: {
    label: "Community Verified",
    color: "blue",
    description: "Validated by 50+ community upvotes",
  },
  EXPERT: {
    label: "Expert Verified",
    color: "emerald",
    description: "Reviewed and approved by AgriVentures experts",
  },
  FULL: {
    label: "Fully Verified",
    color: "emerald",
    description: "Third-party validated with full evidence review",
  },
} as const;

export const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full-Time" },
  { value: "PART_TIME", label: "Part-Time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
] as const;
