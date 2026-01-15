// Debug logger that persists to localStorage
class DebugLogger {
  constructor() {
    this.key = 'debug_logs';
    this.maxLogs = 50;
  }

  log(message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };

    try {
      let logs = JSON.parse(localStorage.getItem(this.key) || '[]');
      logs.push(logEntry);

      // Keep only the last 50 logs
      if (logs.length > this.maxLogs) {
        logs = logs.slice(-this.maxLogs);
      }

      localStorage.setItem(this.key, JSON.stringify(logs));
      console.log(`[DEBUG] ${message}`, data);
    } catch (error) {
      console.error('Debug logger error:', error);
    }
  }

  getLogs() {
    try {
      return JSON.parse(localStorage.getItem(this.key) || '[]');
    } catch {
      return [];
    }
  }

  clearLogs() {
    localStorage.removeItem(this.key);
    console.log('Debug logs cleared');
  }

  printLogs() {
    const logs = this.getLogs();
    console.table(logs);
    return logs;
  }
}

const debugLogger = new DebugLogger();
export default debugLogger;

// Add global functions for easy access
window.debugLogs = debugLogger;
window.clearDebugLogs = () => debugLogger.clearLogs();
window.printDebugLogs = () => debugLogger.printLogs();