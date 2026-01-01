"use client";

import { cn } from "@/lib/utils";
import { LogoCloud } from "@/components/ui/logo-cloud-3";

const logos = [
  {
    src: "https://svgl.app/library/github_wordmark_light.svg",
    alt: "GitHub",
  },
  {
    src: "https://svgl.app/library/vercel_wordmark.svg",
    alt: "Vercel",
  },
  {
    src: "https://svgl.app/library/supabase_wordmark_light.svg",
    alt: "Supabase",
  },
  {
    src: "https://svgl.app/library/openai_wordmark_light.svg",
    alt: "OpenAI",
  },
  {
    src: "https://svgl.app/library/nvidia-wordmark-light.svg",
    alt: "NVIDIA",
  },
  {
    src: "https://svgl.app/library/aws-wordmark_light.svg",
    alt: "AWS",
  },
  {
    src: "https://svgl.app/library/google-wordmark-light.svg",
    alt: "Google",
  },
  {
    src: "https://svgl.app/library/microsoft-wordmark-light.svg",
    alt: "Microsoft",
  },
];

export function SponsorsSection() {
  return (
    <section className="relative w-full py-16 md:py-20 bg-black/20">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-0 -z-10 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full",
          "blur-[60px] opacity-20"
        )}
        style={{ backgroundColor: "rgba(125, 13, 44, 0.3)" }}
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <h2 className="mb-8 text-center font-semibold text-white text-2xl tracking-tight md:text-4xl">
          Our Sponsors
        </h2>
        
        <div className="mx-auto my-6 h-px max-w-xs bg-white/10 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />

        <LogoCloud logos={logos} className="my-8" />

        <div className="mt-6 h-px bg-white/10 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
      </div>
    </section>
  );
}
