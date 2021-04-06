import React, { useCallback, useEffect, useState } from 'react';
import Button  from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'

import useFetchData from '../utils/useFetchData'
import * as UserServices from '../services/users'

const App = () => {

  const [name, setName] = useState('')
  const [editableName, setEditableName] = useState('')
  const [idSelected, setIdSelected] = useState()

  const { 
      error: errorGet, 
      data: users, 
      setParams: setParamsGet,  
      refreshData 
    } = useFetchData(UserServices.getUsers)

  const { 
      error: errorPost, 
      data: postSuccess, 
      setParams: setParamsPost 
    } = useFetchData(UserServices.postUser)

  const { 
      error: errorPut, 
      data: putSuccess, 
      setParams: setParamsPut 
    } = useFetchData(UserServices.putUser)

  const { 
      error: errorDelete, 
      data: deleteSuccess, 
      setParams: setParamsDelete
    } = useFetchData(UserServices.deleteUser)
  
  useEffect(() => {
    const getUsers = () => {
      setParamsGet({})
    }

    getUsers()
  },[])

  useEffect(() => {
    const refresh = () => {
      setName('')
      setEditableName('')
      setIdSelected(undefined)
      setParamsGet({})
    }

    if(postSuccess || putSuccess || deleteSuccess){
      refresh()
    }

  },[postSuccess, putSuccess, deleteSuccess])

  const onSubmit = useCallback((event) => {
    event.preventDefault()
    setParamsPost({name})
  },[name])

  const onDelete = useCallback((id) => {
    setParamsDelete({_id:id})
  },[])

  const onUpdate = useCallback((user) => {
    setParamsPut(user)
  },[])

  const getMsgError = (error) => {
    return (
      <Row>
        <Col>
          <Alert variant={'danger'}>
            {error}
          </Alert>
        </Col>
      </Row>
    )
  }

  const renderTable = useCallback(() => {
    return(
        <Table striped >
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, key) => (
              <tr key={key} >
                  <td width={'10%'}>{key+1}</td>
                  <td width={'50%'}>{user.name}</td>
                  <td width={'30%'} style={{textAlign: 'center'}}>
                      {idSelected === user._id &&
                        <Form.Group controlId="formBasicEmail">
                          <Form.Control 
                            value={editableName} 
                            onChange={ event => setEditableName(event.target.value)}
                            type="text" 
                            placeholder="Digite novo nome do usuário" />
                        </Form.Group>
                      }
                      <Button onClick={() => idSelected === user._id ? onUpdate({name: editableName, _id: user._id}) : setIdSelected(user._id)} variant="warning" size={'sm'}>Editar</Button>
                      {idSelected === user._id && <Button onClick={() => setIdSelected(undefined)} variant="secundary" size={'sm'}>Cancelar</Button>}
                  </td>
                  <td width={'10%'} style={{textAlign: 'center'}}>
                    <Button onClick={() => onDelete(user._id)} variant="danger" size={'sm'}>Excluir</Button>
                  </td>
              </tr>
            ))}
          </tbody>
        </Table>
    )
  },[users, idSelected, editableName])

  return (
      <Container>
          <br/>
          <Row>
            <Col>
              <h3>Adicionar usuários</h3>
            </Col>
          </Row>
          {errorGet && getMsgError(errorGet)}
          {errorPost && getMsgError(errorPost)}
          {errorPut && getMsgError(errorPut)}
          {errorDelete && getMsgError(errorDelete)}
          <Row>
            <Col>
              <Form onSubmit={onSubmit} >
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Usuário</Form.Label>
                  <Form.Control 
                    value={name} 
                    onChange={event => setName(event.target.value)} 
                    type="text" 
                    placeholder="Nome do usuário" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Salvar
                </Button>
              </Form>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <h3>Lista de usuários</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              {renderTable()}
            </Col>
          </Row>
      </Container>
  );
}

export default App;