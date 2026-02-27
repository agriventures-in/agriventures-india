import { ArticleForm } from "@/components/admin/article-form"

export const metadata = {
  title: "Create Article",
}

export default function CreateArticlePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Article</h1>
        <p className="mt-1 text-sm text-slate-500">
          Write a new knowledge article for the platform.
        </p>
      </div>

      <ArticleForm />
    </div>
  )
}
