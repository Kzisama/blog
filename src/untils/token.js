export const getToken = () => {
  return localStorage.getItem('token')
}

export const setToken = tokenStr => {
  localStorage.setItem('token', tokenStr)
}

export const delToken = () => {
  localStorage.removeItem('token')
}
