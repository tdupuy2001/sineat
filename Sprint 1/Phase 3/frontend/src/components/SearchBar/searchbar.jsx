import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar() {

  return (
    <TextField
        id="search"
        label="Search"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "#602A0F" }}/>
            </InputAdornment>
          ),
        }}
        variant="outlined"
        sx={{backgroundColor:'#fff'}}
        size="small"
    />
  );
}

export default SearchBar;
