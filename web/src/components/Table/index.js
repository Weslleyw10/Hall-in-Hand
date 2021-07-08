import { Table } from 'rsuite'
import 'rsuite/dist/styles/rsuite-default.css'

const { Column, HeaderCell, Cell } = Table

const TableComponent = ({ data, config, actions, loading, onRowClick }) => {
    return (
        <Table 
        data={data} 
        loading={loading} 
        height={400} 
        onRowClick={onRowClick}>
            {
                config.map(setItem => (
                    <Column 
                    key={setItem.key} 
                    flexGrow={!setItem.width ? 1 : 0} 
                    width={setItem.width} 
                    align="left" 
                    fixed={setItem.fixed}>
                        <HeaderCell>{setItem.label}</HeaderCell>
                        {!setItem.content ? (
                            <Cell dataKey={setItem.key} />
                        ) : (
                            <Cell dataKey={setItem.key}>
                                {(item) => setItem.content(item[setItem.key])}
                            </Cell>
                        )}
                    </Column>
                ))
            }

            <Column width={150} fixed="right">
                <HeaderCell>Ações</HeaderCell>
                <Cell>
                    {(item) => actions(item)}
                </Cell>
            </Column>
            
        </Table>

    )
}

export default TableComponent