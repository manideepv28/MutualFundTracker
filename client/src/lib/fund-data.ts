export interface NAVData {
  current: number;
  historical: number[];
}

export const MOCK_NAV_DATA: Record<string, NAVData> = {
  'HDFC Top 100 Fund': { 
    current: 580.45, 
    historical: [565.20, 572.10, 578.30, 580.45] 
  },
  'SBI Blue Chip Fund': { 
    current: 45.67, 
    historical: [44.20, 44.85, 45.30, 45.67] 
  },
  'ICICI Prudential Value Discovery Fund': { 
    current: 156.89, 
    historical: [152.30, 154.20, 155.80, 156.89] 
  },
  'Axis Bluechip Fund': { 
    current: 42.34, 
    historical: [41.20, 41.80, 42.10, 42.34] 
  },
  'Mirae Asset Large Cap Fund': { 
    current: 85.23, 
    historical: [83.10, 84.20, 84.90, 85.23] 
  },
  'Franklin India Equity Fund': { 
    current: 128.56, 
    historical: [125.30, 126.80, 127.90, 128.56] 
  }
};

export const FUND_OPTIONS = Object.keys(MOCK_NAV_DATA);

export function getCurrentNAV(fundName: string): number {
  return MOCK_NAV_DATA[fundName]?.current || 0;
}

export function getHistoricalNAV(fundName: string): number[] {
  return MOCK_NAV_DATA[fundName]?.historical || [];
}
