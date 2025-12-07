"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>

        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-muted-foreground">
              RAMS Builder (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy and personal data.
              This Privacy Policy explains how we collect, use, store, and protect your information when you use our
              Risk Assessment Method Statement (RAMS) building service.
            </p>
            <p className="text-muted-foreground mt-3">
              We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Data Controller</h2>
            <p className="text-muted-foreground">
              RAMS Builder, operated by Ictus Flow, is the data controller responsible for your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">We collect the following types of information:</p>

            <h3 className="text-lg font-medium mt-4 mb-2">Account Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Email address</li>
              <li>Full name</li>
              <li>Company name</li>
              <li>Contractor type (main contractor/subcontractor)</li>
              <li>Password (securely hashed)</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">RAMS Document Data</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Project information (titles, addresses, descriptions)</li>
              <li>Client and contractor details</li>
              <li>Risk assessments and method statements</li>
              <li>CDM (Construction Design and Management) information</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Technical Data</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage data and analytics</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Payment Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Payment history (amounts, dates, status)</li>
              <li>Subscription tier</li>
              <li>Note: Card details are processed securely by Stripe and never stored by us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Legal Basis for Processing</h2>
            <p className="text-muted-foreground mb-4">We process your data based on:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <strong>Contract:</strong> Processing necessary to provide our RAMS building service
              </li>
              <li>
                <strong>Legitimate Interest:</strong> To improve our service and prevent fraud
              </li>
              <li>
                <strong>Consent:</strong> For marketing communications (where you have opted in)
              </li>
              <li>
                <strong>Legal Obligation:</strong> To comply with UK laws and regulations
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Provide and maintain the RAMS Builder service</li>
              <li>Process payments and manage subscriptions</li>
              <li>Generate AI-powered RAMS content</li>
              <li>Send service-related communications</li>
              <li>Improve our service and develop new features</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Sharing</h2>
            <p className="text-muted-foreground mb-4">We share data with the following third parties:</p>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 font-medium">Service</th>
                    <th className="text-left p-4 font-medium">Purpose</th>
                    <th className="text-left p-4 font-medium">Data Shared</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="p-4 text-muted-foreground">Supabase</td>
                    <td className="p-4 text-muted-foreground">Database hosting and authentication</td>
                    <td className="p-4 text-muted-foreground">All account and document data</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">Stripe</td>
                    <td className="p-4 text-muted-foreground">Payment processing</td>
                    <td className="p-4 text-muted-foreground">Email, payment details</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">Anthropic (Claude AI)</td>
                    <td className="p-4 text-muted-foreground">AI content generation</td>
                    <td className="p-4 text-muted-foreground">Project details for RAMS generation</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground mt-4">
              We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your data for as long as your account is active. After account deletion:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-3">
              <li>Account data is deleted immediately</li>
              <li>RAMS documents and associated data are deleted immediately</li>
              <li>Payment records may be retained for up to 7 years for legal/tax purposes</li>
              <li>Anonymized analytics data may be retained indefinitely</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Your Rights (GDPR)</h2>
            <p className="text-muted-foreground mb-4">Under UK GDPR, you have the following rights:</p>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium">Right of Access (Article 15)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Request a copy of all personal data we hold about you.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium">Right to Rectification (Article 16)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Request correction of inaccurate or incomplete data.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium">Right to Erasure (Article 17)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Request deletion of your personal data (&quot;right to be forgotten&quot;).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium">Right to Data Portability (Article 20)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive your data in a machine-readable format (JSON).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-medium">Right to Object (Article 21)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Object to processing of your data for certain purposes.
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, visit your{" "}
              <Link href="/settings" className="text-primary hover:underline">
                Account Settings
              </Link>{" "}
              page or contact us directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-3">
              <li>Encryption in transit (HTTPS/TLS)</li>
              <li>Encryption at rest for database storage</li>
              <li>Row Level Security (RLS) to isolate user data</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure password hashing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. International Transfers</h2>
            <p className="text-muted-foreground">
              Your data may be processed in countries outside the UK. We ensure appropriate safeguards
              are in place, including Standard Contractual Clauses or adequacy decisions where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground">
              RAMS Builder is not intended for use by individuals under 18 years of age.
              We do not knowingly collect data from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by email or through a notice on our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy or wish to exercise your rights,
              please contact us:
            </p>
            <div className="mt-4 p-4 rounded-xl bg-white/5">
              <p className="text-muted-foreground">
                <strong>Email:</strong> privacy@ramsbuilder.com
                <br />
                <strong>Address:</strong> RAMS Builder, Ictus Flow Ltd
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">14. Supervisory Authority</h2>
            <p className="text-muted-foreground">
              You have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO):
            </p>
            <div className="mt-4 p-4 rounded-xl bg-white/5">
              <p className="text-muted-foreground">
                <strong>Website:</strong>{" "}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ico.org.uk
                </a>
                <br />
                <strong>Phone:</strong> 0303 123 1113
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex gap-4">
            <Link href="/cookies" className="text-sm text-primary hover:underline">
              Cookie Policy
            </Link>
            <Link href="/settings" className="text-sm text-primary hover:underline">
              Manage Your Data
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
