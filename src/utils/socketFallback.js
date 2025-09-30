// Fallback for Socket.IO when it's not available (like on Vercel)
class SocketFallback {
  constructor() {
    this.events = {};
    this.connected = false;
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    console.log(`Socket fallback: Would emit ${event}`, data);
    // In a real fallback, you might use HTTP polling or WebRTC
    // For now, we'll just log
  }

  connect() {
    this.connected = true;
    if (this.events.connect) {
      this.events.connect.forEach(cb => cb());
    }
  }

  disconnect() {
    this.connected = false;
    if (this.events.disconnect) {
      this.events.disconnect.forEach(cb => cb());
    }
  }
}

export default SocketFallback;