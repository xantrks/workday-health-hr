// AI actions for leave management

/**
 * Generates leave reason suggestions based on the leave type
 */
export async function generateLeaveReasonSuggestions({ 
  leaveType 
}: { 
  leaveType: string 
}) {
  // Example suggestions for different leave types
  const suggestionsByType: Record<string, string[]> = {
    "sick": [
      "Medical appointment",
      "Feeling unwell with flu-like symptoms",
      "Recovery from minor surgery",
      "Mental health day"
    ],
    "vacation": [
      "Annual family vacation",
      "Personal time off for relaxation",
      "Extended weekend trip",
      "Holiday travel"
    ],
    "personal": [
      "Family emergency",
      "Attending to personal matters",
      "Home repairs or maintenance",
      "Dependent care"
    ],
    "bereavement": [
      "Attending funeral services",
      "Family loss",
      "Time needed for arrangements"
    ]
  };

  // Default suggestions if leave type doesn't match predefined categories
  const defaultSuggestions = [
    "Please provide specific details",
    "Include relevant information about your absence",
    "Explain circumstances requiring leave"
  ];

  return {
    suggestions: suggestionsByType[leaveType.toLowerCase()] || defaultSuggestions
  };
}

/**
 * Generates leave type options available in the system
 */
export async function generateLeaveTypeOptions() {
  // Standard leave types offered by the organization
  const leaveTypes = [
    { id: "sick", name: "Sick Leave" },
    { id: "vacation", name: "Vacation" },
    { id: "personal", name: "Personal Leave" },
    { id: "bereavement", name: "Bereavement" },
    { id: "parental", name: "Parental Leave" },
    { id: "unpaid", name: "Unpaid Leave" }
  ];

  return { leaveTypes };
}

/**
 * Validates a leave request
 */
export async function validateLeaveRequest({
  startDate,
  endDate,
  leaveType,
  reason
}: {
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
}) {
  // Simple validation logic
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  
  const isValid = start <= end && reason.length >= 10;
  const isPastDate = start < today && today.getDate() !== start.getDate();

  let feedback = "";
  
  if (!isValid) {
    feedback = "Please ensure your end date is after the start date and provide a detailed reason (at least 10 characters).";
  } else if (isPastDate) {
    feedback = "You are requesting leave for a past date. Please contact HR directly for retroactive leave requests.";
  } else if (end.getTime() - start.getTime() > 14 * 24 * 60 * 60 * 1000) {
    feedback = "For leave requests longer than 14 days, please attach supporting documentation and inform your manager.";
  } else {
    feedback = "Your leave request looks good and meets all requirements.";
  }

  return {
    isValid: isValid && !isPastDate,
    feedback,
    requiresApproval: true
  };
} 