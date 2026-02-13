import SockJS from 'sockjs-client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import {
  OrderBookUpdateMessage,
  TradeMessage,
  OrderUpdateMessage,
  MarketStatusMessage,
  NewMarketMessage,
  WebSocketMessageType
} from '../types/apiTypes';

type MessageHandler<T> = (message: T) => void;

interface Subscriptions {
  orderBook: Map<number, StompSubscription>;
  trades: Map<number, StompSubscription>;
  marketStatus: Map<number, StompSubscription>;
  newMarkets: StompSubscription | null;
  userOrders: StompSubscription | null;
}

interface MessageHandlers {
  orderBook: Map<number, Set<MessageHandler<OrderBookUpdateMessage>>>;
  trades: Map<number, Set<MessageHandler<TradeMessage>>>;
  marketStatus: Map<number, Set<MessageHandler<MarketStatusMessage>>>;
  newMarkets: Set<MessageHandler<NewMarketMessage>>;
  userOrders: Set<MessageHandler<OrderUpdateMessage>>;
}

class WebSocketService {
  private client: Client | null = null;
  private connected = false;
  private connecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  private subscriptions: Subscriptions = {
    orderBook: new Map(),
    trades: new Map(),
    marketStatus: new Map(),
    newMarkets: null,
    userOrders: null,
  };

  private handlers: MessageHandlers = {
    orderBook: new Map(),
    trades: new Map(),
    marketStatus: new Map(),
    newMarkets: new Set(),
    userOrders: new Set(),
  };

  private pendingSubscriptions: (() => void)[] = [];
  private connectionListeners: Set<(connected: boolean) => void> = new Set();

  /**
   * Connect to WebSocket server
   */
  connect(userId?: number): Promise<void> {
    if (this.connected) {
      return Promise.resolve();
    }

    if (this.connecting) {
      return new Promise((resolve) => {
        this.pendingSubscriptions.push(resolve);
      });
    }

    this.connecting = true;

    return new Promise((resolve, reject) => {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const wsUrl = `${baseUrl}/ws`;

      this.client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
          console.log('[WS] Connected');
          this.connected = true;
          this.connecting = false;
          this.reconnectAttempts = 0;
          this.notifyConnectionListeners(true);

          // Process pending subscriptions
          this.pendingSubscriptions.forEach((cb) => cb());
          this.pendingSubscriptions = [];

          // Resubscribe to user orders if userId provided
          if (userId) {
            this.subscribeToUserOrders(userId);
          }

          resolve();
        },

        onDisconnect: () => {
          console.log('[WS] Disconnected');
          this.connected = false;
          this.notifyConnectionListeners(false);
        },

        onStompError: (frame) => {
          console.error('[WS] STOMP error:', frame);
          this.connecting = false;
          reject(new Error(frame.headers.message || 'WebSocket connection failed'));
        },

        onWebSocketClose: () => {
          this.connected = false;
          this.connecting = false;
          this.notifyConnectionListeners(false);

          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`[WS] Reconnecting... attempt ${this.reconnectAttempts}`);
          }
        },
      });

      this.client.activate();
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      this.connecting = false;
      this.subscriptions = {
        orderBook: new Map(),
        trades: new Map(),
        marketStatus: new Map(),
        newMarkets: null,
        userOrders: null,
      };
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Add connection state listener
   */
  onConnectionChange(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.add(listener);
    return () => this.connectionListeners.delete(listener);
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((listener) => listener(connected));
  }

  /**
   * Subscribe to order book updates for a market
   */
  subscribeToOrderBook(
    marketId: number,
    handler: MessageHandler<OrderBookUpdateMessage>
  ): () => void {
    // Add handler
    if (!this.handlers.orderBook.has(marketId)) {
      this.handlers.orderBook.set(marketId, new Set());
    }
    this.handlers.orderBook.get(marketId)!.add(handler);

    // Subscribe if not already subscribed
    if (!this.subscriptions.orderBook.has(marketId) && this.client && this.connected) {
      const subscription = this.client.subscribe(
        `/topic/market/${marketId}/orderbook`,
        (message: IMessage) => {
          const update = JSON.parse(message.body) as OrderBookUpdateMessage;
          this.handlers.orderBook.get(marketId)?.forEach((h) => h(update));
        }
      );
      this.subscriptions.orderBook.set(marketId, subscription);
    }

    // Return unsubscribe function
    return () => {
      this.handlers.orderBook.get(marketId)?.delete(handler);

      // Unsubscribe from STOMP if no more handlers
      if (this.handlers.orderBook.get(marketId)?.size === 0) {
        this.subscriptions.orderBook.get(marketId)?.unsubscribe();
        this.subscriptions.orderBook.delete(marketId);
        this.handlers.orderBook.delete(marketId);
      }
    };
  }

  /**
   * Subscribe to trades for a market
   */
  subscribeToTrades(
    marketId: number,
    handler: MessageHandler<TradeMessage>
  ): () => void {
    if (!this.handlers.trades.has(marketId)) {
      this.handlers.trades.set(marketId, new Set());
    }
    this.handlers.trades.get(marketId)!.add(handler);

    if (!this.subscriptions.trades.has(marketId) && this.client && this.connected) {
      const subscription = this.client.subscribe(
        `/topic/market/${marketId}/trades`,
        (message: IMessage) => {
          const trade = JSON.parse(message.body) as TradeMessage;
          this.handlers.trades.get(marketId)?.forEach((h) => h(trade));
        }
      );
      this.subscriptions.trades.set(marketId, subscription);
    }

    return () => {
      this.handlers.trades.get(marketId)?.delete(handler);
      if (this.handlers.trades.get(marketId)?.size === 0) {
        this.subscriptions.trades.get(marketId)?.unsubscribe();
        this.subscriptions.trades.delete(marketId);
        this.handlers.trades.delete(marketId);
      }
    };
  }

  /**
   * Subscribe to market status changes
   */
  subscribeToMarketStatus(
    marketId: number,
    handler: MessageHandler<MarketStatusMessage>
  ): () => void {
    if (!this.handlers.marketStatus.has(marketId)) {
      this.handlers.marketStatus.set(marketId, new Set());
    }
    this.handlers.marketStatus.get(marketId)!.add(handler);

    if (!this.subscriptions.marketStatus.has(marketId) && this.client && this.connected) {
      const subscription = this.client.subscribe(
        `/topic/market/${marketId}/status`,
        (message: IMessage) => {
          const status = JSON.parse(message.body) as MarketStatusMessage;
          this.handlers.marketStatus.get(marketId)?.forEach((h) => h(status));
        }
      );
      this.subscriptions.marketStatus.set(marketId, subscription);
    }

    return () => {
      this.handlers.marketStatus.get(marketId)?.delete(handler);
      if (this.handlers.marketStatus.get(marketId)?.size === 0) {
        this.subscriptions.marketStatus.get(marketId)?.unsubscribe();
        this.subscriptions.marketStatus.delete(marketId);
        this.handlers.marketStatus.delete(marketId);
      }
    };
  }

  /**
   * Subscribe to new markets
   */
  subscribeToNewMarkets(handler: MessageHandler<NewMarketMessage>): () => void {
    this.handlers.newMarkets.add(handler);

    if (!this.subscriptions.newMarkets && this.client && this.connected) {
      this.subscriptions.newMarkets = this.client.subscribe(
        '/topic/markets',
        (message: IMessage) => {
          const newMarket = JSON.parse(message.body) as NewMarketMessage;
          this.handlers.newMarkets.forEach((h) => h(newMarket));
        }
      );
    }

    return () => {
      this.handlers.newMarkets.delete(handler);
      if (this.handlers.newMarkets.size === 0 && this.subscriptions.newMarkets) {
        this.subscriptions.newMarkets.unsubscribe();
        this.subscriptions.newMarkets = null;
      }
    };
  }

  /**
   * Subscribe to user's order updates
   */
  subscribeToUserOrders(
    userId: number,
    handler?: MessageHandler<OrderUpdateMessage>
  ): () => void {
    if (handler) {
      this.handlers.userOrders.add(handler);
    }

    if (!this.subscriptions.userOrders && this.client && this.connected) {
      this.subscriptions.userOrders = this.client.subscribe(
        `/queue/user/${userId}/orders`,
        (message: IMessage) => {
          const orderUpdate = JSON.parse(message.body) as OrderUpdateMessage;
          this.handlers.userOrders.forEach((h) => h(orderUpdate));
        }
      );
    }

    return () => {
      if (handler) {
        this.handlers.userOrders.delete(handler);
      }
      if (this.handlers.userOrders.size === 0 && this.subscriptions.userOrders) {
        this.subscriptions.userOrders.unsubscribe();
        this.subscriptions.userOrders = null;
      }
    };
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;

