export type DepreciationMethod = 'STRAIGHT_LINE' | 'DECLINING_BALANCE' | 'UNITS_OF_PRODUCTION';

export function calculateDepreciation(
  cost: number,
  salvageValue: number,
  usefulLife: number,
  method: DepreciationMethod,
  year: number,
  unitsProduced?: number,
  totalEstimatedUnits?: number
): { 
  yearlyDepreciation: number;
  accumulatedDepreciation: number;
  bookValue: number;
} {
  switch (method) {
    case 'STRAIGHT_LINE':
      return calculateStraightLineDepreciation(cost, salvageValue, usefulLife, year);
    case 'DECLINING_BALANCE':
      return calculateDecliningBalanceDepreciation(cost, salvageValue, usefulLife, year);
    case 'UNITS_OF_PRODUCTION':
      if (!unitsProduced || !totalEstimatedUnits) {
        throw new Error('Units produced and total estimated units are required for units of production method');
      }
      return calculateUnitsOfProductionDepreciation(
        cost, 
        salvageValue, 
        unitsProduced, 
        totalEstimatedUnits
      );
    default:
      throw new Error('Invalid depreciation method');
  }
}

function calculateStraightLineDepreciation(
  cost: number,
  salvageValue: number,
  usefulLife: number,
  year: number
) {
  const depreciableAmount = cost - salvageValue;
  const yearlyDepreciation = depreciableAmount / usefulLife;
  const accumulatedDepreciation = Math.min(yearlyDepreciation * year, depreciableAmount);
  const bookValue = cost - accumulatedDepreciation;

  return {
    yearlyDepreciation,
    accumulatedDepreciation,
    bookValue
  };
}

function calculateDecliningBalanceDepreciation(
  cost: number,
  salvageValue: number,
  usefulLife: number,
  year: number
) {
  const rate = 2 / usefulLife; // Double declining rate
  let bookValue = cost;
  let accumulatedDepreciation = 0;
  let yearlyDepreciation = 0;

  for (let i = 1; i <= year; i++) {
    yearlyDepreciation = bookValue * rate;
    
    // Switch to straight-line if it results in a larger depreciation
    const remainingYears = usefulLife - i + 1;
    const straightLineAmount = (bookValue - salvageValue) / remainingYears;
    
    if (straightLineAmount > yearlyDepreciation) {
      yearlyDepreciation = straightLineAmount;
    }

    // Don't depreciate below salvage value
    if (bookValue - yearlyDepreciation < salvageValue) {
      yearlyDepreciation = bookValue - salvageValue;
    }

    accumulatedDepreciation += yearlyDepreciation;
    bookValue -= yearlyDepreciation;
  }

  return {
    yearlyDepreciation,
    accumulatedDepreciation,
    bookValue
  };
}

function calculateUnitsOfProductionDepreciation(
  cost: number,
  salvageValue: number,
  unitsProduced: number,
  totalEstimatedUnits: number
) {
  const depreciableAmount = cost - salvageValue;
  const depreciationPerUnit = depreciableAmount / totalEstimatedUnits;
  const yearlyDepreciation = depreciationPerUnit * unitsProduced;
  const accumulatedDepreciation = yearlyDepreciation;
  const bookValue = cost - accumulatedDepreciation;

  return {
    yearlyDepreciation,
    accumulatedDepreciation,
    bookValue
  };
}
