import type { Metadata } from "next";
import { asset } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tolga Osman - CV",
};

export default function CVPage() {
  return (
    <div className="fixed inset-0 z-[100] h-screen w-screen bg-bg">
      <iframe
        src={asset("/osman cv.pdf")}
        className="h-full w-full border-none"
        title="Tolga Osman CV"
      />
    </div>
  );
}
