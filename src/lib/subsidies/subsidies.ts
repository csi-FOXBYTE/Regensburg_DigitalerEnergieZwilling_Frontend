export type Subsidy = {
  title: string;
  content: string;
  href: string;
  benefits: SubsidyBenefit;
};

export type SubsidyBenefit = {
  unit: string;
  for?: string;
} & (
  | { type: 'range'; from: number; to: number }
  | { type: 'upTo' | 'exactly'; value: number }
);
