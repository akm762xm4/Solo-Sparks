import React from "react";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showQuestComplete,
  showReflectionSubmitted,
  showRewardRedeemed,
} from "../../utils/toast";

export const ToastExample: React.FC = () => {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-black dark:text-white">
        Toast Examples
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => showSuccess("Operation completed successfully!")}
          className="btn-primary text-sm"
        >
          Success Toast
        </button>

        <button
          onClick={() => showError("Something went wrong!")}
          className="btn-secondary text-sm"
        >
          Error Toast
        </button>

        <button
          onClick={() => showWarning("Please check your input!")}
          className="btn-accent text-sm"
        >
          Warning Toast
        </button>

        <button
          onClick={() => showInfo("Here's some helpful information!")}
          className="btn-outline text-sm"
        >
          Info Toast
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => showQuestComplete("Daily Reflection", 50)}
          className="btn-primary text-sm"
        >
          Quest Complete
        </button>

        <button
          onClick={() => showReflectionSubmitted(25)}
          className="btn-secondary text-sm"
        >
          Reflection Submitted
        </button>

        <button
          onClick={() => showRewardRedeemed("Premium Theme")}
          className="btn-accent text-sm"
        >
          Reward Redeemed
        </button>
      </div>
    </div>
  );
};
