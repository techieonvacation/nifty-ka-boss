// RKB API service for fetching trading data with production-ready features
export interface RkbDataPoint {
  "Exit DT": string;
  "Exit Price": number | null;
  "Favourable%": number | null;
  "FavourableMove": number | null;
  "FirstMove": string;
  "HighAfterSignal": number | null;
  "HighDate": string;
  "LowAfterSignal": number | null;
  "LowDate": string;
  "New Base": string;
  "P": number | null;
  "PL Point": number | null;
  "PL remarks": string;
  "Quantum": number;
  "R1": number | null;
  "R2": number | null;
  "R3": number | null;
  "S1": number | null;
  "S2": number | null;
  "S3": number | null;
  "SL": number | null;
  "Status": string;
  "Target": number | null;
  "Unfavourable%": number;
  "UnfavourableMove": number;
  "atr": number;
  "close_x": number;
  "datetime": string;
  "decision": string;
  "ema_kalman": number;
  "high_x": number;
  "kalman": number;
  "low_x": number;
  "open_x": number;
  "plotline": number;
  "remarks": string;
  "returns": string;
  "sma12": number | null;
  "sma26": number | null;
  "trend": string;
  "volume": number;
}

export interface ChartDataPoint {
  time: number; // UTC timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  plotline?: number;
  trend?: string;
  decision?: string;
}

export interface RkbApiResponse {
  success: boolean;
  data: RkbDataPoint[];
  message: string;
  totalRecords: number | string;
}

export interface DecisionData {
  "Exit DT": string;
  "Exit Price": number;
  "Favourable%": number;
  FavourableMove: number;
  FirstMove: string;
  HighAfterSignal: number;
  HighDate: string;
  LowAfterSignal: number;
  LowDate: string;
  "New Base": string | null;
  P: number;
  "PL Point": number;
  "PL remarks": string;
  Quantum: number;
  R1: number;
  R2: number;
  R3: number;
  S1: number;
  S2: number;
  S3: number;
  SL: number;
  Status: string;
  Target: number;
  "Unfavourable%": number;
  UnfavourableMove: number;
  atr: number;
  close_x: number;
  datetime: string;
  decision: string;
  ema_kalman: number;
  high_x: number;
  kalman: number;
  low_x: number;
  open_x: number;
  plotline: number;
  remarks: string;
  returns: string;
  sma12: number;
  sma26: number;
  trend: string;
  volume: number;
}

export interface NiftyMovementData {
  change: string;
  date: string;
  percent_change: string;
}

// Cache configuration for production optimization
const CACHE_DURATION = {
  RKB_DATA: 60 * 60 * 1000, // 1 hour
  DECISIONS: 30 * 60 * 1000, // 30 minutes
  NIFTY_MOVEMENT: 60 * 60 * 1000, // 1 hour
};

// In-memory cache for production optimization
const cache = new Map<string, { data: unknown; timestamp: number }>();

// Request deduplication: Track ongoing requests to prevent duplicates
const ongoingRequests = new Map<string, Promise<any>>();

// Global abort controllers for cleanup
const abortControllers = new Map<string, AbortController>();

// Helper function to get cached data
function getCachedData<T>(key: string, maxAge: number): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < maxAge) {
    return cached.data as T;
  }
  return null;
}

// Helper function to set cached data
function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Helper function to make API requests with error handling, retries, and deduplication
async function makeApiRequest<T>(
  url: string, 
  options: RequestInit = {}, 
  cacheKey?: string, 
  cacheDuration?: number
): Promise<T> {
  // BUG FIX: Request deduplication to prevent multiple identical requests
  const requestKey = `${url}_${JSON.stringify(options)}`;
  
  try {
    // Check cache first if cacheKey is provided
    if (cacheKey && cacheDuration) {
      const cached = getCachedData<T>(cacheKey, cacheDuration);
      if (cached) {
        console.log(`Using cached data for ${cacheKey}`);
        return cached;
      }
    }

    // BUG FIX: Check if there's already an ongoing request for the same endpoint
    if (ongoingRequests.has(requestKey)) {
      console.log(`Reusing ongoing request for ${url}`);
      return await ongoingRequests.get(requestKey);
    }

    // BUG FIX: Clean up any existing abort controller for this request
    if (abortControllers.has(requestKey)) {
      const existingController = abortControllers.get(requestKey);
      existingController?.abort();
      abortControllers.delete(requestKey);
    }

    // Set up new request with timeout and proper cleanup
    const controller = new AbortController();
    abortControllers.set(requestKey, controller);
    
    const requestPromise = (async () => {
      let timeoutId: NodeJS.Timeout | null = null;
      
      try {
        timeoutId = setTimeout(() => {
          controller.abort();
        }, 30000); // 30 second timeout

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
          },
        });

        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Cache the result if cacheKey is provided
        if (cacheKey && cacheDuration) {
          setCachedData(cacheKey, data);
        }

        return data;
      } catch (error: any) {
        // BUG FIX: Handle abort errors gracefully
        if (error.name === 'AbortError' || error.message?.includes('aborted')) {
          console.warn(`Request aborted for ${url} - this is normal during rapid navigation`);
          throw new Error('Request was cancelled');
        }
        throw error;
      } finally {
        // Clean up timeout and tracking
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        ongoingRequests.delete(requestKey);
        abortControllers.delete(requestKey);
      }
    })();

    // Track the ongoing request
    ongoingRequests.set(requestKey, requestPromise);
    
    return await requestPromise;
    
  } catch (error: any) {
    // Clean up on error
    ongoingRequests.delete(requestKey);
    abortControllers.delete(requestKey);
    
    // BUG FIX: Improve error messaging for abort errors
    if (error.message === 'Request was cancelled') {
      // Don't log cancelled requests as errors
      throw error;
    }
    
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
}

// Fetch RKB data from the API with caching and error handling
export async function fetchRkbData(): Promise<RkbDataPoint[]> {
  try {
    const cacheKey = 'rkb-data';
    const result: RkbApiResponse = await makeApiRequest<RkbApiResponse>(
      '/api/rkb/fetch-data',
      { method: 'GET' },
      cacheKey,
      CACHE_DURATION.RKB_DATA
    );
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch RKB data');
    }

    return result.data || [];
  } catch (error: any) {
    // BUG FIX: Handle cancelled requests gracefully
    if (error.message === 'Request was cancelled') {
      console.log('RKB data request was cancelled - this is normal during rapid navigation');
      return []; // Return empty array instead of throwing
    }
    
    console.error('Error fetching RKB data:', error);
    throw error;
  }
}

// Fetch decisions data from the API with caching and error handling
export async function fetchDecisions(): Promise<DecisionData[]> {
  try {
    const cacheKey = 'rkb-decisions';
    const result = await makeApiRequest<{
      success: boolean;
      decisions: DecisionData[];
      message: string;
      totalDecisions: number;
    }>(
      '/api/rkb/fetch-decisions',
      { method: 'GET' },
      cacheKey,
      CACHE_DURATION.DECISIONS
    );
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch decisions data');
    }

    return result.decisions || [];
  } catch (error: any) {
    // BUG FIX: Handle cancelled requests gracefully
    if (error.message === 'Request was cancelled') {
      console.log('Decisions data request was cancelled - this is normal during rapid navigation');
      return []; // Return empty array instead of throwing
    }
    
    console.error('Error fetching decisions data:', error);
    throw error;
  }
}

// Fetch nifty movement data from the API with caching and error handling
export async function fetchNiftyMovements(): Promise<NiftyMovementData[]> {
  try {
    const cacheKey = 'nifty-movements';
    const result = await makeApiRequest<{
      success: boolean;
      data: NiftyMovementData[];
      message: string;
      totalRecords: number;
    }>(
      '/api/rkb/nifty-movement',
      { method: 'GET' },
      cacheKey,
      CACHE_DURATION.NIFTY_MOVEMENT
    );
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch nifty movement data');
    }

    return result.data || [];
  } catch (error: any) {
    // BUG FIX: Handle cancelled requests gracefully
    if (error.message === 'Request was cancelled') {
      console.log('Nifty movement data request was cancelled - this is normal during rapid navigation');
      return []; // Return empty array instead of throwing
    }
    
    console.error('Error fetching nifty movement data:', error);
    throw error;
  }
}

// Convert RKB data to chart format with validation and optimization
export function convertRkbDataToChartData(rkbData: RkbDataPoint[]): ChartDataPoint[] {
  return rkbData
    .filter(item => 
      item.datetime && 
      item.open_x && 
      item.high_x && 
      item.low_x && 
      item.close_x &&
      !isNaN(item.open_x) &&
      !isNaN(item.high_x) &&
      !isNaN(item.low_x) &&
      !isNaN(item.close_x)
    )
    .map(item => {
      // Parse datetime string to UTC timestamp with error handling
      let time: number;
      try {
        const date = new Date(item.datetime);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        time = Math.floor(date.getTime() / 1000);
      } catch {
        console.warn('Invalid datetime format:', item.datetime);
        time = Math.floor(Date.now() / 1000);
      }
      
      return {
        time,
        open: item.open_x,
        high: item.high_x,
        low: item.low_x,
        close: item.close_x,
        volume: item.volume || 0,
        plotline: item.plotline && !isNaN(item.plotline) ? item.plotline : undefined,
        trend: item.trend || undefined,
        decision: item.decision || undefined,
      };
    })
    .sort((a, b) => a.time - b.time); // Sort by time ascending
}

// Get latest data point for real-time updates
export function getLatestDataPoint(chartData: ChartDataPoint[]): ChartDataPoint | null {
  if (chartData.length === 0) return null;
  return chartData[chartData.length - 1];
}

// Filter data by date range with optimization
export function filterDataByDateRange(
  data: ChartDataPoint[], 
  startDate: Date, 
  endDate: Date
): ChartDataPoint[] {
  const startTime = Math.floor(startDate.getTime() / 1000);
  const endTime = Math.floor(endDate.getTime() / 1000);
  
  return data.filter(item => item.time >= startTime && item.time <= endTime);
}

// Get trading signals (BUY/SELL decisions) with trend analysis
export function getTradingSignals(data: ChartDataPoint[]): ChartDataPoint[] {
  return data.filter(item => 
    item.decision && 
    (item.decision.toUpperCase().includes('BUY') || 
     item.decision.toUpperCase().includes('SELL'))
  );
}

// Get plotline data for custom indicator with trend-based coloring
export function getPlotlineData(data: ChartDataPoint[]): Array<{
  time: number;
  value: number;
  color: string;
  trend?: string;
}> {
  return data
    .filter(item => item.plotline !== undefined && !isNaN(item.plotline))
    .map(item => {
      // Determine color based on trend
      let color = '#3b82f6'; // Default blue
      if (item.trend) {
        const trendUpper = item.trend.toUpperCase();
        if (trendUpper === 'BUY') {
          color = '#10b981'; // Green for BUY
        } else if (trendUpper === 'SELL') {
          color = '#ef4444'; // Red for SELL
        }
      }
      
      return {
        time: item.time,
        value: item.plotline!,
        color,
        trend: item.trend,
      };
    });
}

// Get decision signals with visual indicators
export function getDecisionSignals(data: ChartDataPoint[]): Array<{
  time: number;
  decision: string;
  price: number;
  color: string;
  shape: 'triangleUp' | 'triangleDown' | 'circle';
}> {
  return data
    .filter(item => item.decision)
    .map(item => {
      const decisionUpper = item.decision!.toUpperCase();
      let color = '#6b7280'; // Default gray
      let shape: 'triangleUp' | 'triangleDown' | 'circle' = 'circle';
      
      if (decisionUpper.includes('BUYYES')) {
        color = '#10b981'; // Green for BUY
        shape = 'triangleUp';
      } else if (decisionUpper.includes('SELLYES')) {
        color = '#ef4444'; // Red for SELL
        shape = 'triangleDown';
      }
      
      return {
        time: item.time,
        decision: item.decision!,
        price: item.close,
        color,
        shape,
      };
    });
}

// BUG FIX: Cleanup function to abort all ongoing requests
export function abortAllRequests(): void {
  console.log(`Aborting ${abortControllers.size} ongoing requests`);
  
  for (const [key, controller] of abortControllers.entries()) {
    try {
      controller.abort();
    } catch (error) {
      console.warn(`Error aborting request ${key}:`, error);
    }
  }
  
  abortControllers.clear();
  ongoingRequests.clear();
  console.log('All ongoing requests aborted');
}

// Clear cache for testing or manual refresh
export function clearCache(): void {
  cache.clear();
  console.log('RKB API cache cleared');
}

// Get cache statistics for monitoring
export function getCacheStats(): {
  size: number;
  keys: string[];
  oldestEntry: number | null;
  newestEntry: number | null;
} {
  const keys = Array.from(cache.keys());
  const timestamps = Array.from(cache.values()).map(entry => entry.timestamp);
  
  return {
    size: cache.size,
    keys,
    oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : null,
    newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : null,
  };
} 