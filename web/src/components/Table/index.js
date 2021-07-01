import { Table } from 'rsuite'
import 'rsuite/dist/styles/rsuite-default.css'

const { Column, HeaderCell, Cell } = Table

const TableComponent = ({ data, config, actions, content, loading, onRowClick }) => {
    return (
        <Table data={data} loading={loading} height={400} onRowClick={onRowClick}>
            {
                config.map(item => (
                    <Column key={item.key} flexGrow={!item.width ? 1 : 0} width={item.width} align="center" fixed={item.fixed}>
                        <HeaderCell>{item.label}</HeaderCell>
                        {!item.content ? (
                            <Cell dataKey={item.key} />
                        ) : (
                            <Cell>{(item) => item.content(item)}</Cell>
                        )}
                    </Column>
                ))
            }

            <Column width={150} fixed="right">
                <HeaderCell>Ações</HeaderCell>
                <Cell>{(item) => actions(item)}</Cell>
            </Column>
            
        </Table>

    )
}

export default TableComponent