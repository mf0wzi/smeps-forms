// app/(app)/forms/create/page.tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const SurveyCreator = dynamic(() => import("survey-creator-react").then(m => m.SurveyCreatorWidget || m.default || m.SurveyCreator), { ssr: false });

export default function CreateForm() {
  useEffect(() => {
    // you can mount Survey Creator here after dynamic import
  }, []);

  return (
    <div>
      <h1>Create Survey</h1>
      {/* Replace with the actual Survey Creator component usage per the SurveyJS docs */}
      <div id="survey-creator-root" />
    </div>
  );
}
