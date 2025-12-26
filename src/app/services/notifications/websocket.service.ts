import { toast } from 'sonner';
import { useNotificationsStore } from '@/app/store/notifications.store';
import type { Notification } from '@/app/types/notifications/notifications.interfaces';

const WEBSOCKET_URL = `ws://localhost:8080/api/v1/notifications/ws`;

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;

  public connect(): void {
    // Check if already connected or connecting
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket: Already connected or connecting.');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('WebSocket: No access token found.');
      return;
    }

    const url = `${WEBSOCKET_URL}?token=${token}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
      this.reconnectAttempts = 0;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'notification' && message.payload) {
          this.handleNotification(message.payload);
        }
      } catch (error) {
        console.error('WebSocket: Error parsing message data.', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed.');
      this.scheduleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.socket) {
      // Remove event listeners to prevent reconnection
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.close();
      this.socket = null;
    }
    this.reconnectAttempts = 0;
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= 5) {
      console.error('WebSocket: Max reconnect attempts reached.');
      return;
    }
    const delay = Math.pow(2, this.reconnectAttempts) * 1000;
    this.reconnectAttempts++;

    console.log(`WebSocket: Attempting to reconnect in ${delay / 1000}s...`);
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleNotification(notification: Notification): void {
    // Add to the Zustand store
    useNotificationsStore.getState().addNotification(notification);

    // Show a toast
    toast.info(notification.title, {
      description: notification.message,
    });
  }
}

export const webSocketService = new WebSocketService();
