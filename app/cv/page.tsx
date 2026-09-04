import type { Metadata } from "next";
import CvViewer from "./CvViewer";

export const metadata: Metadata = {
  title: "Tolga Osman - CV",
};

export default function CVPage() {
  return <CvViewer />;
}
