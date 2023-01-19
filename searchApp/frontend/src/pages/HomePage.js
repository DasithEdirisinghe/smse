import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import OutlinedCard from "../component/Card";
import api from "../api";
import { Grid } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function HomePage() {
  const [fieldFilter, setFieldFilter] = useState(null);
  const [phraseFilter, setphraseFilter] = useState(false);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [songs, setSongs] = useState([]);
  const [aggregations, setAggregations] = useState([]);
  const[singerFilter, setSingerFilter] = useState([]);
  const [lyricistFilter, setLyricistFilter] = useState([]);
  const [composerFilter, setComposerFilter] = useState([]);

  /**
   * Fetch meta data aggregations from backend
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const metaData = await api.meta.data();
        console.log(metaData.data);
        setAggregations(metaData.data.aggregations);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData().catch((err) => console.log(err));
  }, []);

  /**
   * Handlers
   * @param {*} event
   */
  const handleFieldFilterChange = (event) => {
    console.log(event.target.value);
    if (event.target.value === 'All'){
      setFieldFilter(null);
    } else {
      setFieldFilter(event.target.value);
    }
  };

  const handleSearchBarChange = (event) => {
    setSearchBarValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!searchBarValue || searchBarValue == "") {
      alert("Please enter a search query");
    }
    await fetchData(searchBarValue, fieldFilter, phraseFilter);
  };

  /**
   * Fetch songs from backend
   * @param {*} queryValue
   * @param {*} fieldValue
   */
  const fetchData = async (queryValue, fieldValue, phraseFilter) => {
    try {
      const res = await api.query.search({
        queryData: {
          query: queryValue,
          field: fieldValue,
          phrase: phraseFilter
        },
      });
      console.log(res);
      if (res.status != 200) {
        alert(res.message);
      } else {
        setSongs(res.data.hits);
        setAggregations(res.data.aggs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterBySinger = async (event) => {
    const query = event.target.value;
    setSingerFilter(query);
    await fetchData(query, "Singer");
  };

  const handleFilterByLyricist = async (event) => {
    const query = event.target.value;
    setLyricistFilter(query);
    await fetchData(query, "Lyricist");
  };

  // const handleFilterByComposer = async (event) => {
  //   const query = event.target.value;
  //   setComposerFilter(query);
  //   await fetchData(query, "Composer Sinhala");
  // };

  /**
   * Clear all the filters
   */

  const handleClear = async (event) => {
    event.preventDefault();
    setFieldFilter(null);
    setSearchBarValue("");
    setSingerFilter("");
    setLyricistFilter("");
    setComposerFilter("");
    setSongs([]);
  }

  return (
    <div className="Container p-4">
      <div className="grid grid-cols-3 gap-4">
        <div className=" px-4">
          <TextField
            id="outlined-basic"
            label="Search Bar"
            variant="outlined"
            value={searchBarValue}
            onChange={handleSearchBarChange}
          />
        </div>
        <div className="flex flex-row">
        <div className=" px-4">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              value={fieldFilter}
              onChange={handleFieldFilterChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {fieldFilterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Filter by Fields</FormHelperText>
          </FormControl>
        </div>
        <div className="">
        <FormControlLabel
                  control={
                    <Checkbox
                      checked={phraseFilter}
                      onChange={(e) => {
                        setphraseFilter(e.target.checked);
                        console.log("Changed");
                      }}
                      name="Phrase Search"
                    />
                  }
                  label="Phrase Search"
                />
        </div>
        </div>
        <div className="col px-4">
          <Button className = "px-2" variant="outlined" onClick={handleSubmit}>
            Search
          </Button>
          <Button variant="outlined" onClick={handleClear}>
            Clear
          </Button>
        </div>

      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {songs.length > 0
            ? songs.map((song) => OutlinedCard({ song: song["_source"] }))
            : ""}
        </div>
        <div className="">
          <div className="flex flex-row">
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={singerFilter}
                onChange={handleFilterBySinger}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                {aggregations?.singer_filter?.buckets.map((option) => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.key}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Filter by Singers</FormHelperText>
            </FormControl>
          </div>
          <div className="flex flex-row">
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={lyricistFilter}
                onChange={handleFilterByLyricist}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                {aggregations?.lyricist_filter?.buckets.map((option) => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.key}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Filter by Lyricist</FormHelperText>
            </FormControl>
          </div>
          {/* <div className="flex flex-row">
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={composerFilter}
                onChange={handleFilterByComposer}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                {aggregations?.composer_agg?.buckets.map((option) => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.key}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Filter by Composer</FormHelperText>
            </FormControl>
          </div> */}
        </div>
      </div>
    </div>
  );
}

const fieldFilterOptions = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "Title",
    label: "Title",
  },
  {
    value: "Singer",
    label: "Singer",
  },
  {
    value: "Lyricist",
    label: "Lyricist",
  },
  {
    value: "Meaning",
    label: "Meaning",
  },
  {
    value: "Source Domain",
    label: "Source Domain",
  },
  {
    value: "Target Domain",
    label: "Target Domain",
  },
  {
    label: "Metopher",
    value: "Metopher",
  },
  {
    label: "Lyrics",
    value: "Lyrics",
  },
];
