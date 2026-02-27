import { PrismaClient, UserRole, StartupStage, StartupStatus, VerificationLevel, ArticleCategory, JobType } from "@prisma/client"
import { hashSync } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Clean up existing data in reverse dependency order
  await prisma.upvote.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.job.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.verificationRequest.deleteMany()
  await prisma.knowledgeArticle.deleteMany()
  await prisma.investorProfile.deleteMany()
  await prisma.startup.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  console.log("Cleared existing data.")

  const hashedPassword = hashSync("Admin123!", 12)
  const founderPassword = hashSync("Founder123!", 12)
  const investorPassword = hashSync("Investor123!", 12)
  const communityPassword = hashSync("Community123!", 12)

  // ─── USERS ─────────────────────────────────────────────────────────

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@agriventures.in",
      fullName: "Admin User",
      hashedPassword,
      role: UserRole.ADMIN,
      bio: "Platform administrator for AgriVentures India.",
      organization: "AgriVentures India",
    },
  })
  console.log("Created admin:", admin.email)

  // Founders
  const founder1 = await prisma.user.create({
    data: {
      email: "rajesh.kumar@cropwise.in",
      fullName: "Rajesh Kumar",
      hashedPassword: founderPassword,
      role: UserRole.FOUNDER,
      phone: "+91-9876543210",
      linkedinUrl: "https://linkedin.com/in/rajeshkumar-agri",
      organization: "CropWise Technologies",
      bio: "IIT Kanpur alumnus with 8 years in precision agriculture. Built satellite-based crop monitoring systems used by 50,000+ farmers across UP and MP.",
    },
  })

  const founder2 = await prisma.user.create({
    data: {
      email: "priya.sharma@greengenomics.in",
      fullName: "Priya Sharma",
      hashedPassword: founderPassword,
      role: UserRole.FOUNDER,
      phone: "+91-9845123456",
      linkedinUrl: "https://linkedin.com/in/priyasharma-biotech",
      organization: "GreenGenomics India",
      bio: "PhD in Plant Biotechnology from IARI. Leading research on drought-resistant wheat varieties adapted for semi-arid regions of Rajasthan.",
    },
  })

  const founder3 = await prisma.user.create({
    data: {
      email: "arun.nair@farmconnect.in",
      fullName: "Arun Nair",
      hashedPassword: founderPassword,
      role: UserRole.FOUNDER,
      phone: "+91-9012345678",
      linkedinUrl: "https://linkedin.com/in/arunnair-fintech",
      organization: "FarmConnect India",
      bio: "Ex-Flipkart product lead turned agritech entrepreneur. Building India's largest direct farmer-to-retailer marketplace eliminating 4 middlemen layers.",
    },
  })

  console.log("Created 3 founders.")

  // Investors
  const investor1 = await prisma.user.create({
    data: {
      email: "meera.patel@omnivorevc.in",
      fullName: "Meera Patel",
      hashedPassword: investorPassword,
      role: UserRole.INVESTOR,
      phone: "+91-9988776655",
      linkedinUrl: "https://linkedin.com/in/meerapatel-vc",
      organization: "Omnivore Partners",
      bio: "Partner at Omnivore Partners, India's leading agritech-focused VC fund. Invested in 35+ agrifood startups across seed to Series B stages.",
    },
  })

  const investor2 = await prisma.user.create({
    data: {
      email: "vikram.sinha@agrofund.in",
      fullName: "Vikram Sinha",
      hashedPassword: investorPassword,
      role: UserRole.INVESTOR,
      phone: "+91-9876501234",
      linkedinUrl: "https://linkedin.com/in/vikramsinha-invest",
      organization: "AgroFund Capital",
      bio: "Managing Director at AgroFund Capital. 15 years in agribusiness PE/VC. Board member of FICCI Agri Committee. Focus on climate-resilient agritech.",
    },
  })

  console.log("Created 2 investors.")

  // Community members
  const community1 = await prisma.user.create({
    data: {
      email: "anita.desai@gmail.com",
      fullName: "Anita Desai",
      hashedPassword: communityPassword,
      role: UserRole.COMMUNITY,
      bio: "Agricultural scientist at ICAR-IARI. Interested in agritech innovation transfer to smallholder farmers.",
      organization: "ICAR-IARI",
    },
  })

  const community2 = await prisma.user.create({
    data: {
      email: "suresh.reddy@gmail.com",
      fullName: "Suresh Reddy",
      hashedPassword: communityPassword,
      role: UserRole.COMMUNITY,
      bio: "Progressive farmer from Telangana. 200 acres under precision agriculture. Keen on adopting new agritech solutions.",
    },
  })

  const community3 = await prisma.user.create({
    data: {
      email: "fatima.khan@outlook.com",
      fullName: "Fatima Khan",
      hashedPassword: communityPassword,
      role: UserRole.COMMUNITY,
      bio: "Agri-journalist and author. Writing about farm-tech adoption in rural India for The Hindu BusinessLine.",
      organization: "The Hindu BusinessLine",
    },
  })

  const community4 = await prisma.user.create({
    data: {
      email: "deepak.joshi@iima.ac.in",
      fullName: "Deepak Joshi",
      hashedPassword: communityPassword,
      role: UserRole.COMMUNITY,
      bio: "MBA student at IIM Ahmedabad focused on agribusiness management. Researching FPO digital transformation.",
      organization: "IIM Ahmedabad",
    },
  })

  const community5 = await prisma.user.create({
    data: {
      email: "lakshmi.subramanian@tnau.ac.in",
      fullName: "Lakshmi Subramanian",
      hashedPassword: communityPassword,
      role: UserRole.COMMUNITY,
      bio: "Professor of Agricultural Engineering at TNAU. Advisor to state government on agritech policy.",
      organization: "Tamil Nadu Agricultural University",
    },
  })

  console.log("Created 5 community members.")

  // ─── STARTUPS ──────────────────────────────────────────────────────

  const startup1 = await prisma.startup.create({
    data: {
      founderId: founder1.id,
      name: "CropWise Technologies",
      slug: "cropwise-technologies",
      tagline: "Satellite-powered precision agriculture for smallholder farmers",
      description:
        "CropWise Technologies democratizes satellite-based crop monitoring for India's 120 million smallholder farmers. Our AI platform processes multi-spectral satellite imagery to provide real-time crop health assessments, pest outbreak predictions, and irrigation scheduling recommendations in 12 Indian languages via a simple WhatsApp interface. We have reduced crop losses by an average of 23% across our pilot farms in Uttar Pradesh and Madhya Pradesh, directly improving farmer incomes by Rs. 15,000-25,000 per season.",
      websiteUrl: "https://cropwise.in",
      foundedYear: 2021,
      stage: StartupStage.EARLY_TRACTION,
      techCategory: "precision_agriculture",
      subCategories: ["satellite_imaging", "ai_ml", "whatsapp_commerce"],
      state: "Uttar Pradesh",
      district: "Lucknow",
      teamSize: 18,
      fundingStatus: "Seed Funded",
      fundingAmount: "Rs. 2.5 Crore",
      problemStatement:
        "Indian smallholder farmers (<2 hectares) lose 15-25% of their crop annually due to delayed detection of pests, diseases, and water stress. Existing precision agriculture tools are designed for large Western farms and priced out of reach for Indian farmers.",
      solution:
        "AI-powered satellite crop monitoring delivered through WhatsApp in local languages. No app download required. Works on basic smartphones. Costs farmers just Rs. 500/season covering up to 5 acres.",
      businessModel:
        "B2B2C model: Partner with FPOs, state agriculture departments, and agri-input companies. Rs. 500/farmer/season for direct users. Enterprise API for agri-lenders and insurance companies at Rs. 50/acre/season.",
      impactMetrics: {
        farmersReached: 52000,
        avgIncomeIncrease: "22%",
        cropLossReduction: "23%",
        waterSavings: "30%",
        statesCovered: 4,
        languagesSupported: 5,
      },
      fieldTrialData: {
        trialCount: 12,
        avgYieldIncrease: "18%",
        partnerInstitutions: ["ICAR-IARI", "UP Agriculture Dept", "NABARD"],
      },
      socialLinks: { twitter: "https://twitter.com/cropwise_in", linkedin: "https://linkedin.com/company/cropwise" },
      status: StartupStatus.VERIFIED,
      verificationLevel: VerificationLevel.EXPERT,
      upvoteCount: 142,
      viewCount: 3200,
      isFeatured: true,
    },
  })

  const startup2 = await prisma.startup.create({
    data: {
      founderId: founder2.id,
      name: "GreenGenomics India",
      slug: "greengenomics-india",
      tagline: "Climate-resilient crop varieties through genomic breeding",
      description:
        "GreenGenomics India accelerates the development of climate-resilient crop varieties using CRISPR-based genomic editing and marker-assisted breeding. Our platform has developed 3 drought-tolerant wheat varieties and 2 salinity-resistant rice varieties specifically adapted for Indian agro-climatic zones. We partner with ICAR institutes and state seed corporations for variety testing and commercialization, targeting the Rs. 30,000 crore Indian seed market.",
      websiteUrl: "https://greengenomics.in",
      foundedYear: 2020,
      stage: StartupStage.GROWTH,
      techCategory: "biotech",
      subCategories: ["genomics", "crispr", "seed_technology"],
      state: "Rajasthan",
      district: "Jodhpur",
      teamSize: 25,
      fundingStatus: "Series A",
      fundingAmount: "Rs. 12 Crore",
      problemStatement:
        "Climate change is reducing wheat yields by 6-8% per decade in India's breadbasket regions. Traditional breeding takes 10-12 years to develop new varieties. Indian farmers need climate-adapted seeds urgently to maintain food security.",
      solution:
        "Genomic-assisted breeding platform that reduces variety development time from 12 years to 4 years. Focus on drought, heat, and salinity tolerance traits most relevant to Indian farming conditions.",
      businessModel:
        "Licensing genomic traits to seed companies (Rs. 2-5 Crore per trait license). Direct seed sales through FPO partnerships. Government contracts for climate adaptation research.",
      impactMetrics: {
        varietiesDeveloped: 5,
        yieldImprovementPercent: 15,
        waterReductionPercent: 35,
        farmersInTrials: 8000,
        researchPartners: 7,
      },
      fieldTrialData: {
        trialCount: 24,
        locations: ["Jodhpur", "Jaisalmer", "Bikaner", "Barmer"],
        avgYieldIncrease: "15-22%",
      },
      socialLinks: { twitter: "https://twitter.com/greengenomics_in" },
      status: StartupStatus.VERIFIED,
      verificationLevel: VerificationLevel.FULL,
      upvoteCount: 198,
      viewCount: 4100,
      isFeatured: true,
    },
  })

  const startup3 = await prisma.startup.create({
    data: {
      founderId: founder3.id,
      name: "FarmConnect India",
      slug: "farmconnect-india",
      tagline: "Direct farmer-to-retailer marketplace eliminating middlemen",
      description:
        "FarmConnect India is a B2B marketplace connecting farmers and FPOs directly with retailers, restaurants, and food processors. Our platform handles price discovery, quality grading (using AI image recognition), logistics coordination, and digital payments. We have onboarded 2,400+ farmers and 350+ buyers across Karnataka and Tamil Nadu, processing over Rs. 45 Crore in GMV annually.",
      websiteUrl: "https://farmconnect.in",
      foundedYear: 2022,
      stage: StartupStage.EARLY_TRACTION,
      techCategory: "market_linkage",
      subCategories: ["marketplace", "supply_chain", "digital_payments"],
      state: "Karnataka",
      district: "Bengaluru",
      teamSize: 22,
      fundingStatus: "Pre-Series A",
      fundingAmount: "Rs. 4 Crore",
      problemStatement:
        "Indian farmers receive only 25-30% of the consumer price due to 4-5 layers of intermediaries. Post-harvest losses exceed 16% for fruits and vegetables. Lack of transparent price discovery leads to exploitation at mandis.",
      solution:
        "AI-powered marketplace with automated quality grading, real-time price discovery from 500+ mandis, and integrated cold-chain logistics. Farmers get 40-60% higher realizations compared to traditional mandi sales.",
      businessModel:
        "Transaction fee of 2-3% from buyers. Logistics commission of 5-8% on managed shipments. Premium listing fees for large buyers. Working capital financing (coming soon).",
      impactMetrics: {
        farmersOnboarded: 2400,
        buyersActive: 350,
        annualGMV: "Rs. 45 Crore",
        avgPriceIncrease: "45%",
        postHarvestLossReduction: "12%",
      },
      socialLinks: { twitter: "https://twitter.com/farmconnect_in", linkedin: "https://linkedin.com/company/farmconnect-india" },
      status: StartupStatus.VERIFIED,
      verificationLevel: VerificationLevel.COMMUNITY,
      upvoteCount: 87,
      viewCount: 1850,
      isFeatured: false,
    },
  })

  const startup4 = await prisma.startup.create({
    data: {
      founderId: founder1.id,
      name: "KisanPay",
      slug: "kisanpay",
      tagline: "Digital lending and insurance for underserved farming communities",
      description:
        "KisanPay provides micro-lending, crop insurance, and digital payment solutions tailored for smallholder farmers who are excluded from traditional banking. Using alternative credit scoring based on satellite crop data, soil health cards, and mandi transaction history, we have disbursed over Rs. 8 Crore in micro-loans with an NPA ratio below 3%. Our parametric weather insurance product covers 15,000+ farmers in drought-prone regions.",
      websiteUrl: "https://kisanpay.in",
      foundedYear: 2022,
      stage: StartupStage.VALIDATION,
      techCategory: "agri_fintech",
      subCategories: ["micro_lending", "crop_insurance", "digital_payments"],
      state: "Maharashtra",
      district: "Pune",
      teamSize: 14,
      fundingStatus: "Seed Funded",
      fundingAmount: "Rs. 3.5 Crore",
      problemStatement:
        "Only 40% of Indian farmers have access to formal credit. Crop insurance penetration is below 30% despite PMFBY. Farmers rely on informal moneylenders charging 36-60% annual interest, trapping them in debt cycles.",
      solution:
        "Alternative credit scoring using satellite data and agri-transaction history. Instant micro-loans of Rs. 5,000-50,000 via UPI. Parametric crop insurance with automated weather-triggered payouts within 72 hours.",
      businessModel:
        "Interest income on micro-loans (18-24% APR). Insurance premium commission (15% of premium). Transaction fees on digital payments. Data licensing to banks and NBFCs.",
      impactMetrics: {
        loansDisbursed: "Rs. 8 Crore",
        farmersInsured: 15000,
        avgLoanSize: "Rs. 22,000",
        npaRatio: "2.8%",
        claimSettlementTime: "72 hours",
      },
      status: StartupStatus.SUBMITTED,
      verificationLevel: VerificationLevel.NONE,
      upvoteCount: 56,
      viewCount: 920,
      isFeatured: false,
    },
  })

  const startup5 = await prisma.startup.create({
    data: {
      founderId: founder2.id,
      name: "AgriCarbon Labs",
      slug: "agricarbon-labs",
      tagline: "Monetizing sustainable farming through verified carbon credits",
      description:
        "AgriCarbon Labs helps Indian farmers generate and sell verified carbon credits from sustainable agricultural practices like zero-tillage, cover cropping, and agroforestry. Our MRV (Measurement, Reporting, Verification) platform uses remote sensing and soil sampling to quantify carbon sequestration at farm level. We have registered 45,000 acres across Punjab and Haryana under Verra-certified carbon credit programs.",
      websiteUrl: "https://agricarbon.in",
      foundedYear: 2023,
      stage: StartupStage.VALIDATION,
      techCategory: "climate_tech",
      subCategories: ["carbon_credits", "mrv", "sustainable_farming"],
      state: "Punjab",
      district: "Ludhiana",
      teamSize: 11,
      fundingStatus: "Angel Funded",
      fundingAmount: "Rs. 1.8 Crore",
      problemStatement:
        "Indian agriculture contributes 14% of national GHG emissions, yet farmers have no way to monetize sustainable practices. Global voluntary carbon markets exceed $2 billion but Indian farmers capture less than 1% due to lack of MRV infrastructure.",
      solution:
        "End-to-end carbon credit platform: satellite-based MRV for low-cost verification, aggregation of smallholder farms into bankable carbon credit projects, and direct access to global carbon buyers through our marketplace.",
      businessModel:
        "20% commission on carbon credit sales. Average credit price of $12-18/tonne CO2e. Target: 200,000 acres enrolled generating 100,000 credits/year. Additional revenue from sustainability consulting to corporates.",
      impactMetrics: {
        acresEnrolled: 45000,
        carbonCreditsGenerated: 12000,
        farmersEnrolled: 3200,
        avgFarmerIncome: "Rs. 4,500/year from credits",
        ghgReduction: "12,000 tonnes CO2e",
      },
      status: StartupStatus.UNDER_REVIEW,
      verificationLevel: VerificationLevel.NONE,
      upvoteCount: 34,
      viewCount: 680,
      isFeatured: false,
    },
  })

  const startup6 = await prisma.startup.create({
    data: {
      founderId: founder3.id,
      name: "AgriBot Systems",
      slug: "agribot-systems",
      tagline: "Autonomous weeding and spraying robots for Indian farms",
      description:
        "AgriBot Systems develops solar-powered autonomous robots for precision weeding and targeted pesticide spraying. Our robots use computer vision to distinguish crops from weeds with 96% accuracy, reducing herbicide usage by 80% and labour costs by 60%. Designed for Indian row crops including cotton, soybean, and sugarcane with adjustable row spacing. Currently deployed across 50 farms in Gujarat and Maharashtra.",
      websiteUrl: "https://agribot.co.in",
      foundedYear: 2021,
      stage: StartupStage.EARLY_TRACTION,
      techCategory: "robotics",
      subCategories: ["autonomous_vehicles", "computer_vision", "solar_powered"],
      state: "Gujarat",
      district: "Ahmedabad",
      teamSize: 16,
      fundingStatus: "Seed Funded",
      fundingAmount: "Rs. 5 Crore",
      problemStatement:
        "India faces a severe farm labour shortage with 2,000+ farmers leaving agriculture daily. Manual weeding costs Rs. 3,000-5,000/acre and accounts for 30% of cultivation costs. Indiscriminate pesticide spraying causes environmental damage and farmer health issues.",
      solution:
        "Solar-powered weeding robot that operates autonomously using GPS and computer vision. Reduces herbicide use by 80% through targeted micro-spraying. Operates 8 hours on a single charge, covering 3 acres/day. Available on a RaaS (Robot-as-a-Service) model at Rs. 800/acre.",
      businessModel:
        "RaaS model at Rs. 800-1,200/acre. Robot sales at Rs. 6-8 Lakh per unit. Maintenance contracts at Rs. 30,000/year. Data services for crop analytics.",
      impactMetrics: {
        robotsDeployed: 50,
        acresCovered: 8000,
        herbicideReduction: "80%",
        labourCostSaving: "60%",
        farmersSaved: "1,200 hours/season",
      },
      status: StartupStatus.VERIFIED,
      verificationLevel: VerificationLevel.EXPERT,
      upvoteCount: 167,
      viewCount: 2900,
      isFeatured: true,
    },
  })

  const startup7 = await prisma.startup.create({
    data: {
      founderId: founder1.id,
      name: "AgroChain Solutions",
      slug: "agrochain-solutions",
      tagline: "Blockchain-enabled traceability for farm-to-fork supply chains",
      description:
        "AgroChain Solutions provides end-to-end supply chain traceability using blockchain, IoT sensors, and QR codes. Our platform tracks produce from farm gate to consumer plate, ensuring food safety compliance, reducing fraud, and enabling premium pricing for traceable products. Currently tracking Rs. 200+ Crore of spices, organic produce, and basmati rice exports for 12 major food companies.",
      websiteUrl: "https://agrochain.in",
      foundedYear: 2020,
      stage: StartupStage.GROWTH,
      techCategory: "supply_chain",
      subCategories: ["blockchain", "traceability", "food_safety"],
      state: "Kerala",
      district: "Kochi",
      teamSize: 20,
      fundingStatus: "Series A",
      fundingAmount: "Rs. 8 Crore",
      problemStatement:
        "India loses Rs. 92,000 Crore annually to food adulteration and fraud. Export rejections due to traceability gaps cost Rs. 3,000 Crore/year. Consumers have no way to verify origin and safety of food products.",
      solution:
        "Blockchain-based traceability platform with IoT sensors at key supply chain nodes. QR code scanning gives consumers full provenance information. Automated compliance reporting for FSSAI, EU, and USDA standards.",
      businessModel:
        "SaaS subscription: Rs. 50,000-5,00,000/month based on volume. Per-transaction tracking fee of Rs. 0.50-2. Premium for export compliance modules. Consumer engagement analytics for brands.",
      impactMetrics: {
        productsTracked: "Rs. 200+ Crore",
        supplyChainPartners: 240,
        exportComplianceRate: "99.2%",
        adultFraudDetected: 45,
        consumerScans: 180000,
      },
      status: StartupStatus.VERIFIED,
      verificationLevel: VerificationLevel.FULL,
      upvoteCount: 112,
      viewCount: 2400,
      isFeatured: false,
    },
  })

  const startup8 = await prisma.startup.create({
    data: {
      founderId: founder2.id,
      name: "MittiSense",
      slug: "mittisense",
      tagline: "Low-cost IoT soil monitoring for data-driven farming decisions",
      description:
        "MittiSense manufactures ultra-low-cost IoT soil sensors (Rs. 2,500 per unit) that measure soil moisture, temperature, pH, NPK levels, and electrical conductivity in real-time. Data is transmitted via LoRaWAN to our cloud platform, which generates fertilizer recommendations and irrigation schedules. Designed for Indian conditions with solar charging and monsoon-proof enclosures. Deployed across 12,000 acres in Andhra Pradesh and Telangana.",
      websiteUrl: "https://mittisense.in",
      foundedYear: 2023,
      stage: StartupStage.IDEATION,
      techCategory: "iot_sensors",
      subCategories: ["soil_monitoring", "lorawan", "smart_irrigation"],
      state: "Andhra Pradesh",
      district: "Hyderabad",
      teamSize: 8,
      fundingStatus: "Bootstrapped",
      fundingAmount: "Rs. 40 Lakh (self-funded)",
      problemStatement:
        "Indian farmers apply 3x more fertilizer than needed due to zero soil data, costing Rs. 1.2 Lakh Crore in wasted inputs annually. Existing soil testing takes 2-3 weeks via government labs. Real-time IoT sensors cost Rs. 15,000-50,000, unaffordable for smallholders.",
      solution:
        "Ultra-affordable IoT soil sensor at Rs. 2,500 (10x cheaper than alternatives). Plug-and-play installation. Real-time data via LoRaWAN with 5 km range. AI-driven fertilizer and irrigation recommendations delivered via SMS.",
      businessModel:
        "Hardware sales at Rs. 2,500/sensor (40% margin). Data subscription at Rs. 200/month for advanced analytics. B2B partnerships with fertilizer companies for targeted recommendation engine.",
      impactMetrics: {
        sensorsDeployed: 4800,
        acresMonitored: 12000,
        fertilizerReduction: "35%",
        waterSavings: "25%",
        costSavingsPerAcre: "Rs. 3,200/season",
      },
      status: StartupStatus.SUBMITTED,
      verificationLevel: VerificationLevel.NONE,
      upvoteCount: 23,
      viewCount: 450,
      isFeatured: false,
    },
  })

  console.log("Created 8 startups.")

  // ─── TEAM MEMBERS ──────────────────────────────────────────────────

  // CropWise team
  await prisma.teamMember.createMany({
    data: [
      { startupId: startup1.id, name: "Rajesh Kumar", role: "CEO & Co-founder", linkedinUrl: "https://linkedin.com/in/rajeshkumar-agri" },
      { startupId: startup1.id, name: "Sneha Agarwal", role: "CTO", linkedinUrl: "https://linkedin.com/in/snehaagarwal" },
      { startupId: startup1.id, name: "Manoj Tiwari", role: "Head of Agronomy", linkedinUrl: "https://linkedin.com/in/manojtiwari-agro" },
    ],
  })

  // GreenGenomics team
  await prisma.teamMember.createMany({
    data: [
      { startupId: startup2.id, name: "Priya Sharma", role: "CEO & Chief Scientist", linkedinUrl: "https://linkedin.com/in/priyasharma-biotech" },
      { startupId: startup2.id, name: "Dr. Anil Yadav", role: "Head of Genomics Lab", linkedinUrl: "https://linkedin.com/in/anilyadav-genomics" },
      { startupId: startup2.id, name: "Kavita Rathore", role: "VP - Business Development" },
    ],
  })

  // FarmConnect team
  await prisma.teamMember.createMany({
    data: [
      { startupId: startup3.id, name: "Arun Nair", role: "CEO & Co-founder", linkedinUrl: "https://linkedin.com/in/arunnair-fintech" },
      { startupId: startup3.id, name: "Divya Krishnamurthy", role: "CPO", linkedinUrl: "https://linkedin.com/in/divyak-product" },
    ],
  })

  // KisanPay team
  await prisma.teamMember.createMany({
    data: [
      { startupId: startup4.id, name: "Rahul Mehta", role: "CEO & Co-founder" },
      { startupId: startup4.id, name: "Pooja Bansal", role: "Head of Risk & Compliance" },
      { startupId: startup4.id, name: "Amit Gupta", role: "CTO" },
    ],
  })

  // AgriCarbon team
  await prisma.teamMember.createMany({
    data: [
      { startupId: startup5.id, name: "Harpreet Singh", role: "CEO & Co-founder" },
      { startupId: startup5.id, name: "Dr. Nandini Kapoor", role: "Chief Climate Scientist" },
    ],
  })

  // AgriBot team
  await prisma.teamMember.createMany({
    data: [
      { startupId: startup6.id, name: "Karan Patel", role: "CEO & Co-founder" },
      { startupId: startup6.id, name: "Ritu Chaudhary", role: "Head of Robotics Engineering" },
      { startupId: startup6.id, name: "Sanjay Verma", role: "VP Operations" },
    ],
  })

  // AgroChain team
  await prisma.teamMember.createMany({
    data: [
      { startupId: startup7.id, name: "Thomas Kurian", role: "CEO & Co-founder" },
      { startupId: startup7.id, name: "Nisha Menon", role: "CTO" },
    ],
  })

  // MittiSense team
  await prisma.teamMember.createMany({
    data: [
      { startupId: startup8.id, name: "Ravi Prasad", role: "CEO & Co-founder" },
      { startupId: startup8.id, name: "Swathi Rao", role: "Hardware Lead" },
    ],
  })

  console.log("Created team members for all startups.")

  // ─── UPVOTES ───────────────────────────────────────────────────────

  const allUsers = [admin, founder1, founder2, founder3, investor1, investor2, community1, community2, community3, community4, community5]
  const allStartups = [startup1, startup2, startup3, startup4, startup5, startup6, startup7, startup8]

  const upvoteData: { userId: string; startupId: string }[] = []

  // Distribute upvotes somewhat randomly but consistently
  const upvoteMap: Record<number, number[]> = {
    0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // startup1 gets votes from all
    1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // startup2 gets votes from all
    2: [0, 1, 3, 4, 6, 7, 8, 9],            // startup3
    3: [1, 2, 4, 5, 7, 9],                  // startup4
    4: [0, 2, 3, 6, 10],                    // startup5
    5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // startup6 gets votes from all
    6: [0, 1, 2, 4, 5, 7, 8, 10],           // startup7
    7: [1, 3, 6, 9],                        // startup8
  }

  for (const [startupIdx, userIdxs] of Object.entries(upvoteMap)) {
    for (const userIdx of userIdxs) {
      upvoteData.push({
        userId: allUsers[userIdx].id,
        startupId: allStartups[parseInt(startupIdx)].id,
      })
    }
  }

  for (const upvote of upvoteData) {
    await prisma.upvote.create({ data: upvote })
  }

  console.log(`Created ${upvoteData.length} upvotes.`)

  // ─── KNOWLEDGE ARTICLES ────────────────────────────────────────────

  await prisma.knowledgeArticle.create({
    data: {
      title: "The Complete Guide to Agritech Startup Funding in India (2024)",
      slug: "complete-guide-agritech-startup-funding-india-2024",
      content:
        "Navigating the funding landscape for agritech startups in India requires understanding multiple channels: government grants (RKVY-RAFTAAR, AIM), angel networks (Indian Angel Network, Agri-focused angels), venture capital (Omnivore, Ankur Capital, Aavishkaar), impact investors, and corporate venture arms (Mahindra, ITC, UPL). This comprehensive guide covers eligibility criteria, application processes, typical ticket sizes, and success strategies for each funding stage from pre-seed to Series B. We also cover newer instruments like revenue-based financing and blended finance structures becoming popular in Indian agritech.",
      excerpt:
        "A comprehensive guide covering government grants, angel networks, venture capital, and alternative funding sources available for Indian agritech startups at every stage.",
      category: ArticleCategory.GUIDE,
      authorId: admin.id,
      tags: ["funding", "venture-capital", "government-grants", "agritech", "startup-guide"],
      isPublished: true,
      publishedAt: new Date("2024-08-15"),
    },
  })

  await prisma.knowledgeArticle.create({
    data: {
      title: "Government Schemes for Agritech: RKVY-RAFTAAR, AIM, and State Programmes",
      slug: "government-schemes-agritech-rkvy-raftaar-aim-state-programmes",
      content:
        "India offers multiple government schemes supporting agritech innovation. RKVY-RAFTAAR provides up to Rs. 25 Lakh in grants for agri-startups with incubation support. Atal Innovation Mission supports agritech through incubators and tinkering labs. State-level schemes in Karnataka (Elevate), Telangana (T-Hub Agri), Maharashtra (Mahapreit), and Kerala (KSUM) offer additional funding and infrastructure. This article maps all available schemes, explains the application timeline, and shares tips from founders who successfully secured government support.",
      excerpt:
        "Detailed mapping of central and state government schemes supporting agritech startups, including RKVY-RAFTAAR grants, AIM programs, and state-specific initiatives.",
      category: ArticleCategory.SCHEME,
      authorId: admin.id,
      tags: ["government-schemes", "rkvy-raftaar", "grants", "state-support", "policy"],
      isPublished: true,
      publishedAt: new Date("2024-10-01"),
    },
  })

  await prisma.knowledgeArticle.create({
    data: {
      title: "State of Indian Agritech: Annual Report 2024",
      slug: "state-of-indian-agritech-annual-report-2024",
      content:
        "The Indian agritech ecosystem has grown to 4,255+ startups across 12 technology verticals. Total funding in 2024 crossed Rs. 4,800 Crore, a 34% increase from the previous year. Precision agriculture and market linkage remain the largest categories, but climate tech and agri-fintech showed the fastest growth at 78% and 65% respectively. This report analyzes funding trends, geographic distribution, technology adoption patterns, exit landscape, and provides forecasts for 2025. Based on data from 1,200+ verified startups on AgriVentures India.",
      excerpt:
        "Comprehensive annual analysis of the Indian agritech ecosystem covering funding trends, technology verticals, geographic distribution, and 2025 forecasts.",
      category: ArticleCategory.REPORT,
      authorId: admin.id,
      tags: ["annual-report", "ecosystem", "trends", "funding-data", "analysis"],
      isPublished: true,
      publishedAt: new Date("2024-12-15"),
    },
  })

  console.log("Created 3 knowledge articles.")

  // ─── JOBS ──────────────────────────────────────────────────────────

  await prisma.job.create({
    data: {
      startupId: startup1.id,
      title: "Senior Machine Learning Engineer - Satellite Imagery",
      description:
        "Join CropWise Technologies to build next-generation crop health detection models using multi-spectral satellite imagery. You will work with NDVI, EVI, and thermal data to develop pest and disease prediction algorithms. Requires strong experience with PyTorch/TensorFlow, remote sensing data, and production ML deployment. PhD preferred in Computer Vision, Remote Sensing, or related field.",
      location: "Lucknow, Uttar Pradesh (Hybrid)",
      type: JobType.FULL_TIME,
      salaryRange: "Rs. 18-28 LPA",
      requirements: [
        "3+ years ML/DL experience",
        "Experience with satellite/remote sensing data",
        "Proficiency in Python, PyTorch or TensorFlow",
        "Published research is a plus",
        "B.Tech/M.Tech/PhD in CS, EE, or Remote Sensing",
      ],
      applicationUrl: "https://cropwise.in/careers/ml-engineer",
      isActive: true,
      expiresAt: new Date("2025-03-31"),
    },
  })

  await prisma.job.create({
    data: {
      startupId: startup2.id,
      title: "Plant Molecular Biologist",
      description:
        "GreenGenomics India is looking for a plant molecular biologist to join our CRISPR gene editing team. You will work on developing drought and heat tolerant wheat and rice varieties. The role involves designing guide RNAs, performing transformations, phenotyping edited plants, and collaborating with ICAR partners on field trials.",
      location: "Jodhpur, Rajasthan (On-site)",
      type: JobType.FULL_TIME,
      salaryRange: "Rs. 12-20 LPA",
      requirements: [
        "PhD in Plant Molecular Biology or Biotechnology",
        "Hands-on CRISPR/Cas9 experience in plants",
        "Published research in peer-reviewed journals",
        "Experience with wheat or rice is preferred",
        "Knowledge of Indian regulatory framework (GEAC) is a plus",
      ],
      applicationUrl: "https://greengenomics.in/careers/molecular-biologist",
      isActive: true,
      expiresAt: new Date("2025-04-15"),
    },
  })

  await prisma.job.create({
    data: {
      startupId: startup3.id,
      title: "Operations Manager - Supply Chain & Logistics",
      description:
        "FarmConnect India seeks an experienced operations manager to scale our farmer-to-retailer logistics network across South India. You will manage cold chain operations, optimize delivery routes, onboard logistics partners, and ensure quality standards at collection centers. Prior experience in fresh produce supply chain is essential.",
      location: "Bengaluru, Karnataka",
      type: JobType.FULL_TIME,
      salaryRange: "Rs. 10-16 LPA",
      requirements: [
        "5+ years in supply chain/logistics management",
        "Experience in fresh produce or FMCG supply chain",
        "Strong vendor management skills",
        "Willingness to travel 40% of the time",
        "MBA or equivalent qualification preferred",
      ],
      applicationUrl: "https://farmconnect.in/careers/ops-manager",
      isActive: true,
      expiresAt: new Date("2025-02-28"),
    },
  })

  await prisma.job.create({
    data: {
      startupId: startup6.id,
      title: "Robotics Engineering Intern",
      description:
        "AgriBot Systems offers a 6-month internship for robotics enthusiasts. Work on real autonomous agricultural robots: computer vision for weed detection, ROS-based navigation, and solar power management systems. Ideal for final year B.Tech or M.Tech students in Robotics, Mechatronics, or ECE. Stipend provided with potential for full-time conversion.",
      location: "Ahmedabad, Gujarat (On-site)",
      type: JobType.INTERNSHIP,
      salaryRange: "Rs. 25,000-35,000/month stipend",
      requirements: [
        "Final year B.Tech/M.Tech in Robotics, Mechatronics, ECE, or CS",
        "Familiarity with ROS (Robot Operating System)",
        "Basic knowledge of computer vision (OpenCV)",
        "Hands-on experience with Arduino/Raspberry Pi",
        "Passion for agriculture and sustainability",
      ],
      applicationUrl: "https://agribot.co.in/careers/robotics-intern",
      isActive: true,
      expiresAt: new Date("2025-05-31"),
    },
  })

  console.log("Created 4 job listings.")

  // ─── INVESTOR PROFILES ─────────────────────────────────────────────

  await prisma.investorProfile.create({
    data: {
      userId: investor1.id,
      firmName: "Omnivore Partners",
      thesis:
        "We invest in entrepreneurs building the future of food, agriculture, and the rural economy in India. Our portfolio companies use cutting-edge technology to transform food and agriculture value chains and improve the lives of India's 120+ million farming families.",
      checkSizeMin: 5000000,    // Rs. 50 Lakh
      checkSizeMax: 150000000,  // Rs. 15 Crore
      preferredStages: ["VALIDATION", "EARLY_TRACTION", "GROWTH"],
      preferredCategories: ["precision_agriculture", "biotech", "market_linkage", "agri_fintech", "climate_tech"],
      portfolioCount: 35,
      websiteUrl: "https://omnivore.vc",
    },
  })

  await prisma.investorProfile.create({
    data: {
      userId: investor2.id,
      firmName: "AgroFund Capital",
      thesis:
        "AgroFund Capital backs climate-resilient agritech startups building scalable solutions for Indian agriculture. We focus on deep-tech companies in robotics, IoT, genomics, and carbon markets that can achieve both financial returns and measurable impact on farmer livelihoods and environmental sustainability.",
      checkSizeMin: 10000000,   // Rs. 1 Crore
      checkSizeMax: 250000000,  // Rs. 25 Crore
      preferredStages: ["EARLY_TRACTION", "GROWTH", "SCALING"],
      preferredCategories: ["robotics", "iot_sensors", "biotech", "climate_tech", "supply_chain"],
      portfolioCount: 18,
      websiteUrl: "https://agrofund.in",
    },
  })

  console.log("Created 2 investor profiles.")

  console.log("\nSeeding completed successfully!")
  console.log("────────────────────────────────────────")
  console.log("Test accounts:")
  console.log("  Admin:     admin@agriventures.in / Admin123!")
  console.log("  Founder:   rajesh.kumar@cropwise.in / Founder123!")
  console.log("  Investor:  meera.patel@omnivorevc.in / Investor123!")
  console.log("  Community: anita.desai@gmail.com / Community123!")
  console.log("────────────────────────────────────────")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
