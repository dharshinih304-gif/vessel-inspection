import { useEffect, useState } from 'react'
import { getTableData } from '../services/api'

function InspectionTable({ tableName }) {

    const [rows, setRows] = useState([])

    useEffect(() => {

        async function loadData() {

            const data = await getTableData(tableName)

            setRows(data)
        }

        loadData()

    }, [tableName])

    return (

        <div>

            <h2>{tableName}</h2>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>
                        <th>S.No</th>
                        <th>Requirements</th>
                        <th>Answer</th>
                        <th>Comments</th>
                    </tr>

                </thead>

                <tbody>

                    {rows.map((item) => (

                        <tr key={item.id}>

                            <td>{item.s_no}</td>

                            <td>{item.requirements}</td>

                            <td>{item.ans}</td>

                            <td>{item.comments}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    )
}

export default InspectionTable