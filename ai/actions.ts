import { generateObject } from "ai";
import { z } from "zod";

import { geminiFlashModel } from ".";

// This file previously contained flight-related sample functions
// They have been removed as they are no longer needed for the project

// Generate leave type options
export async function generateLeaveTypeOptions() {
  const { object: leaveTypes } = await generateObject({
    model: geminiFlashModel,
    prompt: "Generate a list of types of leave that employees might request, including regular vacation, sick leave, menstrual leave, maternity leave, etc.",
    output: "array",
    schema: z.object({
      id: z.string().describe("Unique identifier for the leave type"),
      name: z.string().describe("Name of the leave type"),
      description: z.string().describe("Brief description of the leave type"),
      maxDays: z.number().describe("Maximum number of days allowed for this type of leave, use 999 to indicate no limit"),
    }),
  });

  return { leaveTypes };
}

// Generate leave reason suggestions
export async function generateLeaveReasonSuggestions({
  leaveType
}: {
  leaveType: string
}) {
  const { object: suggestions } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate several appropriate reason suggestions for ${leaveType} leave requests`,
    output: "array",
    schema: z.string().describe("Leave reason suggestion"),
  });

  return { suggestions };
}

// Check reasonableness of leave request
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
  const { object: validation } = await generateObject({
    model: geminiFlashModel,
    prompt: `Validate the reasonableness of the following leave request:
    - Leave type: ${leaveType}
    - Start date: ${startDate}
    - End date: ${endDate}
    - Reason: ${reason}`,
    schema: z.object({
      isValid: z.boolean().describe("Whether the leave request is reasonable and valid"),
      message: z.string().describe("Explanation of the validation result"),
      suggestions: z.array(z.string()).describe("If the request is not reasonable, provide improvement suggestions"),
    }),
  });

  return validation;
}
