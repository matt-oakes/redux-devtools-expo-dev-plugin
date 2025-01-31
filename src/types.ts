export interface ProxyClient {
  sendMessage: (type: string, data?: any) => void;
  addMessageListener: (method: string, listener: (params: any) => void) => void;
  closeAsync: () => Promise<void>;
}

export type ProxyClientFactory = () => Promise<ProxyClient>;
