import { toast } from 'sonner';
import { useNotificationsStore } from '@/app/store/notifications.store';
import type { Notification } from '@/app/types/notifications/notifications.interfaces';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/api/v1/notifications/ws';

// Reconnect settings
const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 30000; // 30 seconds
const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const HEARTBEAT_TIMEOUT = 10000; // 10 seconds

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

type StatusListener = (status: ConnectionStatus) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private isIntentionalDisconnect = false;
  private status: ConnectionStatus = 'disconnected';
  private statusListeners: Set<StatusListener> = new Set();
  private wasConnected = false;

  constructor() {
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      // Reconnect when tab becomes visible
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  private handleOnline = (): void => {
    if (this.status === 'disconnected' && !this.isIntentionalDisconnect) {
      this.reconnectAttempts = 0;
      this.connect();
    }
  };

  private handleOffline = (): void => {
    this.setStatus('disconnected');
  };

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible' && this.status === 'disconnected' && !this.isIntentionalDisconnect) {
      this.reconnectAttempts = 0;
      this.connect();
    }
  };

  private setStatus(newStatus: ConnectionStatus): void {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusListeners.forEach(listener => listener(newStatus));
    }
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isIntentionalDisconnect = false;
    this.setStatus(this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting');

    try {
      this.socket = new WebSocket(WEBSOCKET_URL);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.setStatus('connected');
      this.clearReconnectTimeout();
      this.startHeartbeat();

      // Show reconnected toast only if we were previously connected
      if (this.wasConnected) {
        toast.success('Соединение восстановлено');
      }
      this.wasConnected = true;
    };

    this.socket.onmessage = (event) => {
      // Reset heartbeat on any message
      this.resetHeartbeat();

      try {
        const message = JSON.parse(event.data);

        // Handle pong response
        if (message.type === 'pong') {
          this.clearHeartbeatTimeout();
          return;
        }

        if (message.type === 'notification' && message.payload) {
          this.handleNotification(message.payload);
        }
      } catch {
        // Invalid message format - ignore
      }
    };

    this.socket.onclose = () => {
      this.stopHeartbeat();
      this.socket = null;

      if (!this.isIntentionalDisconnect) {
        this.setStatus('disconnected');

        // Show disconnected toast only if we were connected before
        if (this.wasConnected && this.reconnectAttempts === 0) {
          toast.error('Соединение потеряно. Переподключение...');
        }

        this.scheduleReconnect();
      }
    };

    this.socket.onerror = () => {
      // Error will trigger onclose, so we handle reconnection there
    };
  }

  public disconnect(): void {
    this.isIntentionalDisconnect = true;
    this.clearReconnectTimeout();
    this.stopHeartbeat();

    if (this.socket) {
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.close();
      this.socket = null;
    }

    this.reconnectAttempts = 0;
    this.wasConnected = false;
    this.setStatus('disconnected');
  }

  private scheduleReconnect(): void {
    this.clearReconnectTimeout();

    // Exponential backoff with max delay
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts),
      MAX_RECONNECT_DELAY
    );

    this.reconnectAttempts++;
    this.setStatus('reconnecting');

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      this.sendPing();
    }, HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.clearHeartbeatTimeout();
  }

  private resetHeartbeat(): void {
    if (this.heartbeatInterval) {
      this.stopHeartbeat();
      this.startHeartbeat();
    }
  }

  private sendPing(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify({ type: 'ping' }));

        // Set timeout for pong response
        this.heartbeatTimeout = setTimeout(() => {
          // No pong received, connection might be dead
          if (this.socket) {
            this.socket.close();
          }
        }, HEARTBEAT_TIMEOUT);
      } catch {
        // Send failed, connection is broken
        if (this.socket) {
          this.socket.close();
        }
      }
    }
  }

  private clearHeartbeatTimeout(): void {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  private handleNotification(notification: Notification): void {
    useNotificationsStore.getState().addNotification(notification);

    toast.info(notification.title, {
      description: notification.message,
    });
  }
}

export const webSocketService = new WebSocketService();
