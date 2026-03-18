import { useStore } from "@nanostores/react"
import { $step } from "./state"
import { useTranslation } from "react-i18next";

function ProgressBarTick() {
  <button>
    
  </button>
}

export default function ProgressBar() {
  const step = useStore($step);
  const {t} = useTranslation("steps");

  const label = t("0");

  return <nav>
    {label}
  </nav>
}