import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp.jsx";
import { Input } from "@/components/ui/input.jsx";

function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(null);
  const { verifyOtp, resendOtp, isAuthenticated } = useAuth();
  const location = useLocation();
  const email = location.state?.email;

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      await verifyOtp(email, otp);
    } catch (error) {
      setErrorMessage("Invalid or expired OTP. Please try again.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setErrorMessage(null);
    setResendSuccess(null);

    try {
      await resendOtp(email);
      setResendSuccess("OTP has been resent successfully.");
    } catch (error) {
      setErrorMessage("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white px-4 py-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary text-center mb-4">
          OTP Verification
        </h1>
        <p className="text-center mb-6">
          An OTP has been sent to {email}. Please enter it below to verify your
          account.
        </p>

        <form
          onSubmit={handleVerifyOtp}
          className="flex items-center flex-col gap-4"
        >
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {/* <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP..."
          /> */}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="animate-spin text-white me-2" />{" "}
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>

        {resendSuccess && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 text-center rounded">
            {resendSuccess}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 text-center rounded">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={handleResendOtp}
            className="text-blue-500 underline"
            disabled={loading}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtpPage;
