import axios from "axios";

export async function fetchGASData() {
  const url =
    "https://script.google.com/macros/s/AKfycbzamJduXgtsdlXrvG3wmkcS3tlYTNAVzNzJaKPDMmz035vzvbYD7wvrB2YDAQdFsgOh/exec"; // GASで取得したURL
  try {
    const response = await axios.get(url);
    console.log("Sheet Data:", response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//https://script.google.com/macros/s/AKfycbzamJduXgtsdlXrvG3wmkcS3tlYTNAVzNzJaKPDMmz035vzvbYD7wvrB2YDAQdFsgOh/exec
