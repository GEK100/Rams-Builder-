"use client";

import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";

export default function CookiesPage() {
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
            <Cookie className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Cookie Policy</h1>
        </div>

        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">What Are Cookies?</h2>
            <p className="text-muted-foreground">
              Cookies are small text files that are stored on your device when you visit a website.
              They are widely used to make websites work more efficiently and provide information to
              the website owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">How We Use Cookies</h2>
            <p className="text-muted-foreground mb-4">
              RAMS Builder uses only essential cookies that are strictly necessary for the operation
              of our service. We do not use any analytics, advertising, or third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Essential Cookies We Use</h2>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 font-medium">Cookie Name</th>
                    <th className="text-left p-4 font-medium">Purpose</th>
                    <th className="text-left p-4 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="p-4 text-muted-foreground">sb-access-token</td>
                    <td className="p-4 text-muted-foreground">Authentication - keeps you logged in</td>
                    <td className="p-4 text-muted-foreground">Session</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">sb-refresh-token</td>
                    <td className="p-4 text-muted-foreground">Authentication - refreshes your login session</td>
                    <td className="p-4 text-muted-foreground">7 days</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">__Host-next-auth</td>
                    <td className="p-4 text-muted-foreground">Session management and security</td>
                    <td className="p-4 text-muted-foreground">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Why These Cookies Are Essential</h2>
            <p className="text-muted-foreground mb-4">
              These cookies are necessary for the website to function and cannot be switched off.
              They are usually only set in response to actions made by you, such as logging in or
              saving your RAMS documents.
            </p>
            <p className="text-muted-foreground">
              Without these cookies, the services you have asked for cannot be provided. These cookies
              do not store any personally identifiable information beyond what is needed for authentication.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
            <p className="text-muted-foreground mb-4">
              You can set your browser to refuse all or some browser cookies, or to alert you when
              websites set or access cookies. If you disable or refuse cookies, please note that some
              parts of this website may become inaccessible or not function properly.
            </p>
            <p className="text-muted-foreground">
              Most web browsers allow some control of cookies through browser settings. To find out
              more about cookies, including how to see what cookies have been set and how to manage
              and delete them, visit{" "}
              <a
                href="https://www.aboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.aboutcookies.org
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this cookie policy from time to time. Any changes will be posted on this
              page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about our use of cookies, please contact us.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
