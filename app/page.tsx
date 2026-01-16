import Image from "next/image";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      <Header />
      <Hero />
      <About />
      <Products />
      <Contact />
      <Footer />
    </main>
  );
}
