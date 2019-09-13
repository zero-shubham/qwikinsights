import React, {useState, useEffect} from "react";

const Row = (props) => {
    const [rowCells, setRowCells] = useState([]);


    useEffect(() => {
        let rowCellArray = [];
        ( Object.keys(props.rowData) ).forEach((element,ind) => {
            rowCellArray.push(<td className="table__row-cell" key={ind}>{props.rowData[element]}</td>);
        });

        setRowCells(rowCellArray);
    }, [props.rowData]);


    return (
        <tr className="table__row">
            {rowCells}
        </tr>
    );
}

export default Row;