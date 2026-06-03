// src/hooks/useActiveDezConfig.ts
import type {
  Subsidy,
  SubsidyBenefit,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';

export interface Foerderprogramm {
  id: string;
  name: string;
  link?: string;
  promotionType: 'percent' | 'absolute';
  promotionAmount: number;
  maxPromotionAmount?: number;
  isActive: boolean;
  description: string;
}

export function foerderprogrammToSubsidy(f: Foerderprogramm): Subsidy {
  const unit = f.promotionType === 'percent' ? '%' : '€';

  const benefits: SubsidyBenefit =
    f.maxPromotionAmount != null && f.maxPromotionAmount !== f.promotionAmount
      ? {
          type: 'range',
          from: f.promotionAmount,
          to: f.maxPromotionAmount,
          unit,
        }
      : f.promotionType === 'absolute'
        ? { type: 'exactly', value: f.promotionAmount, unit }
        : { type: 'upTo', value: f.promotionAmount, unit };

  return {
    title: f.name,
    content: f.description,
    href: f.link ?? '',
    benefits,
  };
}
