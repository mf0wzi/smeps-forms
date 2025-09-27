import Image from "next/image";
import GuestLayout from "@/components/layout/guest-layout";
import { Hero } from "@/components/features/hero";

export default function Home() {
  return (
    <GuestLayout>
      <Hero />
    </GuestLayout>
  );
}
