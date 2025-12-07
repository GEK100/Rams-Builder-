import Link from "next/link";
import { Button } from "@/components/ui/Button";


// Compliance badges
const complianceBadges = [
  { name: "HSE", description: "Health & Safety Executive Guidelines" },
  { name: "CDM 2015", description: "Construction Design & Management" },
  { name: "BS 7671", description: "IET Wiring Regulations 18th Edition" },
  { name: "ISO 45001", description: "Occupational Health & Safety" },
  { name: "EaWR 1989", description: "Electricity at Work Regulations" },
];

// Features data
const features = [
  {
    icon: (
      <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    title: "Drag & Drop Builder",
    description: "Interactive canvas for electrical work activities. Drag, drop, and configure your tasks in seconds.",
    color: "emerald",
  },
  {
    icon: (
      <svg className="h-6 w-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI-Powered Generation",
    description: "Claude AI generates comprehensive method statements, hazard assessments, and mitigation measures.",
    color: "teal",
  },
  {
    icon: (
      <svg className="h-6 w-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "UK Regulatory Compliant",
    description: "Built for CDM 2015, HSE guidelines, and ISO 45001. All documents meet UK construction standards.",
    color: "amber",
  },
  {
    icon: (
      <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    title: "5x5 Risk Matrix",
    description: "Standard HSE risk assessment matrix with before and after controls scoring.",
    color: "green",
  },
  {
    icon: (
      <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Word Export",
    description: "Export professional Word documents ready for submission. Includes full CDM information.",
    color: "purple",
  },
  {
    icon: (
      <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Safe Isolation Procedures",
    description: "Built-in LOTO (Lock Off Tag Off) procedures compliant with GS38 and electrical safety standards.",
    color: "red",
  },
];

// Electrical activities
const electricalActivities = [
  "Electrical Installation",
  "Testing & Inspection",
  "Safe Isolation",
  "Cable Installation",
  "Distribution Boards",
  "Consumer Unit Replacement",
  "Emergency Lighting",
  "Fire Alarm Systems",
  "EV Charger Installation",
  "Solar PV Installation",
];

// FAQs
const faqs = [
  {
    question: "What is a RAMS document?",
    answer: "A RAMS (Risk Assessment Method Statement) is a document that combines a risk assessment with a method statement. It identifies hazards, assesses risks, and outlines safe working procedures for construction activities. RAMS are required by UK health and safety regulations including CDM 2015.",
  },
  {
    question: "Is RAMS Builder compliant with UK regulations?",
    answer: "Yes, RAMS Builder generates documents compliant with HSE guidelines, CDM 2015 (Construction Design and Management Regulations), BS 7671 (IET Wiring Regulations 18th Edition), ISO 45001, and the Electricity at Work Regulations 1989.",
  },
  {
    question: "How does the AI generate RAMS content?",
    answer: "RAMS Builder uses Claude AI to generate comprehensive method statements, hazard assessments, and control measures based on your project details. The AI is trained on UK construction safety standards and best practices, ensuring accurate and compliant documentation.",
  },
  {
    question: "Can I use RAMS Builder for commercial projects?",
    answer: "Absolutely. RAMS Builder is designed for both domestic and commercial electrical installations. Our documents are suitable for submission to main contractors, local authorities, and clients across the UK construction industry.",
  },
  {
    question: "What file formats can I export?",
    answer: "RAMS Builder exports professional Microsoft Word (.docx) documents that are ready for submission. The documents include your company branding, full CDM information, risk matrices, and method statements.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! Our free tier includes 2 RAMS documents per month with no credit card required. This allows you to fully test the platform before upgrading to a paid plan for unlimited RAMS generation.",
  },
];


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Gradient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold">RAMS Builder</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#compliance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Compliance
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Build Professional{" "}
              <span className="text-gradient-primary">RAMS Documents</span>
              <br />
              in Minutes, Not Hours
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered Risk Assessment Method Statements for UK electrical contractors.
              Fully compliant with <strong className="text-foreground">HSE</strong>, <strong className="text-foreground">CDM 2015</strong>, <strong className="text-foreground">BS 7671</strong>, and <strong className="text-foreground">ISO 45001</strong>.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="xl" variant="gradient" className="min-w-[200px]">
                  Start Free Trial
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="#features">
                <Button size="xl" variant="outline" className="min-w-[200px]">
                  See How It Works
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free tier includes 2 RAMS per month. No credit card required.
            </p>
          </div>
        </section>

        {/* Compliance Section */}
        <section id="compliance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Built for UK Construction Compliance
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every RAMS document is generated to meet the latest UK health and safety regulations
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {complianceBadges.map((badge) => (
              <div
                key={badge.name}
                className="glass rounded-xl px-6 py-4 text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-lg font-bold text-emerald-400">{badge.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{badge.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Create Compliant RAMS
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional features designed specifically for UK electrical contractors and construction professionals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className={`h-12 w-12 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Create Your RAMS in 3 Simple Steps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From project details to professional documentation in under 5 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-white">
                1
              </div>
              <div className="glass rounded-2xl p-8 pt-10 h-full">
                <h3 className="text-xl font-semibold mb-3">Enter Project Details</h3>
                <p className="text-muted-foreground">
                  Add your client information, site address, and CDM duty holder details. Our smart forms guide you through every required field.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-white">
                2
              </div>
              <div className="glass rounded-2xl p-8 pt-10 h-full">
                <h3 className="text-xl font-semibold mb-3">Select Your Activities</h3>
                <p className="text-muted-foreground">
                  Choose from our library of electrical work activities. Each comes with pre-built hazards, risks, and control measures.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-white">
                3
              </div>
              <div className="glass rounded-2xl p-8 pt-10 h-full">
                <h3 className="text-xl font-semibold mb-3">Generate & Export</h3>
                <p className="text-muted-foreground">
                  AI generates your complete RAMS document. Review, edit if needed, and export to Word format ready for submission.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trades Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Electrical Trade Specialists</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive electrical RAMS with pre-built hazards, control measures, and method statements based on HSE guidance and the Electricity at Work Regulations 1989
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {electricalActivities.map((activity) => (
              <span
                key={activity}
                className="px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium border border-amber-500/30 hover:bg-amber-500/30 transition-colors cursor-default"
              >
                {activity}
              </span>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8 text-sm">
            More trades coming soon: Plumbing, HVAC, Roofing, and more.
          </p>
        </section>


        {/* FAQ Section */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about RAMS Builder
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="glass rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                  <svg
                    className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Better RAMS?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
                Join hundreds of UK construction professionals who save hours on documentation while ensuring full compliance.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="xl" variant="gradient" className="min-w-[200px]">
                    Get Started Free
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required. Start creating RAMS in under 2 minutes.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">RAMS Builder</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">
                AI-powered Risk Assessment Method Statement builder for UK construction professionals.
                Create compliant documentation in minutes.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#compliance" className="hover:text-foreground transition-colors">Compliance</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><Link href="/register" className="hover:text-foreground transition-colors">Start Free Trial</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} RAMS Builder. Built by{" "}
              <a href="https://ictusflow.com" className="text-foreground hover:text-primary transition-colors">
                Ictus Flow
              </a>
              .
            </p>
            <p className="text-sm text-muted-foreground">
              Made in the United Kingdom 🇬🇧
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
