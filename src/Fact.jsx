import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const FACT_API_URL = "https://catfact.ninja/fact";

function useRandomFact(factKey) {
  const [data, setData] = useState({ fact: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFact = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(FACT_API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch fact");
        }
        const result = await response.json();
        console.log(result.fact);
        setData(result);
      } catch (err) {
        // Set the error state with a custom error message
        setError(new Error("Failed to fetch fact. Please try again later."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFact();
  }, [factKey]);

  return { data, error, isLoading };
}

export default function RandomFactGenerator() {
  const [factKey, setFactKey] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState(getRandomColor());

  const { data, error, isLoading } = useRandomFact(factKey);

  function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  }

  const generateNewFact = () => {
    setFactKey(factKey + 1);
    setBackgroundColor(getRandomColor());
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <div className="max-w-2xl w-full">
        <motion.div
          key={factKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 mb-6"
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Random Cat Fact
          </h1>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-32"
              >
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
              </motion.div>
            ) : error ? (
              <motion.p
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-center"
              >
                Error: {error.message}
              </motion.p>
            ) : (
              <motion.p
                key="fact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl text-gray-700 text-center mb-6"
              >
                {data.fact}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
        <div className="flex justify-center">
          <button
            onClick={generateNewFact}
            disabled={isLoading}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition-all duration-200 hover:scale-105"
          >
            Generate New Fact
          </button>
        </div>
      </div>
    </div>
  );
}
