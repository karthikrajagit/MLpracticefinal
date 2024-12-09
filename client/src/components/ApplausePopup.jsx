import React, { useState } from "react";

export default function ApplausePopup() {

  const [isVisible, setIsVisible] = useState(false);

  const triggerApplause = () => {
    setIsVisible(true);

    // Hide the popup after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  return (
    <div className="relative">
      {/* Submit Button */}
      <button
        onClick={triggerApplause}
        className="bg-green-600 text-white py-2 px-4 rounded"
      >
        Submit Code
      </button>

      {/* Applause Popup */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center transform transition-transform duration-500 scale-90 sm:scale-100">
            <div className="text-4xl text-yellow-500 mb-4">👏</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Congratulations! Code Accepted!
            </h2>
            <p className="text-gray-600 mb-6">
              Your code has been successfully accepted! 🎉
            </p>
            <button
              onClick={() => setIsVisible(false)}
              className="bg-green-600 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
