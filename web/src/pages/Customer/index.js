import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Drawer, Modal, Icon } from 'rsuite'
import Table from '../../components/Table'

import { 
  allCustomers, 
  updateCustomers, 
  filterCustomers, 
  addCustomer,
  unlinkCustomer,
  resetCustomer
} from '../../store/modules/customer/actions'

const Customer = () => {

  const dispatch = useDispatch()
  const { customers, customer, form, components, behavior } = useSelector(state => state.customers)

  const setComponent = (component, state) => {
    dispatch(
      updateCustomers({
        components: { ...components, [component]: state }
      })
    )
  }

  const setCustomerHandle = (key, value) => {
    dispatch(
      updateCustomers({
        customer: { ...customer, [key]: value }
      })
    )
  }

  const saveCustomerHandle = () => {
    dispatch(addCustomer())
  }

  const removeCustomerHandle = () => {
    dispatch(unlinkCustomer())
  }

  useEffect(() => {
    dispatch(allCustomers())
  }, [])

  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer show={components.drawer} size="sm" onHide={() => setComponent('drawer', false)}>
        <Drawer.Body>
          <h3>{behavior === 'create' ? 'Criar novo' : 'Atualizar'} cliente</h3>

          <div className="row">
            <div className="form-group col-12 mb-3">
              <b>E-mail</b>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="E-mail do cliente"
                  value={customer.email}
                  disabled={behavior === 'update'}
                  onChange={e => setCustomerHandle('email', e.target.value)}
                />

                <div className="input-group-append">
                  <Button
                    appearance="primary"
                    loading={form.filtering}
                    disabled={form.filtering}
                    onClick={e => dispatch(filterCustomers())}
                  >
                    Pesquisar
                </Button>
                </div>

              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-6">
              <b>Nome</b>
              <input
                type="text"
                className="form-control"
                placeholder="Nome do cliente"
                disabled={form.disabled}
                value={customer.name}
                onChange={e => setCustomerHandle('name', e.target.value)}
              />
            </div>

            <div className="form-group col-6">
              <b>Telefone</b>
              <input
                type="text"
                className="form-control"
                placeholder="Telefone do cliente"
                disabled={form.disabled}
                value={customer.phone}
                onChange={e => setCustomerHandle('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group col-6">
              <b>Data de nascimento</b>
              <input
                type="date"
                className="form-control"
                disabled={form.disabled}
                value={customer.birthDate}
                onChange={e => setCustomerHandle('birthDate', e.target.value)}
              />
            </div>

            <div className="form-group col-6">
              <b>Genêro</b>
              <select
                className="form-control"
                disabled={form.disabled}
                value={customer.gender}
                onChange={e => setCustomerHandle('gender', e.target.value)}
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-6">
              <b>Tipo do documento</b>
              <select
                className="form-control"
                disabled={form.disabled}
                value={customer.document.documentType}
                onChange={e => setCustomerHandle('document', {
                  ...customer.document,
                  documentType: e.target.value
                })}
              >
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
              </select>
            </div>

            <div className="form-group col-6">
              <b>Documento</b>
              <input
                type="text"
                className="form-control"
                placeholder="Documento do cliente"
                disabled={form.disabled}
                value={customer.document.document}
                onChange={e => setCustomerHandle('document', {
                  ...customer.document,
                  document: e.target.value
                })}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group col-4">
              <b>CEP</b>
              <input
                type="text"
                className="form-control"
                placeholder="CEP do cliente"
                disabled={form.disabled}
                value={customer.address.zipcode}
                onChange={e => setCustomerHandle('address', {
                  ...customer.address,
                  zipcode: e.target.value
                })}
              />
            </div>

            <div className="form-group col-4">
              <b>Rua / Logadouro</b>
              <input
                type="text"
                className="form-control"
                placeholder="Rua / Logadouro do cliente"
                disabled={form.disabled}
                value={customer.address.address}
                onChange={e => setCustomerHandle('address', {
                  ...customer.address,
                  address: e.target.value
                })}
              />
            </div>
            
            <div className="form-group col-4">
              <b>Número</b>
              <input
                type="text"
                className="form-control"
                placeholder="Número do endereço do cliente"
                disabled={form.disabled}
                value={customer.address.number}
                onChange={e => setCustomerHandle('address', {
                  ...customer.address,
                  number: e.target.value
                })}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group col-8">
              <b>Cidade</b>
              <input
                type="text"
                className="form-control"
                placeholder="Cidade do cliente"
                disabled={form.disabled}
                value={customer.address.city}
                onChange={e => setCustomerHandle('address', {
                  ...customer.address,
                  city: e.target.value
                })}
              />
            </div>

            <div className="form-group col-4">
              <b>UF</b>
              <input
                type="text"
                className="form-control"
                placeholder="Estado do cliente"
                disabled={form.disabled}
                value={customer.address.state}
                onChange={e => setCustomerHandle('address', {
                  ...customer.address,
                  state: e.target.value
                })}
              />
            </div>
          </div>
          
          <Button
            block
            className="mt-3"
            color={behavior === 'create' ? 'green' : 'red'}
            loading={form.saving}
            onClick={() => {
              if (behavior === 'create') {
                saveCustomerHandle()
              } else {
                setComponent('confirmDelete', true)
              }
            }}
          >
            <span>{behavior === 'create' ? 'Salvar' : 'Remover'} cliente</span>
          </Button>

        </Drawer.Body>
      </Drawer>
          
      <Modal
        show={components.confirmDelete}
        onHide={() => setComponent('confirmDelete', false)  }
        size="xs"
      >
        <Modal.Body>
          <Icon
            icon="remind"
            style={{
              color: '#ffb300',
              fontSize: 24
            }}
          />
          {' '} Tem certeza que deseja excluir esse cliente? Essa ação será irreversível!

        </Modal.Body>
        <Modal.Footer>
          <Button loading={form.saving} onClick={() => removeCustomerHandle()} color="red">
            Sim, tenho certeza!
          </Button>
          <Button onClick={() => setComponent('confirmDelete', false)} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Clientes</h2>
            <div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  dispatch(
                    updateCustomers({
                      behavior: 'create'
                    })
                  )
                  setComponent('drawer', true)
                }}
              >
                <span className="mdi mdi-plus">Novo Cliente</span>
              </button>
            </div>
          </div>

          <Table
            loading={form.filtering}
            data={customers}
            config={[
              { label: 'Nome', key: 'name', width: 200, fixed: true },
              { label: 'Email', key: 'email', width: 200 },
              { label: 'Telefone', key: 'phone', width: 200 },
              { label: 'Cadastro', key: 'createdAt', width: 200 },
              // {label: 'Genero', key: 'gender', width: 200, fixed: true},
            ]}
            actions={(customer) => (
              <Button color="blue" size="xs">
                Ver
              </Button>
            )}
            onRowClick={(customer) => { 
              dispatch(
                updateCustomers({
                  behavior: 'update',
                  customer
                })
              )
              setComponent('drawer', true)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Customer