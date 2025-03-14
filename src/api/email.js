import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../config/firebase";

const functions = getFunctions(app);

export const sendApprovalEmail = async (email, loanId, status) => {
  try {
    const sendEmailFunction = httpsCallable(functions, "sendApprovalEmail");
    const response = await sendEmailFunction({ email, loanId, status });
    console.log("Email response:", response.data);
  } catch (error) {
    console.error("Error sending approval email:", error.message);
  }
};
