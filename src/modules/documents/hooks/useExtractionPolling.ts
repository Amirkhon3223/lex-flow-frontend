import { useState, useEffect, useCallback, useRef } from 'react';
import { documentsService } from '../../../app/services/documents/documents.service';
import type { ExtractionJobInterface } from '../../../app/types/documents/documents.interfaces';

interface UseExtractionPollingOptions {
  jobId: string | null;
  enabled?: boolean;
  interval?: number;
  onComplete?: (job: ExtractionJobInterface) => void;
  onError?: (job: ExtractionJobInterface) => void;
}

interface UseExtractionPollingReturn {
  job: ExtractionJobInterface | null;
  isPolling: boolean;
  error: Error | null;
  stopPolling: () => void;
}

/**
 * Custom hook to poll extraction job status
 * @param jobId - The extraction job ID to poll
 * @param enabled - Whether polling is enabled (default: true)
 * @param interval - Polling interval in milliseconds (default: 2000ms)
 * @param onComplete - Callback when job completes successfully
 * @param onError - Callback when job fails
 */
export function useExtractionPolling({
  jobId,
  enabled = true,
  interval = 2000,
  onComplete,
  onError,
}: UseExtractionPollingOptions): UseExtractionPollingReturn {
  const [job, setJob] = useState<ExtractionJobInterface | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const pollJobStatus = useCallback(async () => {
    if (!jobId) {
      stopPolling();
      return;
    }

    try {
      const jobData = await documentsService.getJobStatus(jobId);

      if (!isMountedRef.current) return;

      setJob(jobData);
      setError(null);

      // Stop polling if job is completed or failed
      if (jobData.status === 'completed') {
        stopPolling();
        onComplete?.(jobData);
      } else if (jobData.status === 'failed') {
        stopPolling();
        onError?.(jobData);
      }
    } catch (err) {
      if (!isMountedRef.current) return;

      const error = err instanceof Error ? err : new Error('Failed to fetch job status');
      setError(error);
      stopPolling();
    }
  }, [jobId, stopPolling, onComplete, onError]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!jobId || !enabled) {
      stopPolling();
      return;
    }

    // Start polling
    setIsPolling(true);
    pollJobStatus(); // Poll immediately

    intervalRef.current = setInterval(pollJobStatus, interval);

    return () => {
      stopPolling();
    };
  }, [jobId, enabled, interval, pollJobStatus, stopPolling]);

  return {
    job,
    isPolling,
    error,
    stopPolling,
  };
}
