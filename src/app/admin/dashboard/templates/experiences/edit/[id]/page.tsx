import { notFound } from 'next/navigation'
import { CreateExperienceForm } from '@/components/templates/Experience/CreateExperienceForm'
import { prisma } from '@/lib/prisma'
import type { ExperienceFormValues } from '@/schemas/experience'

interface EditExperiencePageProps {
  params: Promise<{ id: string }>
}

async function loadExperience(id: string) {
  return (prisma as any).experience.findUnique({ where: { id } })
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  const { id } = await params
  const experience = await loadExperience(id)

  if (!experience) {
    notFound()
  }

  const initialValues: ExperienceFormValues = {
    title: experience.title ?? '',
    slug: experience.slug ?? '',
    location: experience.location ?? '',
    durationType: experience.durationType ?? 'flexible',
    hostName: experience.hostName ?? '',
    hostBio: experience.hostBio ?? '',
    summary: experience.summary ?? '',
    narrative: experience.narrative ?? '',
    activities: experience.activities ?? '',
    duration: experience.duration ?? '',
    schedule: experience.schedule ?? '',
    scheduleDays: Array.isArray(experience.scheduleDays) ? experience.scheduleDays : [],
    scheduleNote: experience.scheduleNote ?? '',
    price: experience.price ?? '',
    currency: experience.currency ?? 'COP',
    inclusions: experience.inclusions ?? '',
    exclusions: experience.exclusions ?? '',
    gallery: Array.isArray(experience.gallery)
      ? (experience.gallery as string[]).filter(
          (value) => typeof value === 'string' && value.trim().length > 0,
        )
      : [],
    featured: experience.featured ?? false,
  }

  return (
    <CreateExperienceForm
      mode="edit"
      experienceId={experience.id}
      initialValues={initialValues}
      initialPublished={experience.published}
    />
  )
}
