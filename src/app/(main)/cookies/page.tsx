import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | AgriVentures India",
  description: "Cookie policy for the AgriVentures India platform.",
}

export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Cookie Policy</h1>
      <p className="mt-2 text-sm text-slate-500">
        Last updated: March 2, 2026
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            What Are Cookies
          </h2>
          <p className="mt-2">
            Cookies are small text files stored on your device when you visit a
            website. They are widely used to make websites work efficiently and
            provide information to site operators.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            Cookies We Use
          </h2>
          <div className="mt-3 overflow-hidden rounded-lg border">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase text-slate-600">
                    Cookie
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase text-slate-600">
                    Purpose
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase text-slate-600">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-2.5 font-mono text-xs">
                    next-auth.session-token
                  </td>
                  <td className="px-4 py-2.5">
                    Maintains your authenticated session
                  </td>
                  <td className="px-4 py-2.5">30 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-xs">
                    next-auth.csrf-token
                  </td>
                  <td className="px-4 py-2.5">
                    Protects against cross-site request forgery
                  </td>
                  <td className="px-4 py-2.5">Session</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-xs">
                    next-auth.callback-url
                  </td>
                  <td className="px-4 py-2.5">
                    Remembers where to redirect after sign-in
                  </td>
                  <td className="px-4 py-2.5">Session</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            Third-Party Cookies
          </h2>
          <p className="mt-2">
            We do not use third-party advertising or tracking cookies.
            AgriVentures India does not serve ads or share browsing data with
            advertisers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            Managing Cookies
          </h2>
          <p className="mt-2">
            You can control cookies through your browser settings. Note that
            disabling essential cookies (session token, CSRF) will prevent you
            from signing in to your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
          <p className="mt-2">
            For questions about our use of cookies, contact us at{" "}
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
