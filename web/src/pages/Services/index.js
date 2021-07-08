import moment from 'moment'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Drawer, Modal, Icon, TagPicker, SelectPicker, Form, Tag, DatePicker, Uploader } from 'rsuite'
import Table from '../../components/Table'

import { 
    allServices, 
    updateServices, 
    resetServices, 
    removeMediaServices, 
    saveServices,
    removeServices } from '../../store/modules/services/actions'

const Services = () => {

    const dispatch = useDispatch()
    const { services, service, form, components, behavior } = useSelector(state => state.services)

    const setComponent = (component, state) => {
        dispatch(updateServices({
            components: { 
                ...components, 
                [component]: state 
            }
        }))
    }

    const setService = (key, value) => {
        dispatch(updateServices({
            service: { 
                ...service, 
                [key]: value 
            }
        }))
    }

    const resetServiceHandle = () => {
        dispatch(resetServices())
    }

    const removeMediaHandle = (file) => {
        dispatch(removeMediaServices(file.name))
    }

    const saveServiceHandle = () => {
        dispatch(saveServices())
    }

    const removeServiceHandle = () => {
        dispatch(removeServices())
    }

    useEffect(() => {
        dispatch(allServices())

    },[])

    return (
        <div className="col p-5 overflow-auto h-100">
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
                    {' '} Tem certeza que deseja excluir esse serviço? Essa ação será irreversível!
                </Modal.Body>

                <Modal.Footer>
                    <Button loading={form.saving} onClick={() => removeServiceHandle()} color="red">
                        Sim, tenho certeza!
                    </Button>

                    <Button onClick={() => setComponent('confirmDelete', false)} appearance="subtle">
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        
            <Drawer
                show={components.drawer}
                size='sm'
                onHide={() => {
                    setComponent('drawer', false)
                    resetServiceHandle()
                }}
            >
                <Drawer.Body>
                    <h3>
                        {behavior === 'create' ? 'Criar' : 'Atualizar'} Serviço
                    </h3>

                    <div className="row mt-3">
                        <div className="form-group col-6">
                            <b className="">Serviço</b>
                            <input
                                type="text"
                                className="form-control mt-1"
                                placeholder="Nome do serviço"
                                value={service.title}
                                onChange={e => setService('title', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-3">
                            <b className="">R$ Preço</b>
                            <input
                                type="number"
                                className="form-control mt-1"
                                placeholder="Preço"
                                value={service.price}
                                onChange={e => setService('price', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-3">
                            <b className="">R$ Recorr. (dias)</b>
                            <input
                                type="number"
                                className="form-control mt-1"
                                placeholder="Recorrência"
                                value={service.recurrence}
                                onChange={e => setService('recurrence', e.target.value)}
                            />
                        </div>                        
                    </div>

                    <div className="row mt-3">
                        <div className="form-group col-4">
                            <b className="">% Comissão</b>
                            <input
                                type="number"
                                className="form-control mt-1"
                                placeholder="Comissão"
                                value={service.commission}
                                onChange={e => setService('commission', e.target.value)}
                            />
                        </div>    
                        <div className="form-group col-4">
                            <b className="d-block">Duração</b>
                            <DatePicker
                                className="mt-1"
                                block
                                format="HH:mm"
                                value={service.duration}
                                hideMinutes={(min) => ![0, 30].includes(min) }
                                onChange={e => setService('duration', e)}
                            />
                        </div>    
                        <div className="form-group col-4">
                            <b className="">Status</b>
                            <select
                                className="form-control mt-1"
                                value={service.status}
                                onChange={e => setService('status', e.target.value)}
                            >
                                <option value='active'>Ativo</option>
                                <option value='inactive'>Inativo</option>
                            </select>
                        </div>    
                    </div>

                    <div className="row mt-3">
                        <div className="form-group col-12">
                            <b className="">Descrição</b>
                            <textarea
                                rows="5"
                                className="form-control mt-1"
                                placeholder="Descrição do serviço"
                                value={service.description}
                                onChange={e => setService('description', e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <b className="b-block">Imagens do serviço</b>
                        <Uploader 
                            className="mt-1"
                            multiple
                            autoUpload={false}
                            listType="picture"
                            defaultFileList={service.medias.map((service, index) => ({
                                name: service?.path,
                                fileKey: index,
                                url: `https://hall-in-hand-wls-bucket.s3.amazonaws.com/${service?.path}`
                            }))}

                            
                            onChange={(files) => {
                                
                                const blobFiles = files
                                    .filter((file) => file.blobFile)
                                    .map((file) => file.blobFile)
                                setService('medias', blobFiles)
                            }}

                            onRemove={(file) => {
                                if (behavior === 'update' && file.url) {
                                    removeMediaHandle(file)
                                }
                            }}

                        >
                            <button >
                                <Icon icon="camera-retro" size="lg" />
                            </button>


                        </Uploader>
                    </div>

                    <Button
                        block
                        className="mt-5"
                        loading={form.saving}
                        color='green'
                        size="lg"
                        onClick={() => saveServiceHandle()}
                    >
                          Salvar Serviço
                    </Button>

                    {behavior === 'update' && (
                        <Button
                            block
                            className="mt-2"
                            color={behavior === 'create' ? 'green' : 'red'}
                            loading={form.saving}
                            onClick={() => {
                                if (behavior === 'create') {
                                    saveServiceHandle()
                                } else {
                                    setComponent('confirmDelete', true)
                                }
                            }}
                        >
                            Remover Serviço
                        </Button>
                    )}


                </Drawer.Body>
            </Drawer>



            <div className="row">
                <div className="col-12">
                    <div className="w-100 d-flex justify-content-between">
                        <h2 className="mb-4 mt-0">Serviços</h2>
                        <div>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => {
                                    dispatch(updateServices({
                                        behavior: 'create'
                                    }))
                                    setComponent('drawer', true)
                                }}
                            >
                                <span className="mdi mdi-plus">Novo Serviço</span>
                            </button>
                        </div>
                    </div>

                    <Table
                        loading={form.filtering}
                        data={services}
                        config={[
                            { 
                                label: 'Nome', 
                                key: 'title', 
                                width: 200
                            },

                            { 
                                label: 'Descrição', 
                                key: 'description', 
                                width: 200
                            },

                            { 
                                label: 'Preço',
                                key: 'price',
                                content: (price) => `R$ ${price.toFixed(2)}`, 
                                width: 200
                            },

                            { 
                                label: '% Comissão',
                                key: 'commission',
                                content: (commission) => `${commission}%`,
                                width: 200
                            },

                            { 
                                label: 'Recorrência (dias)',
                                key: 'recurrence',
                                content: (recurrence) => `${recurrence} dias`,
                                width: 200
                            },

                            { 
                                label: 'Duração',
                                key: 'duration',
                                content: (duration) => moment(duration).format('HH:mm'),
                                width: 200
                            },

                            { 
                                label: 'Status',
                                key: 'status',
                                content: (status) => (
                                    <Tag 
                                    color={status === 'active' ? 'green' : 'red'}
                                    >
                                        {status === 'active' ? 'Ativo' : 'Inativo'}
                                    </Tag>
                                ),
                                width: 200
                            },

                        ]}
                        actions={(service) => (
                            <Button color="blue" size="xs">
                                Ver
                            </Button>
                        )}
                        onRowClick={(service) => {
                            dispatch(
                                updateServices({
                                    behavior: 'update',
                                    service
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

export default Services