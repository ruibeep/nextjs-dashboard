export interface CreateTweetRequestBody {
    text: string;
  }
  
  export interface CreateTweetResponse {
    data?: {
      id: string;
      text: string;
    };
    errors?: {
      title?: string;
      detail?: string;
      type?: string;
    }[];
  }