import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | AgriVentures India",
  description: "Privacy policy for the AgriVentures India platform.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">
        Last updated: March 2, 2026
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            1. Information We Collect
          </h2>
          <p className="mt-2">We collect the following types of information:</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5">
            <li>
              <strong>Account Information:</strong> Name, email address, role
              (founder/investor/community), and optional profile details
              (organization, phone, LinkedIn, bio).
            </li>
            <li>
              <strong>Startup Information:</strong> Startup profiles submitted by
              founders, including company details, team members, impact metrics,
              and media.
            </li>
            <li>
              <strong>Usage Data:</strong> Page views, feature usage, and
              interaction data to improve the platform.
            </li>
            <li>
              <strong>OAuth Data:</strong> If you sign in with Google or
              LinkedIn, we receive your name, email, and profile picture from
              the provider.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            2. How We Use Your Information
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>To create and maintain your account</li>
            <li>To display startup profiles on the discovery platform</li>
            <li>To facilitate introductions between founders and investors</li>
            <li>To send transactional emails (verification, notifications)</li>
            <li>To improve platform features and user experience</li>
            <li>To prevent fraud and enforce our terms of service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            3. Information Sharing
          </h2>
          <p className="mt-2">
            We do not sell your personal information. We may share information
            in the following circumstances:
          </p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5">
            <li>
              <strong>Public Profiles:</strong> Startup profiles and founder
              names are publicly visible by design.
            </li>
            <li>
              <strong>Introductions:</strong> When you request or accept an
              introduction, your name and message are shared with the other
              party.
            </li>
            <li>
              <strong>Service Providers:</strong> We use third-party services
              (hosting, email delivery, analytics) that process data on our
              behalf.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose information
              if required by law or to protect our rights.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            4. Data Security
          </h2>
          <p className="mt-2">
            We use industry-standard security measures including encrypted
            connections (HTTPS), hashed passwords, and secure authentication
            protocols (JWT). However, no system is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            5. Data Retention
          </h2>
          <p className="mt-2">
            We retain your data for as long as your account is active. If you
            delete your account, we will remove your personal data within 30
            days, except where we are required to retain it for legal or
            legitimate business purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            6. Your Rights
          </h2>
          <p className="mt-2">You have the right to:</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5">
            <li>Access and download your personal data</li>
            <li>Correct inaccurate information in your profile</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of non-essential communications</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, contact us at{" "}
            <a
              href="mailto:hello@agriventures.in"
              className="text-emerald hover:underline"
            >
              hello@agriventures.in
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            7. Cookies & Tracking
          </h2>
          <p className="mt-2">
            We use essential cookies for authentication and session management.
            We do not use third-party advertising trackers. See our{" "}
            <a href="/cookies" className="text-emerald hover:underline">
              Cookie Policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            8. Changes to This Policy
          </h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. We will notify
            registered users of material changes via email. Continued use of the
            Platform after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">9. Contact</h2>
          <p className="mt-2">
            For questions about this Privacy Policy, contact us at{" "}
            <a
              href="mailto:hello@agriventures.in"
              className="text-emerald hover:underline"
            >
              hello@agriventures.in
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
