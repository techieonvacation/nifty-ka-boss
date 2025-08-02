# RKB API Integration - Production Ready

This document outlines the production-ready RKB API integration with custom indicators, real-time data fetching, and optimized performance.

## 🚀 Features

### Core API Integration
- **Real-time Data Fetching**: Integrated with RKB API endpoints
- **Fallback Data**: Graceful degradation when API is unavailable
- **Caching System**: In-memory caching for optimal performance
- **Error Handling**: Comprehensive error handling with fallback data
- **Production Optimization**: Optimized for high-traffic scenarios

### Custom Indicators

#### 1. RKB Plotline Indicator
- **Multi-colored Segments**: Plotline changes color based on trend
- **Trend-based Coloring**:
  - 🟢 **Green**: BUY trend
  - 🔴 **Red**: SELL trend  
  - 🟠 **Orange**: NEUTRAL trend
- **Real-time Updates**: Updates with live data
- **Professional Visualization**: Thick lines with proper styling

#### 2. Decision Signals Indicator
- **Triangle Indicators**: Visual decision signals on chart
- **Signal Types**:
  - 🔺 **Green Triangle Up**: BUYYES decision
  - 🔻 **Red Triangle Down**: SELLYES decision
  - ⭕ **Gray Circle**: Other decisions
- **Real-time Updates**: Updates with live data
- **Professional Styling**: Clear visual indicators

### API Endpoints

#### 1. Fetch Data (`/api/rkb/fetch-data`)
```typescript
// Response structure
{
  "success": true,
  "data": [
    {
      "Exit DT": "",
      "Exit Price": 0.0,
      "Favourable%": 0.0,
      "FavourableMove": 0.0,
      "FirstMove": "NA",
      "HighAfterSignal": 0.0,
      "HighDate": "",
      "LowAfterSignal": 0.0,
      "LowDate": "",
      "New Base": 0.0,
      "P": 0.0,
      "PL Point": 0.0,
      "PL remarks": "Neutral",
      "Quantum": 0,
      "R1": 0.0,
      "R2": 0.0,
      "R3": 0.0,
      "S1": 0.0,
      "S2": 0.0,
      "S3": 0.0,
      "SL": 0.0,
      "Status": "",
      "Target": 0.0,
      "Unfavourable%": 0.0,
      "UnfavourableMove": 0.0,
      "atr": 0.0,
      "close_x": 8281.55,
      "datetime": "2015-01-09 09:15",
      "decision": "Notrade",
      "ema_kalman": 8281.55,
      "high_x": 8303.0,
      "kalman": 8281.55,
      "low_x": 8273.95,
      "open_x": 8285.45,
      "plotline": 8281.55,
      "remarks": "",
      "returns": "Loss",
      "sma12": 0.0,
      "sma26": 0.0,
      "trend": "NA",
      "volume": 0.0
    }
  ],
  "message": "Data fetched successfully from 2015 to current date",
  "totalRecords": 1000
}
```

#### 2. Fetch Decisions (`/api/rkb/fetch-decisions`)
```typescript
// Response structure
{
  "success": true,
  "decisions": [
    {
      "Exit DT": "Thu, 24 Jul 2025 11:15:00 GMT",
      "Exit Price": 25049.45,
      "Favourable%": 0.07,
      "FavourableMove": 16.9,
      "FirstMove": "Favourable",
      "HighAfterSignal": 25246.25,
      "HighDate": "Thu, 24 Jul 2025 09:15:00 GMT",
      "LowAfterSignal": 25146.85,
      "LowDate": "Thu, 24 Jul 2025 10:15:00 GMT",
      "New Base": null,
      "P": 25094.15,
      "PL Point": -179.9,
      "PL remarks": "Loss",
      "Quantum": 1,
      "R1": 25152.75,
      "R2": 25240.6,
      "R3": 25299.2,
      "S1": 25006.3,
      "S2": 24947.7,
      "S3": 24859.85,
      "SL": 25029.35,
      "Status": "Closed by Next Signal",
      "Target": 25419.51,
      "Unfavourable%": 0.33,
      "UnfavourableMove": 82.5,
      "atr": 57.86452037,
      "close_x": 25229.35,
      "datetime": "Wed, 23 Jul 2025 14:15:00 GMT",
      "decision": "BUYYES",
      "ema_kalman": 25123.17452,
      "high_x": 25233.5,
      "kalman": 25115.59647,
      "low_x": 25192.0,
      "open_x": 25208.15,
      "plotline": 25138.82,
      "remarks": "R1 Broken",
      "returns": "Loss",
      "sma12": 25119.59583,
      "sma26": 25065.81154,
      "trend": "BUY",
      "volume": NaN
    }
  ],
  "message": "Decisions fetched successfully",
  "totalDecisions": 10
}
```

#### 3. Nifty Movement (`/api/rkb/nifty-movement`)
```typescript
// Response structure
[
  {
    "change": "-100.60",
    "date": "17 Jul 2025",
    "percent_change": "(-0.40%)"
  },
  {
    "change": "-143.05",
    "date": "18 Jul 2025",
    "percent_change": "(-0.57%)"
  }
]
```

## 🔧 Configuration

### Environment Variables
```env
# RKB API Configuration
RKB_USERNAME=your_username
RKB_PASSWORD=your_password
RKB_API_URL=https://rkbforu.com:9026
```

### Cache Configuration
```typescript
const CACHE_DURATION = {
  RKB_DATA: 60 * 60 * 1000, // 1 hour
  DECISIONS: 30 * 60 * 1000, // 30 minutes
  NIFTY_MOVEMENT: 60 * 60 * 1000, // 1 hour
};
```

## 📊 Custom Indicators Implementation

### Plotline Indicator
```typescript
// Create colored plotline segments based on trend changes
const createColoredPlotlineSegments = useCallback((chartData: ChartData[]) => {
  // Clear existing segments
  plotlineSegmentsRef.current.forEach(series => {
    if (chartRef.current && series) {
      chartRef.current.removeSeries(series);
    }
  });

  // Group data by trend changes
  let currentTrend = plotlineData[0].trend || 'NEUTRAL';
  let segmentStart = 0;

  for (let i = 1; i < plotlineData.length; i++) {
    if (currentItem.trend !== previousItem.trend) {
      // Create segment with trend-based color
      const color = trendUpper === 'BUY' ? '#00ff88' : 
                   trendUpper === 'SELL' ? '#ff4757' : 
                   '#ff6b35';
      
      const segmentSeries = chartRef.current!.addSeries(LineSeries, {
        color,
        lineWidth: 4,
        title: `RKB Plotline ${currentTrend}`,
      });
    }
  }
}, [showPlotline]);
```

### Decision Signals Indicator
```typescript
// Create decision signals with triangle indicators
const createDecisionSignals = useCallback((chartData: ChartData[]) => {
  const decisionSignals = getDecisionSignals(chartData);
  
  // Group signals by type
  const buySignals = decisionSignals.filter(signal => signal.shape === 'triangleUp');
  const sellSignals = decisionSignals.filter(signal => signal.shape === 'triangleDown');

  // Create buy signal series (triangle up)
  if (buySignals.length > 0) {
    const buySeries = chartRef.current!.addSeries(LineSeries, {
      color: '#10b981', // Green
      lineWidth: 0, // No line, just markers
      title: 'BUY Signals',
    });
  }

  // Create sell signal series (triangle down)
  if (sellSignals.length > 0) {
    const sellSeries = chartRef.current!.addSeries(LineSeries, {
      color: '#ef4444', // Red
      lineWidth: 0, // No line, just markers
      title: 'SELL Signals',
    });
  }
}, [showDecisionSignals]);
```

## 🚀 Performance Optimizations

### 1. Caching System
- **In-memory Cache**: Fast access to frequently requested data
- **Cache Duration**: Configurable cache times for different data types
- **Cache Invalidation**: Automatic cache clearing and refresh

### 2. Error Handling
- **Graceful Degradation**: Fallback to sample data when API fails
- **Timeout Handling**: 30-second timeout for API requests
- **Retry Logic**: Multiple parsing attempts for malformed JSON

### 3. Production Features
- **Request Timeouts**: Prevents hanging requests
- **JSON Cleaning**: Handles malformed JSON responses
- **Fallback Data**: Always provides data even when API fails
- **Cache Headers**: Proper HTTP cache headers for CDN optimization

## 📈 Usage Examples

### Basic Chart with RKB Data
```typescript
import StockChart from '@/components/NiftyKaBossChart/StockChart';

<StockChart
  symbol="NIFTY"
  exchange="NSE"
  theme="dark"
  showPlotline={true}
  showDecisionSignals={true}
  enableTwoScale={true}
  height={600}
/>
```

### Advanced Configuration
```typescript
<StockChart
  symbol="NIFTY"
  exchange="NSE"
  interval="1D"
  theme="dark"
  showVolume={true}
  showIndicators={true}
  showGrid={true}
  showCrosshair={true}
  enableTwoScale={true}
  showPlotline={true}
  showDecisionSignals={true}
  height={600}
  width={1200}
  className="custom-chart-class"
/>
```

## 🔍 Monitoring and Debugging

### Cache Statistics
```typescript
import { getCacheStats } from '@/lib/api/rkb';

const stats = getCacheStats();
console.log('Cache Stats:', stats);
// Output: { size: 3, keys: ['rkb-data', 'rkb-decisions', 'nifty-movements'], ... }
```

### Clear Cache
```typescript
import { clearCache } from '@/lib/api/rkb';

// Clear all cached data
clearCache();
```

### Debug Logging
```typescript
// Enable debug logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('RKB API Debug:', {
    dataSource: 'RKB-API',
    timestamp: new Date().toISOString(),
    cacheStats: getCacheStats(),
  });
}
```

## 🛡️ Security Features

### 1. Environment Variable Validation
- **Zod Schema**: Type-safe environment variable validation
- **Fallback Values**: Safe defaults when environment variables are missing
- **Error Logging**: Comprehensive error logging for debugging

### 2. API Security
- **JWT Authentication**: Secure token-based authentication
- **Request Headers**: Proper content-type and accept headers
- **Timeout Protection**: Prevents hanging requests

### 3. Data Validation
- **Input Sanitization**: Clean and validate all input data
- **JSON Parsing**: Robust JSON parsing with error handling
- **Type Safety**: Full TypeScript support with proper interfaces

## 📝 Best Practices

### 1. Error Handling
```typescript
try {
  const data = await fetchRkbData();
  // Process data
} catch (error) {
  console.error('RKB API Error:', error);
  // Use fallback data
  const fallbackData = generateFallbackData();
}
```

### 2. Performance Monitoring
```typescript
// Monitor API response times
const startTime = Date.now();
const data = await fetchRkbData();
const responseTime = Date.now() - startTime;
console.log(`RKB API Response Time: ${responseTime}ms`);
```

### 3. Cache Management
```typescript
// Clear cache periodically
setInterval(() => {
  clearCache();
  console.log('Cache cleared automatically');
}, 24 * 60 * 60 * 1000); // Every 24 hours
```

## 🎯 Key Features Summary

✅ **Real-time RKB Data Integration**  
✅ **Custom Plotline Indicator with Trend-based Coloring**  
✅ **Decision Signals with Triangle Indicators**  
✅ **Production-ready Error Handling**  
✅ **In-memory Caching System**  
✅ **Graceful Fallback Data**  
✅ **Optimized Performance**  
✅ **Type-safe Implementation**  
✅ **Comprehensive Documentation**  
✅ **Professional UI Indicators**  

## 🔄 Real-time Updates

The system provides real-time updates every 30 seconds:
- **Live Price Updates**: Current price and change indicators
- **Trend Updates**: Real-time trend changes in plotline
- **Decision Updates**: Live decision signal updates
- **Volume Updates**: Real-time volume data

## 📊 Data Flow

```
RKB API → Cache Layer → Data Processing → Chart Rendering
    ↓           ↓              ↓              ↓
  Real Data → Cached → Validated → Visualized
    ↓           ↓              ↓              ↓
  Fallback → Sample → Processed → Indicators
```

This production-ready implementation ensures high availability, optimal performance, and professional user experience with comprehensive error handling and fallback mechanisms.
