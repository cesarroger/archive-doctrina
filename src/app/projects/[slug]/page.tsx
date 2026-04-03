import { projects, projectsBySlug } from "@/data/projects";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projectsBySlug.get(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="grain min-h-screen bg-[var(--background)] px-6 py-8 text-[var(--foreground)] sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between border-b border-black/8 pb-6">
          <Link
            href="/"
            className="editorial-kicker text-[11px] text-black/48 transition-colors hover:text-black"
          >
            Return To Void
          </Link>
          <p className="editorial-kicker text-[11px] text-black/38">
            {project.category} · {project.year}
          </p>
        </div>

        <section className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="editorial-kicker text-[11px] text-black/42">{project.location}</p>
            <h1 className="mt-4 max-w-4xl font-display text-6xl leading-[0.92] tracking-[0.02em] text-stone-950 sm:text-8xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/56 sm:text-xl">
              {project.description}
            </p>
          </div>

          <div
            className="aspect-[4/5] rounded-[2rem] border border-white/70 shadow-[0_40px_100px_rgba(0,0,0,0.08)]"
            style={{
              background: `linear-gradient(160deg, ${project.posterAccent} 0%, rgba(255,255,255,0.95) 44%, ${project.frameTone} 100%)`,
            }}
          />
        </section>

        <section className="grid gap-6 border-y border-black/8 py-8 sm:grid-cols-3">
          <div>
            <p className="editorial-kicker text-[11px] text-black/38">Duration</p>
            <p className="mt-2 text-lg text-stone-950">{project.duration}</p>
          </div>
          <div>
            <p className="editorial-kicker text-[11px] text-black/38">Format</p>
            <p className="mt-2 text-lg text-stone-950">{project.category}</p>
          </div>
          <div>
            <p className="editorial-kicker text-[11px] text-black/38">Studio</p>
            <p className="mt-2 text-lg text-stone-950">Archive Doctrina</p>
          </div>
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-2">
          {project.detailSections.map((section) => (
            <article
              key={section.heading}
              className="rounded-[2rem] border border-black/6 bg-white/66 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.05)] backdrop-blur-sm"
            >
              <p className="editorial-kicker text-[11px] text-black/38">{section.heading}</p>
              <p className="mt-4 text-base leading-8 text-black/58">{section.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
