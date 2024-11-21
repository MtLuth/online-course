"use client";

import FeaturesSection from "@/components/FeaturesSection";
import LandingHero from "@/sections/(landing)/LandingHero";
import LandingCourses from "@/components/LandingCourses";
import PageRegister from "@/components/PageRegister";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function ElearningView() {
  return (
    <>
      <LandingHero />
      <FeaturesSection />
      <LandingCourses />
      <PageRegister />
      <TestimonialsSection />
    </>
  );
}
