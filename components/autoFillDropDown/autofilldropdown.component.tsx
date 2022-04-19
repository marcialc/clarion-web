import { Autocomplete, styled, TextField } from "@mui/material";
import React, { useState } from "react";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '1rem'
  },
});

const AutoFillDropDown = ({ list, callback, label, disabled, selectedList }: DropDownProps) => {
  const [value, setValue] = useState('');
  const classes = useStyles();

  const handleChange = (input: string) => {
    setValue(input);
    if(list.includes(input)) callback(input);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Autocomplete
        disabled={disabled}
        value={disabled? 'max coins selected': value}
        className={classes.root}
        onChange={(event: any, newValue: string) => {
          handleChange(newValue);
        }}
        options={list}
        sx={{ width: 200 }}
        renderInput={(params) => <TextField className={classes.root} {...params} label={label} />}
      />
    </div>
  );
}

type DropDownProps = {
  list: any[],
  callback: Function,
  label: string,
  disabled: boolean,
  selectedList: string[];
}

export default AutoFillDropDown;
