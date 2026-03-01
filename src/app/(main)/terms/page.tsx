import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | AgriVentures India",
  description: "Terms of service for the AgriVentures India platform.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">
        Last updated: March 2, 2026
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p className="mt-2">
            By accessing or using the AgriVentures India platform
            (&quot;Platform&quot;), you agree to be bound by these Terms of
            Service. If you do not agree, please do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            2. Description of Service
          </h2>
          <p className="mt-2">
            AgriVentures India is a verified impact discovery platform that
            connects Indian agritech startups with investors, partners, and the
            broader ecosystem. The Platform enables startup discovery,
            verification, introductions, knowledge sharing, and job listings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            3. User Accounts
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              You must provide accurate and complete information when creating
              your account.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              login credentials.
            </li>
            <li>
              You agree to notify us immediately of any unauthorized use of your
              account.
            </li>
            <li>
              One person or entity may maintain only one account on the
              Platform.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            4. User Content
          </h2>
          <p className="mt-2">
            You retain ownership of the content you submit (startup profiles,
            comments, job listings, etc.). By submitting content, you grant
            AgriVentures India a non-exclusive, worldwide license to display,
            distribute, and promote your content on the Platform and related
            channels.
          </p>
          <p className="mt-2">You agree not to submit content that:</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5">
            <li>Is false, misleading, or deceptive</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains harmful, abusive, or offensive material</li>
            <li>Violates any applicable laws or regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            5. Startup Verification
          </h2>
          <p className="mt-2">
            Our verification process is a good-faith effort to validate
            submitted information. A verification badge does not constitute an
            endorsement, guarantee, or investment recommendation. Users should
            conduct their own due diligence before making any decisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            6. Introductions
          </h2>
          <p className="mt-2">
            The Platform facilitates introductions between users. AgriVentures
            India is not a party to any agreement, investment, or transaction
            that may result from these introductions. We bear no liability for
            the outcome of any interaction between users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            7. Prohibited Activities
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              Scraping, crawling, or automated data collection without written
              permission
            </li>
            <li>Attempting to gain unauthorized access to other accounts</li>
            <li>Spamming other users with unsolicited messages</li>
            <li>
              Using the Platform for any unlawful or fraudulent purpose
            </li>
            <li>Impersonating another person or entity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            8. Limitation of Liability
          </h2>
          <p className="mt-2">
            AgriVentures India is provided &quot;as is&quot; without warranties
            of any kind. We are not liable for any indirect, incidental,
            special, or consequential damages arising from your use of the
            Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            9. Termination
          </h2>
          <p className="mt-2">
            We reserve the right to suspend or terminate your account at any
            time for violation of these Terms. You may also delete your account
            at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            10. Governing Law
          </h2>
          <p className="mt-2">
            These Terms shall be governed by and construed in accordance with the
            laws of India. Any disputes shall be subject to the exclusive
            jurisdiction of the courts in Bengaluru, Karnataka.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            11. Contact
          </h2>
          <p className="mt-2">
            For questions about these Terms, please contact us at{" "}
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
