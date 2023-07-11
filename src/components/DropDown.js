import React from "react";
import Form from "react-bootstrap/Form";

const DropDown = ({ options, onChange }) => {
    return (
        <Form.Select
            onChange={onChange}
            className="mb-2"
            size="lg"
            disabled={options[0].value === "no trim" ? true : false}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </Form.Select>
    );
};

export default DropDown;
