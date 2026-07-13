import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./case-study.css";
import "./styles.css";

const root = document.getElementById("root")!;

function mount(app: React.ReactNode) {
  const wrapped = <StrictMode>{app}</StrictMode>;
  if (root.hasChildNodes()) hydrateRoot(root, wrapped);
  else createRoot(root).render(wrapped);
}

const isCaseStudyPath = /^\/work\/[^/]+\/?$/.test(window.location.pathname);

if (isCaseStudyPath) {
  void Promise.all([import("./CaseStudyPage"), import("./case-studies")]).then(
    ([{ CaseStudyPage }, { getCaseStudyByPath }]) => {
      const caseStudy = getCaseStudyByPath(window.location.pathname);
      if (!caseStudy) return;
      mount(<CaseStudyPage study={caseStudy} />);
    },
  );
} else {
  mount(<App />);
}
