export const brand = {
  companyName: 'Nexora Capital', shortName: 'Nexora', logo: 'N', favicon: '/favicon.ico',
  supportEmail: 'support@nexora.example', companyEmail: 'hello@nexora.example', primaryDomain: 'nexora.example',
  legalCompanyName: 'Nexora Capital Labs LLC', address: 'Demo address — configure before production',
  social: { x: '#', linkedin: '#', github: '#' },
  colors: { primary: '#2ff2a0', cyan: '#54d6ff', midnight: '#07111f' },
  currency: { default: 'USDT', locale: 'en-US' }, fees: { platformPercent: 0, performancePercent: 20 },
  minimumInvestment: 500, withdrawal: { minimum: 100, feePercent: 0.5 }, maintenanceMode: false,
  riskDisclosure: 'Cryptocurrency trading involves substantial risk. Past performance does not guarantee future results.'
} as const;
export type Brand = typeof brand;
