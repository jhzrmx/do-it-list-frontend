import PrimaryButton from "@/components/PrimaryButton";
import TermsContent from "@/components/TermsContent";
import { useState } from "react";
import Logo from "../assets/logo.svg";

const TermsAndCond = () => {
  const [canAccept, setCanAccept] = useState(false);

  return (
    <div className="w-full h-dvh bg-primary flex items-center justify-center">
      <div className="w-full h-[85dvh] bg-secondary rounded-tl-4xl rounded-br-4xl flex items-center justify-center">
        <div className="flex flex-col items-center w-full max-w-sm px-4">
          <div className="flex flex-row items-center">
            <img src={Logo} className="w-28" />
            <h1 className="font-bold text-4xl text-primary text-center m-4">
              Do it list!
            </h1>
          </div>
          <div className="w-full bg-semi-primary rounded-4xl p-6 mt-8">
            <h1 className="font-bold text-center text-xl mb-6">
              Terms and Conditions
            </h1>
            <TermsContent
              heightClass="h-48"
              onScrollEnd={(atBottom) => setCanAccept(atBottom)}
            />
            <PrimaryButton
              content="Accept"
              onClick={() => (window.location.href = "/")}
              disabled={!canAccept}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndCond;
