import "./Table.css";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { FaHandPointer } from "react-icons/fa";

const Table = ({ headers, rows, rowKey, customStyles, route, onDelete, update_status, onShow }) => {
    const { tableStyle, headerStyle, cellStyle } = customStyles;

    return (
        <div className="table-container">
            <table style={tableStyle} className="custom-table">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                style={{
                                    ...headerStyle,
                                    ...header.style,
                                    backgroundColor: header.bgColor,
                                    width: header.key === "name" ? "220px" : "auto",
                                }}
                                className="table-header"
                                colSpan={header.key === "name" ? 2 : 1}
                            >
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {rows?.map((row, rowIndex) => {
                        const isUsersRoute = route === "users" || route === "consultants";
                        const isOrderRoute = route === "orders";
                        const rowId = row.id;
                        const rowContent = (
                            <>
                                {headers.map((header, colIndex) => (
                                    <td
                                        key={colIndex}
                                        style={{
                                            ...cellStyle,
                                            ...header.cellStyle,
                                            textAlign: header.align || "center",
                                            columnSpan: header.key === "name" && row.image ? 2 : 1,
                                        }}
                                        colSpan={header.key === "name" ? 2 : 1}
                                        className="table-cell"
                                    >
                                        {/* Render image or initials if key is "name" */}
                                        {header.key === "name" ? (
                                            <div className="name-with-img">
                                                {row.image ? (
                                                    <img
                                                        src={row.image_url}
                                                        alt={row.name}
                                                        className="profile-img"
                                                    />
                                                ) : (
                                                    <div className="profile-img bg-gray-400 flex justify-center items-center text-[15px]">
                                                        {row?.name?.slice(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="user-name text-[15px]">{row[header.key]}</span>
                                            </div>
                                        )
                                            : header.key === "customer" ?
                                                <span className="user-name text-[15px]">{row.customer?.name}</span>
                                                :
                                                header.key === "show" ?
                                                    <FaHandPointer
                                                        onClick={() => onShow(row.id)}
                                                        className="text-[15px] m-auto block text-blue-500 hover:text-blue-700 transition cursor-pointer"
                                                        title="Show Order Details" />
                                                    :
                                                    header.key === "vendor" && typeof (row.vendor) === "object" ?

                                                        <span className="user-name text-[15px]">{row.vendor?.name}</span>
                                                        : header.key === "actions" ?

                                                            <div className="flex justify-center items-center gap-2">
                                                                <Link to={`/${route}/${rowId}`} className="p-1 bg-green-500 hover:bg-green-600 text-white rounded-md"> Edit</Link>
                                                                <button className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer"
                                                                    onClick={() => onDelete(rowId)}>Delete</button>
                                                            </div> :
                                                            header.key === "delete" ? <button className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer"
                                                                onClick={() => onDelete(rowId)}>Delete</button>
                                                                :
                                                                header.key === "update_status" && isOrderRoute ? (
                                                                    <select
                                                                        value={row.status}
                                                                        onChange={(e) => update_status(rowId, e.target.value)}>
                                                                        <option disabled>status</option>
                                                                        <option value="pending">pending</option>
                                                                        <option value="completed">completed</option>
                                                                        <option value="on_the_way">on_the_way</option>
                                                                        <option value="delivered">delivered</option>
                                                                        <option value="cancelled">cancelled</option>
                                                                    </select>) :
                                                                    header.key === "update_status" && route === "vendors" ? (
                                                                        <select
                                                                            value={row.status}
                                                                            onChange={(e) => update_status(rowId, e.target.value)}>
                                                                            <option disabled>status</option>
                                                                            <option value="active">Active</option>
                                                                            <option value="inactive">Inactive</option>
                                                                        </select>) :
                                                                        header.key === "update_status" ? (
                                                                            <select
                                                                                value={row.status}
                                                                                onChange={(e) => update_status(rowId, e.target.value)}>
                                                                                <option disabled>status</option>
                                                                                <option value="approved">Approved</option>
                                                                                <option value="rejected">Rejected</option>
                                                                            </select>) :

                                                                            row[header.key] === null ? "....." :
                                                                                header.key === "created_at" || header.key === "updated_at" ?
                                                                                    new Date(row[header.key]).toLocaleDateString() :
                                                                                    header.key === "userName" ?
                                                                                        row.user?.name :
                                                                                        header.key === "specName" ?
                                                                                            row.specialist?.name :

                                                                                            (
                                                                                                row[header.key]
                                                                                            )}
                                    </td>
                                ))}
                            </>
                        );

                        return isUsersRoute ? (
                            <Link
                                to={`/${route}/${rowId}`}
                                key={rowId}
                                className="table-row-link"
                                style={{ textDecoration: "none", display: "table-row" }}
                            >
                                {rowContent}
                            </Link>
                        ) : (
                            <tr
                                key={rowKey ? row[rowKey] : rowIndex}
                                className="table-row"
                            >
                                {rowContent}
                            </tr>
                        );
                    })}




                </tbody>
            </table>
        </div>
    );
};

export default Table;


Table.propTypes = {
    headers: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    rowKey: PropTypes.string,
    customStyles: PropTypes.object,
    route: PropTypes.string,
    onDelete: PropTypes.func
};