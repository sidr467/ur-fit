import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:3002/api",
})

export const signup = (formData) => API.post("/auth/signup", formData)
export const login = (formData) => API.post("/auth/login", formData)

export const getAllChallenges = (token) =>
  API.get("/challenges", { headers: { Authorization: `Bearer ${token}` } })

export const getJoinedChallenges = (token) =>
  API.get("/challenges/joined/me", {
    headers: { Authorization: `Bearer ${token}` },
  })

export const joinChallenge = (challengeId, token) =>
  API.post(
    `/challenges/${challengeId}/join`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )

export const createChallenge = (challengeData, token) =>
  API.post("/challenges", challengeData, {
    headers: { Authorization: `Bearer ${token}` },
  })

  export const getChallengeById = async (id, token) => {
  const res = await API.get(`/challenges/${id}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return res.data;
};

export const userEnrollment = (data, token) =>
  API.post("/challenges/enroll", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllUsers = (token) =>
  API.get("/users", { headers: { Authorization: `Bearer ${token}` } })

export const updateSingleChallengeLink = (id, index, newLink, token) =>
  API.put(`/challenges/${id}/link`, { index, newLink }, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateSingleChallengePdf = (id, index, newPdf, token) =>
  API.put(`/challenges/${id}/pdf`, { index, newPdf }, {
    headers: { Authorization: `Bearer ${token}` }
  });

export default API

