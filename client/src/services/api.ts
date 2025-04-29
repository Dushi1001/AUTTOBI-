import { apiRequest } from "@/lib/queryClient";

// User related API calls
export const registerUser = async (username: string, password: string) => {
  const response = await apiRequest("POST", "/api/auth/register", { username, password });
  return response.json();
};

export const loginUser = async (username: string, password: string) => {
  const response = await apiRequest("POST", "/api/auth/login", { username, password });
  return response.json();
};

export const logoutUser = async () => {
  const response = await apiRequest("POST", "/api/auth/logout", {});
  return response.json();
};

export const getCurrentUser = async () => {
  const response = await apiRequest("GET", "/api/auth/me", undefined);
  return response.json();
};

// Game related API calls
export const getGames = async () => {
  const response = await apiRequest("GET", "/api/games", undefined);
  return response.json();
};

export const getGameDetails = async (gameId: string) => {
  const response = await apiRequest("GET", `/api/games/${gameId}`, undefined);
  return response.json();
};

export const startGame = async (gameId: string) => {
  const response = await apiRequest("POST", `/api/games/${gameId}/start`, {});
  return response.json();
};

// Portfolio related API calls
export const getPortfolio = async (timeframe: string = "7d") => {
  const response = await apiRequest("GET", `/api/portfolio?timeframe=${timeframe}`, undefined);
  return response.json();
};

export const getPortfolioHistory = async (timeframe: string = "7d") => {
  const response = await apiRequest("GET", `/api/portfolio/history?timeframe=${timeframe}`, undefined);
  return response.json();
};

// Dashboard related API calls
export const getDashboardData = async () => {
  const response = await apiRequest("GET", "/api/dashboard", undefined);
  return response.json();
};

export const getRecentActivity = async (limit: number = 10) => {
  const response = await apiRequest("GET", `/api/activity?limit=${limit}`, undefined);
  return response.json();
};
