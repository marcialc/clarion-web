import React from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { StringifyOptions } from "querystring";


const DropDown = ({ list, callback, label, minWidth = 110 }: DropDownProps) => {
  const [item, setItem] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setItem(event.target.value);
    callback(event.target.value)
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <FormControl sx={{ m: 1, minWidth: minWidth}}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={item}
          onChange={handleChange}
          autoWidth
          label={label}
        >
          <MenuItem value="">
                <em>None</em>
          </MenuItem>
          {
            list.map( (item: any) => {
              return (
                <MenuItem 
                key={item} 
                value={item}
                >{item}</MenuItem>
              )
            })
          }
        </Select>
      </FormControl>
    </div>
  );
}

type DropDownProps = {
  list: any[],
  callback: Function,
  label: string,
  minWidth?: number
}

export default DropDown;
