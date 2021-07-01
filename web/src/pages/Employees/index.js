import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Drawer, Modal, Icon, TagPicker, SelectPicker } from 'rsuite'
import Table from '../../components/Table'

import banks from '../../data/banks.json'

import {
    allEmployees,
    updateEmployees,
    filterEmployees,
    addEmployees,
    unlinkEmployees,
    servicesEmployees
} from '../../store/modules/employee/actions'

const Employees = () => {
    const dispatch = useDispatch()
    const { 
        employees, 
        employee,
        services,
        form, 
        components, 
        behavior
    } = useSelector(state => state.employees)

    const setComponent = (component, state) => {
        dispatch(
            updateEmployees({
                components: { ...components, [component]: state }
            })
        )
    }

    const setEmployeeHandle = (key, value) => {
        dispatch(
            updateEmployees({
                employee: { ...employee, [key]: value }
            })
        )
    }

    const setBankAccount = (key, value) => {
        dispatch(
            updateEmployees({
                employee: {
                    ...employee,
                    bankAccount: {
                        ...employee.bankAccount,
                        [key]: [value]
                    }
                }
            })
        )
    }

    const saveEmployeeHandle = () => {
        dispatch(addEmployees())
    }

    const removeCustomerHandle = () => {
        dispatch(unlinkEmployees())
    }

    const filterEmployeHandle = () => {
        dispatch(filterEmployees())
    }

    useEffect(() => {
        dispatch(allEmployees())
        dispatch(servicesEmployees())
    }, [])

    return (
        <div className="col p-5 overflow-auto h-100">
            <Drawer show={components.drawer} size="sm" onHide={() => setComponent('drawer', false)}>
                <Drawer.Body>
                    <h3>{behavior === 'create' ? 'Criar novo' : 'Atualizar'} colaborador</h3>
                    
                    <div className="row">
                        <div className="form-group col-12">
                            <b className="">E-mail</b>
                            <div className="input-group">
                                <input
                                    disabled={behavior === 'update'}
                                    type="email"
                                    className="form-control"
                                    placeholder="Email do colaborador"
                                    value={employee.email}
                                    onChange={e => setEmployeeHandle('email', e.target.value)}
                                />

                                {behavior === 'create' && (
                                    <div className="input-group-append">
                                        <Button
                                            appearance="primary"
                                            loading={form.filtering}
                                            disabled={form.filtering}
                                            onClick={e => filterEmployeHandle()}
                                        >
                                            Pesquisar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="row mt-3">
                            <div className="form-group col-6">
                                <b className="">Nome</b>
                                <input
                                    disabled={form.disabled}
                                    type="text"
                                    className="form-control"
                                    placeholder="Nome do colaborador"
                                    value={employee.name}
                                    onChange={e => setEmployeeHandle('name', e.target.value)}
                                />
                            </div>
                            <div className="form-group col-6">
                                <b className="">Status</b>
                                <select
                                    disabled={behavior === 'create'}
                                    className="form-control"
                                    value={employee.relationshipStatus}
                                    onChange={e => setEmployeeHandle('relationshipStatus', e.target.value)}
                                >
                                    <option value='active'>Ativo</option>
                                    <option value='inactive'>Inativo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="row mt-3">
                            <div className="form-group col-4">
                                <b className="">Telefone</b>
                                <input
                                    disabled={form.disabled}
                                    type="text"
                                    className="form-control"
                                    placeholder="Telefone"
                                    value={employee.phone}
                                    onChange={e => setEmployeeHandle('phone', e.target.value)}
                                />
                            </div>
                            <div className="form-group col-4">
                                <b className="">Data de nascimento</b>
                                <input
                                    disabled={form.disabled}
                                    type="date"
                                    className="form-control"
                                    value={employee.birthDate}
                                    onChange={e => setEmployeeHandle('birthDate', e.target.value)}
                                />
                            </div>
                            <div className="form-group col-4">
                                <b className="">Gênero</b>
                                <select
                                    disabled={form.disabled}
                                    className="form-control"
                                    placeholder="Gênero"
                                    value={employee.gender}
                                    onChange={e => setEmployeeHandle('gender', e.target.value)}
                                >
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                
                                </select>
                            </div>
                        </div>
                    </div>  

                    <div className="row">
                        <div className="mt-3 col-12">
                            <b>Especialidades</b>
                            <TagPicker
                                size="lg"
                                block
                                data={services}
                                disabled={form.disabled && behavior === 'create'}
                                value={employee.services}
                                onChange={service => setEmployeeHandle('services', service)}

                            />
                        </div>
                    </div>  
                    
                    <div className="row mt-3">
                        <div className="col-6">
                            <b>Titular da conta</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Titular da conta"
                                disabled={form.disabled}
                                value={employee.bankAccount.owner}
                                onChange={e => setEmployeeHandle('owner', e.target.value)}
                            />
                        </div>
                        <div className="col-6">
                            <b>CPF/CNPJ</b>
                            <input 
                                disabled={form.disabled}
                                type="text"
                                className="form-control"
                                placeholder="CPF/CNPJ"
                                value={employee.bankAccount.document}
                                onChange={e => setEmployeeHandle('document', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-6">
                            <b>Banco</b>
                            <SelectPicker 
                                disabled={form.disabled}
                                value={employee.bankAccount.bank}
                                data={banks}
                                block
                                size="lg"
                                onChange={bank => setBankAccount('bank', bank)}
                            />
                        </div>

                        <div className="col-6">
                            <b>Tipo de conta</b>
                            <select
                                className="form-control"
                                disabled={form.disabled}
                                value={employee.bankAccount.accountType}
                                onChange={e => setBankAccount('accountType', e.target.value)}

                            >
                                <option value='conta_corrente'>Corrente</option>
                                <option value='conta_poupanca'>Poupança</option>
                                <option value='conta_corrente_conjunta'>Corrente conjunta</option>
                                <option value='conta_poupanca_conjunta'>Poupança conjunta</option>
                            </select>

                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-6">
                            <b>Agência</b>
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Agência"
                                disabled={form.disabled}
                                value={employee.bankAccount.bankAgency}
                                onChange={e => setEmployeeHandle('bankAgency', e.target.value)}
                            />
                            
                        </div>
                        <div className="col-4">
                            <b>Conta</b>
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Agência"
                                disabled={form.disabled}
                                value={employee.bankAccount.numberAccount}
                                onChange={e => setEmployeeHandle('numberAccount', e.target.value)}
                            />
                        </div>
                        <div className="col-2">
                            <b>Digito</b>
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Agência"
                                disabled={form.disabled}
                                value={employee.bankAccount.verifyingDigit}
                                onChange={e => setEmployeeHandle('verifyingDigit', e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        block
                        className="mt-3"
                        loading={form.saving}
                        color='green'
                        size="lg"
                        onClick={() => saveEmployeeHandle()}
                    >
                          Salvar Colaborador
                    </Button>

                    {behavior === 'update' && (
                        <Button
                        block
                        className="mt-3"
                        color={behavior === 'create' ? 'green' : 'red'}
                        loading={form.saving}
                        onClick={() => {
                        if (behavior === 'create') {
                            saveEmployeeHandle()
                        } else {
                            setComponent('confirmDelete', true)
                        }
                        }}
                    >
                        Remover Colaborador
                    </Button>
                    )}
                    

                </Drawer.Body>
            </Drawer>

            <Modal
                show={components.confirmDelete}
                onHide={() => setComponent('confirmDelete', false)}
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
                    {' '} Tem certeza que deseja excluir esse colaborador? Essa ação será irreversível!
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
                        <h2 className="mb-4 mt-0">Colaboradores</h2>
                        <div>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => {
                                    dispatch(
                                        updateEmployees({
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
                        data={employees}
                        config={[
                            { label: 'Nome', key: 'name', width: 200, fixed: true },
                            { label: 'Email', key: 'email', width: 200 },
                            { label: 'Telefone', key: 'phone', width: 200 },
                            { label: 'Cadastro', key: 'createdAt', width: 200 },
                            // {label: 'Genero', key: 'gender', width: 200, fixed: true},
                        ]}
                        actions={(employee) => (
                            <Button color="blue" size="xs">
                                Ver
                            </Button>
                        )}
                        onRowClick={(employee) => {
                            dispatch(
                                updateEmployees({
                                    behavior: 'update',
                                    employee
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

export default Employees