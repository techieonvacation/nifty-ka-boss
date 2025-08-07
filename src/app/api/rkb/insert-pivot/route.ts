import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Environment variable validation schema
const envSchema = z.object({
  RKB_USERNAME: z.string().min(1, "RKB_USERNAME is required"),
  RKB_PASSWORD: z.string().min(1, "RKB_PASSWORD is required"),
  RKB_API_URL: z.string().url().default("https://rkbforu.com:9026"),
});

// Pivot data validation schema
const pivotDataSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  support: z.number().positive("Support must be a positive number").optional(),
  resistance: z.number().positive("Resistance must be a positive number").optional(),
}).refine((data) => data.support !== undefined || data.resistance !== undefined, {
  message: "At least one of support or resistance must be provided",
  path: ["support", "resistance"],
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

// Main API handler for inserting pivot data
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    console.log("RKB Insert Pivot API called", {
      timestamp: new Date().toISOString(),
      url: request.url,
    });

    // Parse and validate request body
    const body = await request.json();
    
    let pivotData;
    try {
      pivotData = pivotDataSchema.parse(body);
    } catch (validationError) {
      console.error("Invalid pivot data", { body, error: validationError });
      return NextResponse.json(
        {
          success: false,
          error: "Invalid pivot data",
          message: "Please provide valid symbol, support, and resistance values",
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

    console.log("Inserting pivot data", {
      symbol: pivotData.symbol,
      support: pivotData.support,
      resistance: pivotData.resistance,
    });

    // Set up fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${env.RKB_API_URL}/insert_pivot`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        symbol: pivotData.symbol,
        ...(pivotData.support !== undefined && { support: pivotData.support }),
        ...(pivotData.resistance !== undefined && { resistance: pivotData.resistance }),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("RKB insert_pivot response", {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("RKB insert_pivot failed", {
        status: response.status,
        errorData,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: `External API error (HTTP ${response.status})`,
          message: "Failed to insert pivot data",
          details: errorData,
        },
        { status: response.status }
      );
    }

    // Process response
    const responseData = await response.json().catch(() => ({}));
    console.log("RKB insert_pivot successful", { responseData });

    return NextResponse.json(
      {
        success: true,
        data: responseData,
        message: "Pivot data inserted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("RKB Insert Pivot API Error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    let errorDetails: ErrorResponse = {
      success: false,
      error: "Internal server error",
      message: "Pivot insertion failed - server error",
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