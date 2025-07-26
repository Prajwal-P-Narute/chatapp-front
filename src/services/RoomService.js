import { httpClient } from "../config/AxiosHelper";

export const createRoomAPI = async (roomDetail) => {
  const response = await httpClient.post("/restapi/p1/rooms", roomDetail, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return response.data;
};
export const joinChatAPI = async (roomId) => {
  const response = await httpClient.get(`/restapi/p1/rooms/${roomId}`);
  return response.data;
};

export const getMessages = async (roomId, size = 60, page = 0) => {
  const response = await httpClient.get(
    `/restapi/p1/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};

export const leaveRoomAPI = async (roomId, userId) => {
    const response = await httpClient.delete(`/restapi/p1/rooms/${roomId}/leave/${userId}`);
    return response.data;
  };
  
