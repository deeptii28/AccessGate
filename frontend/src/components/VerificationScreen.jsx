import { useState } from "react";

function VerificationScreen() {
  const [status, setStatus] = useState("Ready");

  const startVerification = () => {
    setStatus("Sending haptic pattern...");

    if ("vibrate" in navigator) {
      navigator.vibrate([200,100,400,100,200]);
      setStatus("Pattern sent. Tap the pattern back.");
    } else {
      setStatus("Haptic feedback is not supported on this device.");
    }
  };

  return (
    <main>
      <h1>AccessGate</h1>

      <p>
        Accessible verification using haptic patterns.
      </p>

      <button onClick={startVerification}>
        Start Verification
      </button>

      <p aria-live="polite">
        STATUS: {status}
      </p>
    </main>
  );
}

export default VerificationScreen;