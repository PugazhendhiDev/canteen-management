import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import { Html5QrcodeScanner } from "html5-qrcode";
import CryptoJS from "crypto-js";

function Home() {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedText, setScannedText] = useState("");
  const navigate = useNavigate();

  const handleScanSuccess = useCallback(
    (encryptedText, scanner) => {
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedText,
          import.meta.env.VITE_EMAIL_ENCRYPTION_SECRET_KEY
        );
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) throw new Error("Invalid or corrupted QR");

        setScannedText(decryptedText);

        scanner.clear().then(() => {
          setShowScanner(false);
          navigate(`/order-page/${decryptedText}`);
        });
      } catch (err) {
        scanner.clear().then(() => setShowScanner(false));
        toast.error("Invalid or corrupted QR code.");
      }
    },
    [navigate]
  );

  useEffect(() => {
    let scanner;

    if (showScanner) {
      scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

      scanner.render(
        (decodedText) => handleScanSuccess(decodedText, scanner),
        (error) => {
          toast.error("Scan error:", error);
        }
      );
    }

    return () => {
      if (scanner)
        scanner.clear().catch((err) => toast.error("Clear error", err));
    };
  }, [showScanner, handleScanSuccess]);

  const handleScanClick = () => {
    setScannedText("");
    setShowScanner(true);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-app-details">
          <div className="page-app-logo">
            <img src={Logo} alt="App Logo" />
          </div>
          <h1 className="page-app-title">{import.meta.env.VITE_APP_NAME}</h1>
        </div>
        <div className="page-app-profile">
          <Link to="/profile">
            <ProfileIcon />
          </Link>
        </div>
      </div>

      <div className="page-container">
        <div className="page-body">
          <h2>Counter</h2>
          <div className="qr-wrapper">
            <div className="qr">
              {showScanner ? (
                <div id="reader" className="qr-reader"></div>
              ) : scannedText ? (
                <p className="scan-result">Scanned: {scannedText}</p>
              ) : (
                <p>Click the Scan button to scan.</p>
              )}
            </div>
          </div>

          {!showScanner && (
            <div className="btn">
              <button className="qr-btn" onClick={handleScanClick}>
                Scan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
