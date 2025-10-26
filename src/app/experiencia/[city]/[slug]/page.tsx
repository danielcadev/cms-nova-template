import Link from 'next/link'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'

async function loadExperience(city: string, slug: string) {
  return (prisma as any).experience.findFirst({
    where: {
      slug,
      locationAlias: city,
      published: true,
    },
  })
}

interface ExperiencePageProps {
  params: { city: string; slug: string }
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { city, slug } = params
  const experience = await loadExperience(city, slug)

  if (!experience) {
    notFound()
  }

  const durationLabelMap: Record<string, string> = {
    flexible: 'Flexible',
    'single-day': 'Single day',
    'multi-day': 'Multi-day',
    hourly: 'Hourly',
  }

  const dayLabelMap: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  }

  const scheduleDays = Array.isArray(experience.scheduleDays)
    ? (experience.scheduleDays as string[])
    : []
  const scheduleDayLabel = scheduleDays.map((day) => dayLabelMap[day] ?? day).join(', ')
  const durationTypeLabel = durationLabelMap[experience.durationType ?? 'flexible'] ?? 'Flexible'

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        <header className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            {experience.location ?? city}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
            {experience.title}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300">{experience.summary}</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70">
          <div className="prose prose-slate max-w-none dark:prose-invert">
            {experience.hostName && (
              <p>
                <strong>Host:</strong> {experience.hostName}
              </p>
            )}
            {experience.hostBio && <p>{experience.hostBio}</p>}
            <p>{experience.narrative}</p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {(experience.activities ||
            experience.duration ||
            experience.schedule ||
            scheduleDays.length > 0) && (
            <div className="rounded-xl border border-slate-200 bg-white/70 p-6 dark:border-slate-700 dark:bg-slate-900/70">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Plan</h2>
              <div className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {experience.durationType && (
                  <p>
                    <strong>Duration type:</strong> {durationTypeLabel}
                  </p>
                )}
                {experience.duration && (
                  <p>
                    <strong>Duration details:</strong> {experience.duration}
                  </p>
                )}
                {experience.activities && (
                  <p>
                    <strong>Activities:</strong>
                    <br />
                    {experience.activities}
                  </p>
                )}
                {scheduleDays.length > 0 && (
                  <p>
                    <strong>Available days:</strong> {scheduleDayLabel}
                  </p>
                )}
                {experience.schedule && (
                  <p>
                    <strong>Time window:</strong> {experience.schedule}
                  </p>
                )}
                {experience.scheduleNote && (
                  <p>
                    <strong>Schedule notes:</strong>
                    <br />
                    {experience.scheduleNote}
                  </p>
                )}
              </div>
            </div>
          )}

          {(experience.price || experience.inclusions || experience.exclusions) && (
            <div className="rounded-xl border border-slate-200 bg-white/70 p-6 dark:border-slate-700 dark:bg-slate-900/70">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Logistics
              </h2>
              <div className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {experience.price && (
                  <p>
                    <strong>Reference price:</strong> {experience.price}{' '}
                    <span className="uppercase">{experience.currency}</span>
                  </p>
                )}
                {experience.inclusions && (
                  <p>
                    <strong>Inclusions:</strong>
                    <br />
                    {experience.inclusions}
                  </p>
                )}
                {experience.exclusions && (
                  <p>
                    <strong>Exclusions:</strong>
                    <br />
                    {experience.exclusions}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div>Last updated: {new Date(experience.updatedAt).toLocaleDateString()}</div>
          <Link
            href="/admin/dashboard/templates/experiences"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Manage experiences
          </Link>
        </footer>
      </div>
    </div>
  )
}
