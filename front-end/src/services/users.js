import axios  from '../api'

export const getUsers = async () => {
    let response = await axios.get('/users')
    return response.data
}

export const postUser = async (params) => {
    let response = await axios.post('/users', params)
    return response.data
}

export const putUser = async (params) => {
    let response = await axios.put(`/users/${params._id}`, params)
    return response.data
}

export const deleteUser = async (params) => {
    await axios.delete(`/users/${params._id}`)
    return params
}