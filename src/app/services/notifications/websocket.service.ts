import { toast } from 'sonner';
import { useNotificationsStore } from '@/app/store/notifications.store';
import type { Notification } from '@/app/types/notifications/notifications.interfaces';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/api/v1/notifications/ws';

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.socket = new WebSocket(WEBSOCKET_URL);

    this.socket.onopen = () => {
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
      } catch {
        // Invalid message format - ignore
      }
    };

    this.socket.onclose = () => {
      this.scheduleReconnect();
    };

    this.socket.onerror = () => {
      // Error handled by onclose
    };
  }

  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.close();
      this.socket = null;
    }
    this.reconnectAttempts = 0;
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= 5) {
      return;
    }
    const delay = Math.pow(2, this.reconnectAttempts) * 1000;
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleNotification(notification: Notification): void {
    useNotificationsStore.getState().addNotification(notification);

    toast.info(notification.title, {
      description: notification.message,
    });
  }
}

export const webSocketService = new WebSocketService();
