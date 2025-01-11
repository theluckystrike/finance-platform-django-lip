import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { CardFooter } from 'react-bootstrap';
import Pagination, { PaginationItem } from './pagination/Pagination';
import Select from './SelectPagibation';
import Option from './Option';

export const PER_COUNT = {
  3: 3,
  5: 5,
  10: 10,
  25: 25,
  50: 50,
  All: Infinity,
};

export const dataPagination = (
  data: any[],
  currentPage: number,
  perPage: number,
) => {
  if (perPage === Infinity) {
    return data;
  }
  return data.filter(
    (i, index) =>
      index + 1 > (currentPage - 1) * perPage &&
      index + 1 <= currentPage * perPage,
  );
};

interface IPaginationButtonsProps {
  setCurrentPage(...args: unknown[]): unknown;
  currentPage: number;
  perPage: number;
  setPerPage(...args: unknown[]): unknown;
  data: unknown[];
  label?: string;
}
const PaginationButtons: FC<IPaginationButtonsProps> = ({
  setCurrentPage,
  currentPage,
  perPage,
  setPerPage,
  data,
  label,
}) => {
  const totalItems = data.length;
  const totalPage = Math.ceil(totalItems / perPage);

  const pagination = () => {
    let items = [];

    let i = currentPage - 1;
    while (i >= currentPage - 1 && i > 0) {
      items.push(
        <PaginationItem key={i} onClick={() => setCurrentPage(currentPage - 1)}>
          {i}
        </PaginationItem>,
      );

      i -= 1;
    }

    items = items.reverse();

    items.push(
      <PaginationItem
        key={currentPage}
        isActive
        onClick={() => setCurrentPage(currentPage)}
      >
        {currentPage}
      </PaginationItem>,
    );

    i = currentPage + 1;
    while (i <= currentPage + 1 && i <= totalPage) {
      items.push(
        <PaginationItem key={i} onClick={() => setCurrentPage(currentPage + 1)}>
          {i}
        </PaginationItem>,
      );

      i += 1;
    }

    return items;
  };

  const getInfo = () => {
    if (perPage === Infinity) {
      return (
        <span className="pagination__desc">
          Showing all {totalItems} {label}
        </span>
      );
    }

    const start = perPage * (currentPage - 1) + 1;

    const end = perPage * currentPage;

    return (
      <span className="pagination__desc">
        Showing {start} to {end > totalItems ? totalItems : end} of {totalItems}{' '}
        {label}
      </span>
    );
  };

  return (
    <CardFooter className="row w-100">
      <div className="col-sm-12 col-md-6 col-lg-7">
        <span className="text-muted">{getInfo()}</span>
      </div>

      <div className="d-flex justify-content-end col-sm-12 col-md-6 col-lg-5">
        {totalPage > 1 && perPage !== Infinity && (
          // @ts-ignore
          <Pagination ariaLabel={label}>
            <PaginationItem
              isFirst
              isDisabled={!(currentPage - 1 > 0)}
              onClick={() => setCurrentPage(1)}
            />
            <PaginationItem
              isPrev
              isDisabled={!(currentPage - 1 > 0)}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            {currentPage - 1 > 1 && (
              <PaginationItem onClick={() => setCurrentPage(currentPage - 2)}>
                ...
              </PaginationItem>
            )}
            {pagination()}
            {currentPage + 1 < totalPage && (
              <PaginationItem onClick={() => setCurrentPage(currentPage + 2)}>
                ...
              </PaginationItem>
            )}
            <PaginationItem
              isNext
              isDisabled={!(currentPage + 1 <= totalPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
            <PaginationItem
              isLast
              isDisabled={!(currentPage + 1 <= totalPage)}
              onClick={() => setCurrentPage(totalPage)}
            />
          </Pagination>
        )}

        <Select
          // size='sm'
          style={{ width: '67px', padding: ' 0px 0px 0px 12px' }}
          ariaLabel="Per"
          onChange={(e: { target: { value: string } }) => {
            const value =
              e.target.value === 'All'
                ? Infinity
                : parseInt(e.target.value, 10);
            setPerPage(value);
            setCurrentPage(1);
          }}
          value={perPage === Infinity ? 'All' : perPage.toString()}
        >
          {Object.keys(PER_COUNT).map((i) => (
            <Option key={i} value={i}>
              {i}
            </Option>
          ))}
        </Select>
      </div>
    </CardFooter>
  );
};
PaginationButtons.propTypes = {
  setCurrentPage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  setPerPage: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  label: PropTypes.string,
};
PaginationButtons.defaultProps = {
  label: 'items',
};

export default PaginationButtons;
