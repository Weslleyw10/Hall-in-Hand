import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import { Button, Drawer } from 'rsuite'
import Table from '../../components/Table'

import { allCustomers } from '../../store/modules/customer/actions'

const Customer = () => {

  const dispatch = useDispatch()
  const { customers } = useSelector(state => state.customers)

  useEffect(() => {
    dispatch(allCustomers())
  }, [])

  return (
      <div className="col p-5 overflow-auto h-100">
        <Drawer>
          <Drawer.Body></Drawer.Body>
        </Drawer>


          <div className="row">
              <div className="col-12">
                  <div className="w-100 d-flex justify-content-between">
                      <h2 className="mb-4 mt-0">Clientes</h2>
                      <div>
                          <button className="btn btn-primary btn-lg">
                              <span className="mdi mdi-plus">Novo Cliente</span>
                          </button>
                      </div>
                  </div>


                  <Table 
                      data={customers} 
                      config={ [
                          {label: 'Nome', key: 'name', width: 200, fixed: true},
                          {label: 'Email', key: 'email', width: 200},
                          {label: 'Telefone', key: 'phone', width: 200},
                          {label: 'Cadastro', key: 'createdAt', width: 200 },
                          // {label: 'Genero', key: 'gender', width: 200, fixed: true},
                      ]}
                      actions={(customer) => (
                          <Button color="blue" size="xs">
                              Ver
                          </Button>
                      )}
                      onRowClick={(customer) => {console.log(customer)}}
                  />
              </div>
          </div>
      </div>
  )
}

export default Customer