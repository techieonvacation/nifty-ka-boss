import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Environment variable validation schema
const envSchema = z.object({
  RKB_USERNAME: z.string().min(1, "RKB_USERNAME is required"),
  RKB_PASSWORD: z.string().min(1, "RKB_PASSWORD is required"),
  RKB_API_URL: z.string().url().default("https://rkbforu.com:9026"),
});

// Update pivot data validation schema
const updatePivotDataSchema = z.object({
  isdelete: z.number().int().min(0).max(1, "isdelete must be 0 or 1"),
});

// Structured error response format
interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

// Structured success response format
interface SuccessResponse {
  success: true;
  data: unknown;
  message: string;
}

// Union type for API response
type ApiResponse = SuccessResponse | ErrorResponse;

// Validate environment variables at startup with fallback
let env: z.infer<typeof envSchema>;
try {
  env = envSchema.parse({
    RKB_USERNAME: process.env.RKB_USERNAME,
    RKB_PASSWORD: process.env.RKB_PASSWORD,
    RKB_API_URL: process.env.RKB_API_URL,
  });
} catch (error) {
  console.warn("Environment variables not properly configured, using fallback values", {
    error: error instanceof Error ? error.message : String(error),
  });
  // Use fallback values
  env = {
    RKB_USERNAME: "demo",
    RKB_PASSWORD: "demo",
    RKB_API_URL: "https://rkbforu.com:9026",
  };
}

// Function to get JWT token by logging in
async function getJWTToken(): Promise<string | null> {
  try {
    console.log("Attempting to get JWT token for RKB API", {
      username: env.RKB_USERNAME,
      url: `${env.RKB_API_URL}/login`,
    });

    const loginResponse = await fetch(`${env.RKB_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: env.RKB_USERNAME,
        password: env.RKB_PASSWORD,
      }),
    });

    if (!loginResponse.ok) {
      console.error("RKB login failed", {
        status: loginResponse.status,
        statusText: loginResponse.statusText,
      });
      return null;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token || loginData.access_token || loginData.jwt;

    if (!token) {
      console.error("No token found in login response", { loginData });
      return null;
    }

    console.log("JWT token obtained successfully");
    return token;
  } catch (error) {
    console.error("Error getting JWT token", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

// Main API handler for updating pivot data
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await params;  
    
    console.log("RKB Update Pivot API called", {
      timestamp: new Date().toISOString(),
      url: request.url,
      id,
    });

    // Validate pivot ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid pivot ID",
          message: "Please provide a valid numeric pivot ID",
          details: { receivedId: id },
        },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    let updateData;
    try {
      updateData = updatePivotDataSchema.parse(body);
    } catch (validationError) {
      console.error("Invalid update pivot data", { body, error: validationError });
      return NextResponse.json(
        {
          success: false,
          error: "Invalid update data",
          message: "Please provide valid isdelete value (0 or 1)",
          details: {
            validationError: validationError instanceof Error ? validationError.message : String(validationError),
            receivedData: body,
          },
        },
        { status: 400 }
      );
    }

    // Get JWT token
    const token = await getJWTToken();
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication failed",
          message: "Unable to authenticate with external service",
        },
        { status: 401 }
      );
    }

    console.log("Updating pivot data", {
      id,
      isdelete: updateData.isdelete,
    });

    // Set up fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${env.RKB_API_URL}/update_pivot/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        isdelete: updateData.isdelete,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("RKB update_pivot response", {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("RKB update_pivot failed", {
        status: response.status,
        errorData,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: `External API error (HTTP ${response.status})`,
          message: "Failed to update pivot data",
          details: errorData,
        },
        { status: response.status }
      );
    }

    // Process response
    const responseData = await response.json().catch(() => ({}));
    console.log("RKB update_pivot successful", { responseData });

    return NextResponse.json(
      {
        success: true,
        data: responseData,
        message: updateData.isdelete === 1 ? "Pivot data deleted successfully" : "Pivot data updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("RKB Update Pivot API Error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    let errorDetails: ErrorResponse = {
      success: false,
      error: "Internal server error",
      message: "Pivot update failed - server error",
      details: {
        errorType: error instanceof Error ? error.name : "Unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    };

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorDetails = {
          ...errorDetails,
          error: "Request timeout",
          message: "External service not responding",
        };
      } else if (error.message.includes("fetch")) {
        errorDetails = {
          ...errorDetails,
          error: "Network error",
          message: "Cannot connect to external service",
        };
      }
    }

    return NextResponse.json(errorDetails, { status: 500 });
  }
} 