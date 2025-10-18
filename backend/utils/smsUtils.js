import axios from "axios";

export const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

export const sendOneApiOtp = async (number, otp) => {
    try {
        const smsdata = {
            apiKey: process.env.ONEAPI_SMS_API_KEY,
            brandName: "PrintLab",
            customerName: "User",
            number: number,
            otp: otp,
        };

        const response = await axios.post("https://backend.oneapi.in/sms/sendotp", smsdata);

        if (!response.data.success) {
            console.error("OneAPI Response Error:", response.data.msg);
            return { success: false, msg: response.data.msg || "Failed to send OTP" };
        }

        return { success: true, msg: "OTP Sent Successfully", otp: smsdata.otp };
    } catch (error) {
        console.error("OneAPI Error: ", error.message);

        return {
            success: false,
            msg: error.message || "Failed to send OTP. Please try again.",
        };
    }
};
