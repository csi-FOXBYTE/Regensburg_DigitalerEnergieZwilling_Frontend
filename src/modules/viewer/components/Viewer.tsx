import { useTranslation } from "react-i18next";
import { initializeI18Next } from "../../../shared/locales";

initializeI18Next();

export default function Viewer() {
  const { t } = useTranslation("viewer");

  return (
    <>
      This is the Viewer!
      <br />
      {t("hello-world")}
    </>
  );
}
