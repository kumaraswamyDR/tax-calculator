import { useState } from "react";
import { Input, Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

const standardDeduction = 75000

const calculateNewTax = (grossIncome: number): number => {

  const income  =  grossIncome - standardDeduction
  if (income <= 1200000) return 0;
  
  let tax = 0;
  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 0.05 },
    { limit: 1200000, rate: 0.1 },
    { limit: 1600000, rate: 0.15 },
    { limit: 2000000, rate: 0.2 },
    { limit: 2400000, rate: 0.25 },
    { limit: Infinity, rate: 0.3 },
  ];

  let previousLimit = 0;

  for (const slab of slabs) {
    if (income > previousLimit) {
      const taxableAmount = Math.min(income, slab.limit) - previousLimit;
      tax += taxableAmount * slab.rate;
      previousLimit = slab.limit;
    } else {
      break;
    }
  }
  return tax;
};

const calculateOldTax = (grossIncome: number): number => {
  const income  =  grossIncome - standardDeduction
  if (income <= 1200000) return 0;
  if (income <= 400000) return 0;
  
  let tax = 0;
  const slabs = [
    { limit: 300000, rate: 0 },
    { limit: 700000, rate: 0.05 },
    { limit: 1000000, rate: 0.1 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.2 },
    { limit: Infinity, rate: 0.3 },
  ];

  let previousLimit = 0;

  for (const slab of slabs) {
    if (income > previousLimit) {
      const taxableAmount = Math.min(income, slab.limit) - previousLimit;
      tax += taxableAmount * slab.rate;
      previousLimit = slab.limit;
    } else {
      break;
    }
  }
  return tax;
};

export default function TaxCalculator() {
  const [income, setIncome] = useState<string>("");
  const [tax, setTax] = useState<number | null>(null);
  const [oldTax, setOldTax] = useState<number | null>(null);

  const handleCalculate = () => {
    const annualIncome = parseFloat(income);
    if (!isNaN(annualIncome) && annualIncome >= 0) {
      setTax(calculateNewTax(annualIncome));
      setOldTax(calculateOldTax(annualIncome));
    } else {
      setTax(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-8 bg-gray-100 shadow-lg rounded-2xl border border-gray-300"
    >
      <Typography variant="h2" className="text-center text-blue-700 font-bold mb-6"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        Income Tax Calculator (India - 2025)
      </Typography>

      <Typography variant="paragraph" className="text-center text-gray-700 mb-6"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        Enter your Gross annual income to calculate the estimated tax based on the current tax slabs.
      </Typography>

      <div className="flex flex-col gap-4">
        <Input
          label="Gross Annual Income (Rs)"
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="text-lg px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        />
        
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            className="w-full py-3 text-lg font-semibold bg-blue-700 text-white hover:bg-blue-800 transition duration-300 rounded-lg"
            onClick={handleCalculate} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Calculate Tax
          </Button>
        </motion.div>
      </div>

      {tax !== null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-6 text-2xl font-semibold text-center text-green-700"
        >
          Estimated New Tax: Rs {tax.toFixed(2)}
        </motion.p>
      )}
      {oldTax !== null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-6 text-2xl font-semibold text-center text-green-700"
        >
          Estimated Old Tax: Rs {oldTax.toFixed(2)}
        </motion.p>
      )}

      {tax !== null && oldTax !== null && 
       <motion.p
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ duration: 0.3 }}
       className="mt-6 text-2xl font-semibold text-center text-green-700"
     >
       Saving: Rs {oldTax - tax}
       <p>We have Deducted the standard deduction of 750000</p>
     </motion.p>}

      <Card className="mt-8"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <CardBody  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <Typography variant="h3" className="text-center text-gray-800 mb-4"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Tax Slabs (2025)</Typography>
          <table className="w-full table-auto text-sm text-gray-600">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-left">Income Range (Rs)</th>
                <th className="px-4 py-2 text-left">Tax Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { limit: 400000, rate: "0%" },
                { limit: 800000, rate: "5%" },
                { limit: 1200000, rate: "10%" },
                { limit: 1600000, rate: "15%" },
                { limit: 2000000, rate: "20%" },
                { limit: 2400000, rate: "25%" },
                { limit: Infinity, rate: "30%" },
              ].map((slab, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    {slab.limit === Infinity ? "Above Rs 24,00,000" : `Up to Rs ${slab.limit.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-2">{slab.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </motion.div>
  );
}