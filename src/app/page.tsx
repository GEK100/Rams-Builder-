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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: "Scope-to-RAMS in Minutes",
    description: "Upload the tender docs, scope of works, or even a site photo. The AI extracts what matters and builds your RAMS around it.",
  },
  {
    icon: (
      <svg className="h-6 w-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Activity Checklist",
    description: "Scopes don't always mention isolation procedures or permit requirements. Our checklist catches what clients forget to specify.",
  },
  {
    icon: (
      <svg className="h-6 w-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    ),
    title: "Your Processes, Saved",
    description: "Add your company's specific procedures once. They're there for every job after. The more you use it, the faster it gets.",
  },
  {
    icon: (
      <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: "Edit Your Way",
    description: "Ask the AI to refine sections, or edit manually yourself. No limits, no friction. It's your document.",
  },
];

// Comparison data
const comparison = [
  { old: "Start from a generic template", new: "Start from your actual scope" },
  { old: "Guess which risks apply", new: "AI identifies activities and matches risks" },
  { old: "Copy-paste isolation procedures", new: "LOTO processes built in" },
  { old: "3-4 hours per RAMS", new: "Under 30 minutes" },
  { old: "Fingers crossed it gets accepted", new: "Documentation that reflects the real job" },
];

// Pricing data
const pricing = [
  { name: "Free", price: "£0", projects: "1", best: "Try it out" },
  { name: "Starter", price: "£59", projects: "10", best: "Sole traders", popular: false },
  { name: "Professional", price: "£119", projects: "30", best: "Growing teams", popular: true },
  { name: "Team", price: "£199", projects: "Unlimited", best: "Busy contractors" },
];

// FAQs
const faqs = [
  {
    question: "Will the main contractor accept AI-generated RAMS?",
    answer: "They won't know. And more importantly, they won't care – because the document will be comprehensive, site-specific, and properly structured. What gets RAMS rejected is generic boilerplate that clearly wasn't written for the job. That's exactly what this tool prevents.",
  },
  {
    question: "I've got my own templates I've built up over years.",
    answer: "Good. Bring them. Upload your processes, your procedures, your company-specific content. The system learns from what you add – it doesn't replace your knowledge, it builds on it.",
  },
  {
    question: "What if the AI gets something wrong?",
    answer: "You review everything before it's issued. The AI drafts, you approve. Same as if you'd asked a junior to write it – except this junior has read every HSE guidance document ever published.",
  },
  {
    question: "What is a RAMS document?",
    answer: "A RAMS (Risk Assessment Method Statement) is a document that combines a risk assessment with a method statement. It identifies hazards, assesses risks, and outlines safe working procedures for construction activities. RAMS are required by UK health and safety regulations including CDM 2015.",
  },
  {
    question: "Is RAMS Builder compliant with UK regulations?",
    answer: "Yes. RAMS Builder generates documents compliant with HSE guidelines, CDM 2015, BS 7671 (IET Wiring Regulations 18th Edition), ISO 45001, and the Electricity at Work Regulations 1989.",
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
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
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
                <Button>Try it free</Button>
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
              Stop wrestling with RAMS.
              <br />
              <span className="text-gradient-primary">Start winning work.</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Upload your job scope. Get site-ready RAMS in minutes – not hours.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="xl" variant="gradient" className="min-w-[200px]">
                  Try it free
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
              1 project free, no card required.
            </p>

            {/* Trust line */}
            <p className="mt-12 text-muted-foreground">
              Trusted by electrical, mechanical and specialist contractors across the UK.
            </p>
          </div>
        </section>

        {/* Problem Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              You&apos;re a contractor, not a safety consultant.
            </h2>
            <div className="text-lg text-muted-foreground space-y-4">
              <p>
                You quoted the job. Won the work. Now you&apos;re stuck at your kitchen table at 9pm,
                copying and pasting from old RAMS, hoping you haven&apos;t missed something that&apos;ll
                get it bounced back.
              </p>
              <p>
                Meanwhile, the site start date is Monday.
              </p>
              <p className="text-foreground font-medium">
                Sound familiar?
              </p>
              <p>
                Most RAMS tools expect you to already know what risks to include. They hand you a
                library of 500 templates and say &quot;good luck.&quot;
              </p>
              <p className="text-foreground font-medium">
                That&apos;s not help. That&apos;s homework.
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Just upload the scope. We&apos;ll do the thinking.
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Our AI reads your job scope – the actual documents you received – and generates
              a complete, bespoke RAMS package:
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Risk assessments", desc: "matched to your specific activities" },
              { title: "Method statements", desc: "written for how the work actually happens" },
              { title: "LOTO and isolation procedures", desc: "built in, not bolted on" },
              { title: "Emergency procedures", desc: "tailored to the site" },
              { title: "COSHH assessments", desc: "where needed" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                <svg className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-semibold text-foreground">{item.title}</span>
                  <span className="text-muted-foreground"> {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-muted-foreground">
            Not templates with your name swapped in. <span className="text-foreground">Proper documentation that reflects the job you&apos;re actually doing.</span>
          </p>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The AI gets you 80%. You finish the last 20%.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Credibility Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built by someone who&apos;s written hundreds of these.
            </h2>
            <div className="text-lg text-muted-foreground space-y-4 text-left">
              <p>
                This wasn&apos;t built by a software company who Googled &quot;what is RAMS.&quot;
              </p>
              <p>
                It was built by a construction project manager with 35 years on the tools and in
                the office – someone who&apos;s reviewed thousands of subcontractor RAMS packages
                and knows exactly why they get rejected.
              </p>
              <p>
                The checklist exists because scopes miss things. The AI prompts exist because
                subbies aren&apos;t H&S consultants. The templates exist because you shouldn&apos;t
                start from scratch every time.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not another template library.
            </h2>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="p-4 bg-red-500/10 text-center font-semibold text-red-400">
                The old way
              </div>
              <div className="p-4 bg-emerald-500/10 text-center font-semibold text-emerald-400">
                With RAMS Builder
              </div>
            </div>
            {comparison.map((item, i) => (
              <div key={i} className="grid grid-cols-2 border-t border-white/10">
                <div className="p-4 text-muted-foreground">{item.old}</div>
                <div className="p-4 text-foreground bg-white/5">{item.new}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Built for UK Construction Compliance
            </h2>
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

        {/* Pricing Section */}
        <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple pricing. No per-user nonsense.
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`glass rounded-2xl p-6 relative ${plan.popular ? "ring-2 ring-primary" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "£0" && <span className="text-muted-foreground">/mo</span>}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="text-foreground font-medium">{plan.projects}</span> projects/month
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Best for: {plan.best}
                </p>
                <Link href="/register">
                  <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                    {plan.price === "£0" ? "Start free" : "Get started"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-muted-foreground">
            All paid plans include unlimited templates, unlimited edits, and full access to the activity checklist.
          </p>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
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

        {/* Final CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your next RAMS could take 20 minutes.
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
                Upload a scope. See what comes out. If it&apos;s not better than what you&apos;re
                doing now, you&apos;ve lost nothing but a tea break.
              </p>
              <Link href="/register">
                <Button size="xl" variant="gradient" className="min-w-[280px]">
                  Generate your first RAMS – free
                </Button>
              </Link>
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
              <p className="text-muted-foreground text-sm max-w-md mb-4">
                AI-powered Risk Assessment Method Statement builder for UK construction professionals.
                Upload your scope, get site-ready documentation in minutes.
              </p>
              {/* Trust elements */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>UK-based & GDPR compliant</span>
                <span>Data encrypted</span>
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><Link href="/register" className="hover:text-foreground transition-colors">Start Free</Link></li>
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
              Built for UK construction, not adapted from American software.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
