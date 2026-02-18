import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '@/app/interceptors/http.interceptor';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

interface UsePushNotificationsReturn {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
  loading: boolean;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  sendTest: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported] = useState<boolean>(
    typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window,
  );

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default',
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupported) return;

    const checkSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(subscription !== null);
      } catch {
        setIsSubscribed(false);
      }
    };

    checkSubscription();
  }, [isSupported]);

  useEffect(() => {
    if (!isSupported) return;
    setPermission(Notification.permission);
  }, [isSupported]);

  const subscribe = useCallback(async () => {
    if (!isSupported) return;

    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        return;
      }

      const vapidResponse = await httpClient.get<{ publicKey: string }>('/push/vapid-key');
      const vapidPublicKey = vapidResponse.data.publicKey;

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const subscriptionJson = subscription.toJSON();

      await httpClient.post('/push/subscribe', {
        endpoint: subscriptionJson.endpoint,
        keyP256dh: subscriptionJson.keys?.p256dh ?? '',
        keyAuth: subscriptionJson.keys?.auth ?? '',
        userAgent: navigator.userAgent,
      });

      setIsSubscribed(true);
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return;

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        await httpClient.post('/push/unsubscribe', { endpoint });
      }

      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  const sendTest = useCallback(async () => {
    await httpClient.post('/push/test');
  }, []);

  return {
    isSupported,
    isSubscribed,
    permission,
    loading,
    subscribe,
    unsubscribe,
    sendTest,
  };
}
