export const sendVerificationCode = async (email, code) => {
  try {
    const response = await fetch(
      "http://192.168.0.104:5000/send-verification",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      }
    );

    const data = await response.json();
    console.log("EMAIL RESPONSE:", data);

    if (!data.success) throw new Error("Email not sent");
  } catch (error) {
    console.error("sendVerificationCode error:", error);
  }
};
