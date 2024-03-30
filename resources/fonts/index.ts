import { Inter, Source_Serif_4 } from "next/font/google";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const fontSourceSerif4 = Source_Serif_4({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-source-serif-pro",
});

export { fontInter, fontSourceSerif4 };
