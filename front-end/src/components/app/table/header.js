import React, {useState, useEffect} from "react";

const Header = (props) => {
    const [headers, setHeaders] = useState([]);

    useEffect(() => {
        let headArray = [];
        headArray.push(<th className="table__header-cell" key={0}>{" "}</th>);
        (props.columns).forEach((element, ind) => {
            headArray.push(<th className="table__header-cell" key={ind+1}>{element}</th>)
        });

        setHeaders(headArray)
    }, [props.columns])
    return (
        <tr className="table__header">
            {headers}
        </tr>
    )
};

export default Header;