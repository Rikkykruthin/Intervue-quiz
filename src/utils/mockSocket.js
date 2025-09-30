// Mock Socket.IO for development when backend is not available
class MockSocket {
  constructor() {
    this.events = {};
    this.connected = false;
    this.mockData = {
      polls: [],
      votes: {},
      currentPoll: null
    };
    // Make this globally accessible for cross-component communication
    window.mockSocketData = this.mockData;
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (this.events[event]) {
      if (callback) {
        this.events[event] = this.events[event].filter(cb => cb !== callback);
      } else {
        delete this.events[event];
      }
    }
  }

  emit(event, data) {
    console.log(`Mock Socket: Emitting ${event}`, data);
    
    // Simulate server responses
    setTimeout(() => {
      if (event === 'createPoll') {
        // Simulate poll creation
        const pollData = {
          ...data,
          _id: 'mock_poll_' + Date.now()
        };
        this.mockData.polls.push(pollData);
        this.mockData.currentPoll = pollData;
        this.mockData.votes = {};
        
        // Initialize votes for each option
        data.options.forEach(option => {
          this.mockData.votes[option.text] = 0;
        });
        
        // Broadcast to all listeners (including other tabs/components)
        this.broadcastToAll('pollCreated', pollData);
        this.broadcastToAll('pollResults', this.mockData.votes);
      } else if (event === 'submitAnswer') {
        // Simulate vote submission
        if (this.mockData.votes[data.option] !== undefined) {
          this.mockData.votes[data.option]++;
          this.broadcastToAll('pollResults', this.mockData.votes);
        }
      }
    }, 100);
  }

  broadcastToAll(event, data) {
    // Trigger on this instance
    this.trigger(event, data);
    
    // Also trigger on other instances via localStorage for cross-tab communication
    const message = { event, data, timestamp: Date.now() };
    localStorage.setItem('mockSocketBroadcast', JSON.stringify(message));
    localStorage.removeItem('mockSocketBroadcast');
  }

  trigger(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  connect() {
    this.connected = true;
    console.log('Mock Socket: Connected');
    
    // Listen for cross-tab communication
    window.addEventListener('storage', (e) => {
      if (e.key === 'mockSocketBroadcast' && e.newValue) {
        const message = JSON.parse(e.newValue);
        this.trigger(message.event, message.data);
      }
    });
  }

  disconnect() {
    this.connected = false;
    console.log('Mock Socket: Disconnected');
  }
}

// Create a singleton instance
const mockSocket = new MockSocket();

// Auto-connect after a short delay
setTimeout(() => {
  mockSocket.connect();
}, 500);

export default mockSocket;