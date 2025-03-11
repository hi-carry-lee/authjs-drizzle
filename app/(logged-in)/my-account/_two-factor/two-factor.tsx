"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { activate2fa, deActivate2fa, get2faSecret } from "./actions";
import toastUtil from "@/lib/toastUtil";
import { QRCodeSVG } from "qrcode.react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function TwoFactor({ twoFactorActivated }: { twoFactorActivated: boolean }) {
  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [otp, setOtp] = useState("");

  // query DB, if
  const handleEnableClick = async () => {
    const response = await get2faSecret();
    if (response.error) {
      toastUtil({ title: "QRcode", message: response.message });
      return;
    }
    setStep(2);
    setCode(response.twoFactorSecret ?? "");
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await activate2fa(otp);
    if (response?.error) {
      toastUtil({
        title: "Two-Factor Authentication",
        message: response.message,
      });
      return;
    }
    toastUtil({
      title: "Two-Factor Authentication",
      message: "Two-Factor Authentication has been enabled",
    });
    setIsActivated(true);
  };

  const handleDisable2faClick = async () => {
    const response = await deActivate2fa();
    if (response?.error) {
      toastUtil({
        title: "Two-Factor Authentication",
        message: response.message,
      });
      return;
    }
    toastUtil({
      title: "Two-Factor Authentication",
      message: "Disable Two-Factor Authentication successfully",
    });
    setIsActivated(false);
  };

  return (
    <div className="my-2">
      {!!isActivated && (
        <Button variant="destructive" onClick={handleDisable2faClick}>
          Disable Two-Factor Authentication
        </Button>
      )}
      {!isActivated && (
        <div>
          {step === 1 && (
            <Button onClick={handleEnableClick}>
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === 2 && (
            <div className="text-center">
              <p className="text-muted-foreground text-xs my-2">
                Scan the QR code below in the Google Authenticator app to active
                the Two-Factor Authentication
              </p>
              <div className="flex justify-center items-center">
                <QRCodeSVG value={code} />
              </div>
              <div className="flex flex-col justify-center gap-4 mt-2">
                <Button onClick={() => setStep(3)}>
                  I have scaned the QR code
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
              <p className="text-muted-foreground text-sm">
                Please enter the one-time passcode from the Google Authenticator
                app.
              </p>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button disabled={otp.length !== 6} type="submit">
                Submit and activate
              </Button>
              <Button onClick={() => setStep(2)} variant="outline">
                Cancel
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default TwoFactor;
