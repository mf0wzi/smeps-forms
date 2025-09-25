// app/components/survey/SurveyCreatorClient.tsx
"use client";

import React from "react";

// model (class) from core
import { SurveyCreatorModel } from "survey-creator-core";
// React wrapper UI component
import { SurveyCreatorComponent } from "survey-creator-react";

// CSS (required)
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";

type Props = { initialJson?: any };

export default function SurveyCreatorClient({ initialJson = {} }: Props) {
  // typed ref for the model instance
  const creatorRef = React.useRef<SurveyCreatorModel | null>(null);

  // create the model only once
  if (!creatorRef.current) {
    // options type is ICreatorOptions from survey-creator-core if you want to type it
    const options = {
      showLogicTab: true,
      showJSONEditorTab: true,
      isAutoSave: false,
    };

    // create instance using the core's SurveyCreatorModel
    creatorRef.current = new SurveyCreatorModel(options);

    // seed JSON if provided
    if (initialJson && Object.keys(initialJson).length) {
      creatorRef.current.JSON = initialJson;
    }

    // attach a save handler (example saves to your API route)
    creatorRef.current.saveSurveyFunc = async (saveNo: number, callback: (saveNo: number, ok: boolean) => void) => {
      try {
        const json = creatorRef.current!.JSON;
        const res = await fetch("/api/surveys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: json.title ?? "Untitled", json }),
        });
        if (!res.ok) throw new Error("Failed to save survey");
        callback(saveNo, true);
      } catch (err) {
        console.error("saveSurvey error", err);
        callback(saveNo, false);
      }
    };
  }

  // keep creator JSON in sync if initialJson changes (optional)
  React.useEffect(() => {
    if (creatorRef.current && initialJson && Object.keys(initialJson).length) {
      creatorRef.current.JSON = initialJson;
    }
  }, [initialJson]);

  // render the React wrapper and pass the model instance via `creator` prop
  return (
    <div style={{ height: 700 }}>
      <SurveyCreatorComponent creator={creatorRef.current!} />
    </div>
  );
}
