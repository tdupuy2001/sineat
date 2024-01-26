import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

function AutocompleteSelect({ onAddressSelect }) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (inputValue) {
      fetch(`https://api-adresse.data.gouv.fr/search/?q=${inputValue}&limit=5`)
        .then((response) => response.json())
        .then((data) => {
          if (data.features) {
            const addresses = data.features.map(
              (feature) => feature.properties.label
            );
            setOptions(addresses);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  const handleChange = (event, value) => {
    onAddressSelect(value);
    if (value === '') {
      onAddressSelect(null); // Call with null or '' when input is cleared
    }
  };

  return (
    <Autocomplete
      freeSolo
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={handleChange}
      options={options}
      size="small"
      renderInput={(params) => (
        <TextField {...params} label="Address" variant="outlined" />
      )}
    />
  );
}

export default AutocompleteSelect;
