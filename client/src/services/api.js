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
  })
  return res.data
}

export const userEnrollment = (data, token) =>
  API.post("/challenges/enroll", data, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const getAllUsers = (token) =>
  API.get("/users", { headers: { Authorization: `Bearer ${token}` } })

export const updateSingleChallengeLink = (id, index, newLink, token) =>
  API.put(
    `/challenges/${id}/links`,
    { index, newLink },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

export const updateSingleChallengePdf = (id, index, newPdf, token) =>
  API.put(
    `/challenges/${id}/pdf`,
    { index, newPdf },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

export const addChallengeLink = (id, link, token) =>
  API.post(
    `/challenges/${id}/link`,
    { link },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

export const addChallengePdf = (id, pdf, token) =>
  API.post(
    `/challenges/${id}/pdf`,
    { pdf },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

export const deleteSingleChallengeLink = (id, index, token) =>
  API.delete(`/challenges/${id}/link`, {
    data: { index },
    headers: { Authorization: `Bearer ${token}` },
  })

export const deleteSingleChallengePdf = (id, index, token) =>
  API.delete(`/challenges/${id}/pdf`, {
    data: { index },
    headers: { Authorization: `Bearer ${token}` },
  })

export const editChallenge = async (id, data, token) =>
  axios.put(`/api/challenges/${id}/edit`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const deleteChallenge = async (id, token) =>
  axios.delete(`/api/challenges/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

export default API
