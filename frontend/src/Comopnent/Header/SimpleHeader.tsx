import React, { useEffect, useMemo, useState } from 'react';

import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

import '../../assest/css/Header.css';

import Icon from '../ui/icon/Icon';
import { useSearchScriptMutation } from '../../Redux/Script';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../ui/Loader';
import Sidebar from '../Sidebar/Sidebar';
import { object } from 'yup';
import { ActiveRoute } from '../../Menu';
import {Category} from "../../Redux/CategoryQuery";
import AutoComplete, {inputStyles} from "../AutoComplete";

const SimpleHeader = () => {
  const navigate = useNavigate();
  const [searchScript, { isLoading, data }]: any = useSearchScriptMutation();
  const [searchText, setSearchText] = useState('');

  const handleSearch = (event: React.SyntheticEvent, option: any) => {
    let url;
    switch (option?.subject) {
      case 'summaries':
        url = ActiveRoute.TapeSummaryResult;
        break;
      case 'reports':
        url = ActiveRoute.ReportDetails;
        break;
      case 'scripts':
        url = ActiveRoute.ScriptDetails;
    }

    if (url) {
      setSearchText(option.name);
      navigate(`${url.url}/${option.id}`);
    }
  };

  const fetchSearchResults = (text: string) => {
    const encodedQuery = encodeURIComponent(text);
    searchScript({ value: encodedQuery });
  };

  useEffect(() => {
    fetchSearchResults(searchText);
  }, [searchText]);

  const searchResults = useMemo(() => {
    if (typeof data === 'object') {
      const res = Object.keys(data)
        .filter((subject) => subject != 'categories')
        .map((subject) =>
          data[subject].map((item: object) => ({ ...item, subject })),
        )
        .flat();

      return res;
    }
  }, [data]);

  return (
    <div className="bg-green main-header-conatiner row mx-0">
      <div
        className="d-sm-flex d-md-none col-2 col-sm-2 text-light"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <button
          className="btn text-light "
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasScrolling"
          aria-controls="offcanvasScrolling"
        >
          <Icon icon="Menu" size="40px" color="light" />
        </button>

        <div
          className="offcanvas offcanvas-start"
          style={{ width: '212px' }}
          data-bs-scroll="true"
          data-bs-backdrop="false"
          tabIndex={-1}
          id="offcanvasScrolling"
          aria-labelledby="offcanvasScrollingLabel"
        >
          <button
            type="button"
            style={{
              position: 'absolute',
              top: ' 3px',
              right: ' 0px',
              color: 'white',
            }}
            className="btn "
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            {' '}
            <Icon icon="Close" size="20px" color="light" />
          </button>
          <Sidebar />
        </div>
      </div>
      <div className="col-sm-10 col-10 col-md-8 mx-auto search-bar-conatiner">
        <Autocomplete
          disablePortal
          options={searchResults || []}
          getOptionLabel={(option: any) =>
            option ? `${option.name || ''}  (${option.subject})` : ''
          }
          renderInput={(params) => (
            <TextField
              value={searchText}
              onChange={(ev) => setSearchText(ev.target.value)}
              {...params}
              label="Search"
            />
          )}
          onChange={handleSearch}
          sx={{ background: 'white', ...inputStyles, borderRadius: 2}}
          fullWidth
          noOptionsText="type name of a script, report, or model"
        />
      </div>
    </div>
  );
};

export default SimpleHeader;
