import Tesseract from "tesseract.js";

export const processDocument = async (file) => {
  const { data: { text } } = await Tesseract.recognize(file, "eng");
  console.log(text); // Full text extracted from image

  // Now parse the important fields:
  const aadharNumber = await extractAadharNumber(text);
  const name = await extractName(text);
  const dob = await extractDOB(text);

  return { aadharNumber, name, dob };
};

const extractAadharNumber = (text) => {
  const regex = /\b\d{4}\s\d{4}\s\d{4}\b/; 
  const match = text.match(regex);
  return match ? match[0].replace(/\s/g, "") : null; // Remove spaces
};

export const extractName = (text) => {
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
  
    let candidates = [];
  
    for (let line of lines) {
      const cleanedLine = line.replace(/[^a-zA-Z\s\.]/g, ''); // Keep letters, spaces, dots
      const words = cleanedLine.trim().split(/\s+/);
  
      // Relax the word count if needed (2-8 words is common for names)
      if (words.length < 2 || words.length > 8) continue; 
  
      // Check if more than 60% of the words are properly capitalized (first letter uppercase)
      const properCasingScore = words.filter(w => /^[A-Z][a-z]*$/.test(w) || /^[A-Z]\.$/.test(w)).length;
  
      if (properCasingScore / words.length >= 0.6) {
        candidates.push(cleanedLine.trim());
      }
    }
  
    if (candidates.length === 0) return null;
  
    // Pick first decent candidate (could be extended to return top matches based on score)
    return candidates[0]; 
  };

const extractDOB = (text) => {  
    const regex = /DOB:\s*(\d{2}\/\d{2}\/\d{4})/; // Adjust regex based on actual format
    const match = text.match(regex);
    return match ? match[1].trim() : null;
};    

// helper functions: extractAadharNumber, extractName, extractDOB
