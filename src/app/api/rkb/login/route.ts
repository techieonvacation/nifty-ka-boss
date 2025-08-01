import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: "Username and password are required",
          message: "Login failed - missing credentials"
        },
        { status: 400 }
      );
    }

    console.log("Attempting RKB login for username:", username);

    // Test connection to external service first
    const testUrl = "https://rkbforu.com:9026/login";
    console.log("Testing connection to:", testUrl);

    // Call external RKB login API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(testUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("RKB login response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("RKB login failed:", errorData);
      return NextResponse.json(
        {
          success: false,
          error: `Authentication failed (HTTP ${response.status})`,
          message: "Login failed - invalid credentials",
          details: errorData,
        },
        { status: response.status }
      );
    }

    // Get the raw text response first
    const rawText = await response.text();
    console.log("RKB login raw response length:", rawText.length);
    
    let data;
    try {
      // Try to parse JSON normally
      data = JSON.parse(rawText);
    } catch (jsonError) {
      console.error("JSON parsing failed, attempting to fix NaN values:", jsonError);
      
      try {
        // Replace NaN values with null to make it valid JSON
        const fixedJson = rawText.replace(/:\s*NaN\s*([,}])/g, ': null$1');
        data = JSON.parse(fixedJson);
        console.log("Successfully parsed JSON after fixing NaN values");
      } catch (secondError) {
        console.error("Failed to fix JSON even after NaN replacement:", secondError);
        return NextResponse.json(
          { 
            success: false,
            error: 'Invalid JSON response from external API',
            message: "Login failed - invalid response format",
            details: {
              originalError: jsonError instanceof Error ? jsonError.message : String(jsonError),
              fixedError: secondError instanceof Error ? secondError.message : String(secondError),
              responsePreview: rawText.substring(0, 500) + (rawText.length > 500 ? '...' : '')
            }
          },
          { status: 500 }
        );
      }
    }
    
    console.log("RKB login successful, token received");

    return NextResponse.json({
      success: true,
      token: data.token || data.access_token || data.jwt,
      message: "Login successful",
    });
  } catch (error) {
    console.error("RKB Login API Error:", error);
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - external service not responding';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error - cannot connect to external service';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        message: "Login failed - server error",
        details: {
          errorType: error instanceof Error ? error.name : 'Unknown',
          errorMessage: error instanceof Error ? error.message : String(error)
        }
      },
      { status: 500 }
    );
  }
}
