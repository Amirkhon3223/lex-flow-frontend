import { onCLS, onLCP, onFCP, onTTFB, onINP, type Metric } from 'web-vitals';
import { trackEvent } from './analytics';

function sendToAnalytics(metric: Metric) {
  trackEvent('web_vitals', {
    event_category: 'performance',
    event_label: metric.name,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_rating: metric.rating,
  });
}

export function initWebVitals() {
  if (!import.meta.env.PROD) return;

  onCLS(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onINP(sendToAnalytics);
}
