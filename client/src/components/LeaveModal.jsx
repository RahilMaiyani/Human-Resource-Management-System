import { useForm } from "react-hook-form";
import { useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { useApplyLeave } from "../hooks/useLeaves";

/* --------------------------
   DATE HELPERS (FIXED)
-------------------------- */
function parseDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return new Date(y, m - 1, d); 
}

function isWeekend(dateStr) {
  const date = parseDate(dateStr);
  const day = date.getDay();
  return day === 0 || day === 6;
}

function rangeHasWeekend(fromDate, toDate) {
  let current = parseDate(fromDate);
  const end = parseDate(toDate);

  while (current <= end) {
    const day = current.getDay();
    if (day === 0 || day === 6) return true;
    current.setDate(current.getDate() + 1);
  }

  return false;
}

/* --------------------------
   COMPONENT
-------------------------- */
export default function LeaveModal({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      type: "sick",
      fromDate: "",
      toDate: "",
      reason: ""
    }
  });

  const [apiError, setApiError] = useState("");
  const mutation = useApplyLeave();

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  /* --------------------------
     DATE LIMITS
  -------------------------- */
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const max = new Date();
  max.setDate(today.getDate() + 14);
  const maxDate = max.toISOString().split("T")[0];

  /* --------------------------
     VALIDATION
  -------------------------- */
  const validateDate = (value, fieldName) => {
    if (!value) return `${fieldName} is required`;

    if (value < minDate) return "Only future dates allowed";
    if (value > maxDate) return "Max 2 weeks window";

    if (isWeekend(value)) return "Weekends not allowed";

    return true;
  };

  /* --------------------------
     SUBMIT
  -------------------------- */
  const onSubmit = (data) => {
    setApiError("");
    clearErrors("toDate");

    if (data.fromDate > data.toDate) {
      setError("toDate", {
        type: "manual",
        message: "To date must be after from date"
      });
      return;
    }

    if (rangeHasWeekend(data.fromDate, data.toDate)) {
      setError("toDate", {
        type: "manual",
        message: "Range cannot include Saturday or Sunday"
      });
      return;
    }

    mutation.mutate(data, {
      onSuccess: () => {
        reset();
        onClose(); // FIXED: close AFTER success
      },
      onError: (err) => {
        setApiError(err?.response?.data?.msg || "Failed to apply leave");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Apply Leave
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Future weekdays only • Max 2 weeks
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* TYPE */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Leave Type
            </label>
            <select
              {...register("type", { required: "Required" })}
              className="w-full h-11 mt-1 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="sick">Sick</option>
              <option value="casual">Casual</option>
              <option value="earned">Earned</option>
            </select>
          </div>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                min={minDate}
                max={maxDate}
                {...register("fromDate", {
                  validate: (v) => validateDate(v, "From date")
                })}
                className="w-full h-11 mt-1 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
              {errors.fromDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fromDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                min={fromDate || minDate}
                max={maxDate}
                {...register("toDate", {
                  validate: (v) => validateDate(v, "To date")
                })}
                className="w-full h-11 mt-1 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
              {errors.toDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.toDate.message}
                </p>
              )}
            </div>
          </div>

          {/* REASON */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Reason
            </label>
            <textarea
              rows="3"
              {...register("reason", {
                required: "Reason required",
                minLength: { value: 5, message: "Too short" }
              })}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
            {errors.reason && (
              <p className="text-red-500 text-xs mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* API ERROR */}
          {apiError && (
            <p className="text-sm text-red-500">{apiError}</p>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mutation.isPending ? "Submitting..." : "Apply Leave"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}