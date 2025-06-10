
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const inputRef = useRef<HTMLInputElement[]>([]);
    const navigate = useNavigate();
    const { loading, verifyEmail } = useUserStore();

    const handleChange = (index: number, value: string) => {
        if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
        }
        // move to the next input field if a digit is entered..
        if (value !== "" && index < 5) {
            inputRef.current[index + 1].focus();
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move focus to previous input on backspace if current is empty
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRef.current[index - 1].focus();
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const verificationCode = otp.join("");
        
        if (verificationCode.length !== 6) {
            // You might want to show an error here
            return;
        }

        try {
            await verifyEmail(verificationCode);
            navigate("/");
        } catch (error) {
            console.error("Verification failed:", error);
            // Clear OTP on failure
            setOtp(["", "", "", "", "", ""]);
            if (inputRef.current[0]) {
                inputRef.current[0].focus();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-md">
                {/* Header with restaurant-themed decoration */}
                <div className="bg-orange-500 py-4 px-6">
                    <h1 className="text-2xl font-bold text-white text-center">TableReady</h1>
                </div>
                
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
                        <p className="text-gray-600">We've sent a 6-digit code to your email</p>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="flex justify-center gap-3 mb-8">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    ref={(el) => el && (inputRef.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold 
                                        border-2 border-gray-200 focus:border-orange-500 
                                        rounded-lg shadow-sm focus:ring-0"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-6 bg-orange-500 hover:bg-orange-600 
                                text-white font-semibold rounded-lg shadow-md 
                                transition-all duration-200"
                            disabled={loading || otp.join("").length !== 6}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify & Continue"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>Didn't receive a code? <button className="text-orange-500 font-medium">Resend</button></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
