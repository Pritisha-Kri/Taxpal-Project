const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   POST /api/tax/estimate
// @desc    Calculate tax estimate for freelancer
// @access  Private
router.post('/estimate', 
  authenticateToken,
  [
    body('income').isNumeric().withMessage('Income must be a number'),
    body('expenses').optional().isNumeric().withMessage('Expenses must be a number'),
    body('taxYear').optional().isInt({ min: 2020, max: 2030 }).withMessage('Invalid tax year'),
    body('country').optional().isString().withMessage('Country must be a string')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { income, expenses = 0, taxYear = new Date().getFullYear(), country } = req.body;
      const userCountry = country || req.user.country || 'US';

      // Calculate net income
      const netIncome = income - expenses;

      // Get tax calculation based on country
      const taxCalculation = calculateTax(netIncome, userCountry, taxYear);

      res.json({
        success: true,
        message: 'Tax estimate calculated successfully',
        data: {
          calculation: {
            userId: req.user._id,
            income,
            expenses,
            netIncome,
            taxYear,
            country: userCountry,
            ...taxCalculation,
            calculatedAt: new Date()
          }
        }
      });

    } catch (error) {
      console.error('Tax calculation error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error calculating tax estimate'
      });
    }
  }
);

// Helper function to calculate tax based on country
function calculateTax(netIncome, country, taxYear) {
  const brackets = getTaxBrackets(country, taxYear);
  
  let totalTax = 0;
  let remainingIncome = netIncome;
  let effectiveRate = 0;
  let marginalRate = 0;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const taxableAtThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    const taxAtThisBracket = taxableAtThisBracket * (bracket.rate / 100);
    
    totalTax += taxAtThisBracket;
    remainingIncome -= taxableAtThisBracket;
    
    if (taxableAtThisBracket > 0) {
      marginalRate = bracket.rate;
    }
  }

  effectiveRate = netIncome > 0 ? (totalTax / netIncome) * 100 : 0;

  // Self-employment tax (for US)
  let selfEmploymentTax = 0;
  if (country === 'US' && netIncome > 0) {
    selfEmploymentTax = Math.min(netIncome * 0.1413, 160200 * 0.1413);
  }

  const totalTaxOwed = totalTax + selfEmploymentTax;
  const afterTaxIncome = netIncome - totalTaxOwed;

  return {
    incomeTax: Math.round(totalTax * 100) / 100,
    selfEmploymentTax: Math.round(selfEmploymentTax * 100) / 100,
    totalTax: Math.round(totalTaxOwed * 100) / 100,
    afterTaxIncome: Math.round(afterTaxIncome * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    marginalRate: marginalRate,
    quarterlyPayment: Math.round((totalTaxOwed / 4) * 100) / 100
  };
}

// Helper function to get tax brackets by country
function getTaxBrackets(country, taxYear) {
  const brackets = {
    'US': [
      { min: 0, max: 11000, rate: 10 },
      { min: 11000, max: 44725, rate: 12 },
      { min: 44725, max: 95375, rate: 22 },
      { min: 95375, max: 182050, rate: 24 },
      { min: 182050, max: 231250, rate: 32 },
      { min: 231250, max: 578125, rate: 35 },
      { min: 578125, max: Infinity, rate: 37 }
    ]
  };

  return brackets[country] || brackets['US'];
}

module.exports = router;
