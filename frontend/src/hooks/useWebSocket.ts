import { useCallback, useEffect, useRef, useState } from 'react';
import type { ClientMessage, ServerMessage } from '../lib/types';

interface UseWebSocketOptions {
  onMessage: (msg: ServerMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket({ onMessage, onConnect, onDisconnect }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const autoReconnectRef = useRef(true);

  /**
   * Connect and optionally send a message immediately on open.
   * The server expects a config message as the very first frame.
   */
  const connect = useCallback(
    (initialMessage?: ClientMessage) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        // Already open — just send the message if provided
        if (initialMessage) {
          wsRef.current.send(JSON.stringify(initialMessage));
        }
        return;
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        // Send initial config before anything else
        if (initialMessage) {
          ws.send(JSON.stringify(initialMessage));
        }
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const msg: ServerMessage = JSON.parse(event.data);
          onMessage(msg);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        onDisconnect?.();
        // Only auto-reconnect if enabled
        if (autoReconnectRef.current) {
          reconnectTimeout.current = setTimeout(() => connect(), 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current = ws;
    },
    [onMessage, onConnect, onDisconnect]
  );

  const disconnect = useCallback(() => {
    autoReconnectRef.current = false;
    clearTimeout(reconnectTimeout.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const send = useCallback((msg: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  useEffect(() => {
    return () => {
      autoReconnectRef.current = false;
      clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
    };
  }, []);

  return { isConnected, connect, disconnect, send };
}
