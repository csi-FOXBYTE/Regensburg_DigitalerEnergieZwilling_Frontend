# Styles

# Localization

Municipality-specific translated values are collected in one namespace per
locale:

- `public/locales/de/municipality.json`
- `public/locales/en/municipality.json`

Feature translations keep their complete sentences and include these values
with i18next nesting. For example:

```json
{
  "placeHolder": "Adresse suchen in $t(municipality:name)..."
}
```

Do not replace nested municipality values with values from the TypeScript
configuration. Display names can vary by locale, for example `Köln` in German
and `Cologne` in English.

## Municipality namespace

For every supported locale, another customer must review all values in
`municipality.json`:

- `name`: localized municipality display name.
- `administration`: official and generic localized names of the municipal
  administration.
- `dataSubmission.server`: localized name used for the system that stores
  submitted building data.
- `energyAdvice.providerName`: localized name of the local energy-advice
  provider.
- `buildingData`: municipality key, localized publisher attribution, source
  link label, and source update frequency.
- `imprint`: contact, publisher, content responsibility, system administration,
  addresses, legal descriptions, and identification numbers.

Keep the same key structure in every locale. Values do not need to be literal
translations when an organization has a different established name in that
language.

## Customer-specific translation review

Changing the namespace values replaces names and other repeated facts, but a
new customer must also verify that the surrounding claims are accurate:

- `public/locales/*/energyCalculation.json`: consent, data donation, deletion,
  heat-planning purpose, privacy summary, and local energy-advice wording.
- `public/locales/*/map.json`: data-deletion and municipal-server wording.
- `public/locales/*/methodology.json`: building-data source, publisher, update
  frequency, processing, and other source-specific statements.
- `public/locales/*/common.json`: imprint labels and any remaining legal or
  privacy wording that is intentionally shared between customers.

The full privacy notice is maintained separately in
`src/content/privacy-notice.de.md`. It contains municipality-, infrastructure-,
provider-, and jurisdiction-specific text that cannot use i18next nesting and
must be reviewed as a whole. The privacy page currently renders this German
source for every locale; additional localized notices require corresponding
content files and locale-aware selection in the privacy page.

## Adding a locale

When adding another locale, create all existing namespace files under
`public/locales/<locale>/`, including `municipality.json`. Then register the
locale in `astro.config.mjs`. The municipality namespace itself is already
registered globally and typed through `src/i18next.d.ts`.
